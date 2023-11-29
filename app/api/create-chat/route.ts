import { NextResponse } from "next/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PDFPage } from "@/types/pdftype";
import { currentUser } from "@clerk/nextjs";

import {
  embedDocument,
  getPineconeClient,
  prepareDocument,
} from "@/lib/pinecone";
import prismadb from "@/lib/primadb";
import { convertToAscii } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();
    const { fileName, fileUrl, fileKey } = body;
    console.log(fileUrl);
    const fileFromURL = await fetch(fileUrl);
    const file = await fileFromURL.blob();

    const loader = new PDFLoader(file);
    const pages =
      (await loader.load()) as PDFPage[];

    const documents = await Promise.all(
      pages.map(prepareDocument)
    );

    const vectors = await Promise.all(
      documents.flat().map(embedDocument)
    );

    const client = await getPineconeClient();

    const pineconeIndex = client.Index(
      process.env.PINECONE_INDEX! || ""
    );

    /* const namespace = pineconeIndex.namespace(
      convertToAscii(fileKey)
    ); */

    pineconeIndex.upsert(vectors);

    const chat = await prismadb.chat.create({
      data: {
        userId: user.id,
        pdfName: fileName,
        pdfUrl: fileUrl,
        fileKey,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.log("[CREATE_CHAT]", error);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
