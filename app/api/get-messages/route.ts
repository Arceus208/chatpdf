import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { chatId } = await req.json();
    const messages =
      await prismadb.message.findMany({
        where: { chatId },
      });

    return NextResponse.json(messages);
  } catch (error) {
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
