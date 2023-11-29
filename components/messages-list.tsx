import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "./chat-component";

type MessagesListProps = {
  messages: Message[];
};

export const MessagesList = ({
  messages,
}: MessagesListProps) => {
  /* if (isLoading)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin"></Loader2>
      </div>
    ); */

  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user"
              ? "justify-end pl-10"
              : "justify-start"
          )}
        >
          <div
            className={cn(
              "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
              message.role === "user"
                ? "bg-blue-600 text-white"
                : ""
            )}
          >
            <p>{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
