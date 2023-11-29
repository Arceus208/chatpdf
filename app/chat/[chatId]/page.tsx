import { ChatComponent } from "@/components/chat-component";
import { ChatSideBar } from "@/components/chat-sidebar";
import { PDFViewer } from "@/components/pdf-viewer";
import prismadb from "@/lib/primadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type ChatPageProps = {
  params: {
    chatId: string;
  };
};

const ChatIdPage = async ({
  params: { chatId },
}: ChatPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const chats = await prismadb.chat.findMany({
    where: { userId },
  });

  if (chats.length === 0) {
    return redirect("/");
  }

  const chat = await prismadb.chat.findUnique({
    where: { id: chatId, userId },
  });

  const messages =
    await prismadb.message.findMany({
      where: { chatId },
    });

  if (!chat) {
    return redirect("/");
  }

  return (
    <div className="flex max-w-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <ChatSideBar
            chats={chats}
            chatId={chat.id}
          ></ChatSideBar>
        </div>
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          <PDFViewer
            pdf_url={chat.pdfUrl || ""}
          ></PDFViewer>
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent
            chatId={chat.id}
            initialMessages={messages}
          ></ChatComponent>
        </div>
      </div>
    </div>
  );
};

export default ChatIdPage;
