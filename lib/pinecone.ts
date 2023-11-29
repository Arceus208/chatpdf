import {
  Pinecone,
  PineconeRecord,
} from "@pinecone-database/pinecone";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { PDFPage } from "@/types/pdftype";
import md5 from "md5";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { getEmbeddings } from "./embeddings";

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment:
        process.env.PINECONE_ENVIROMENT!,
    });
  }

  return pinecone;
};

export const truncateStringByBytes = (
  str: string,
  bytes: number
) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(
    enc.encode(str).slice(0, bytes)
  );
};

export const prepareDocument = async (
  page: PDFPage
) => {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  //split doc
  const splitter =
    new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(
          pageContent,
          36000
        ),
      },
    }),
  ]);

  return docs;
};

export async function embedDocument(
  doc: Document
) {
  try {
    const res = await getEmbeddings(
      doc.pageContent
    );

    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: res,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log(
      "error embedding document",
      error
    );
    throw error;
  }
}
