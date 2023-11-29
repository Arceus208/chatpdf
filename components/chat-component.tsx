"use client";

import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { MessagesList } from "./messages-list";
import {
  ElementRef,
  useEffect,
  useRef,
} from "react";

import { Message } from "@prisma/client";

type ChatComponentProps = {
  chatId: string;
  initialMessages: Message[];
};

export type ChatMessage = {
  role: "system" | "user";
  content: string;
};

export const ChatComponent = ({
  chatId,
  initialMessages,
}: ChatComponentProps) => {
  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
  } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: initialMessages || [],
  });

  const scrollRef =
    useRef<ElementRef<"div">>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div className="relative max-h-screen overflow-scroll">
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">
          Chat
        </h3>
      </div>
      <MessagesList
        messages={messages}
      ></MessagesList>
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          ></Input>
          <Button className="bg-blue-600 ml-2">
            <Send className="w-4 h-4"></Send>
          </Button>
        </div>
      </form>
      <div ref={scrollRef}></div>
    </div>
  );
};
