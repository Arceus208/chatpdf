import prismadb from "@/lib/primadb";
import {
  auth,
  redirectToSignIn,
} from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ChatPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const chat = await prismadb.chat.findFirst({
    where: { userId },
  });

  if (chat) {
    return redirect(`/chat/${chat.id}`);
  }

  return redirect("/");
};

export default ChatPage;
