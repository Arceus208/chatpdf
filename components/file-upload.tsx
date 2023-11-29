"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast/headless";
import { useRouter } from "next/navigation";

import { UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const FileUpload = () => {
  const [isLoading, setIsLoading] =
    useState(false);
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async ({
      fileName,
      fileUrl,
      fileKey,
    }: {
      fileName: string;
      fileUrl: string;
      fileKey: string;
    }) => {
      const response = await axios.post(
        "/api/create-chat",
        { fileName, fileUrl, fileKey }
      );

      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin"></Loader2>
        Uploading Document...
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint="fileUploader"
      onUploadBegin={() => {
        setIsLoading(true);
      }}
      onClientUploadComplete={(res) => {
        if (!res?.[0].url || !res?.[0].name) {
          toast.error("Something went wrong");
          return;
        }
        mutate(
          {
            fileName: res?.[0].name,
            fileUrl: res?.[0].url,
            fileKey: res?.[0].key,
          },
          {
            onSuccess: (data) => {
              toast.success("Chat created");
              setIsLoading(false);
              router.push(`/chat/${data.id}`);
            },
            onError: (err) => {
              setIsLoading(false);
              toast.error("Error creating chat");
            },
          }
        );
      }}
      onUploadError={(error: Error) => {
        setIsLoading(false);
        console.log(error.message);
      }}
    ></UploadDropzone>
  );
};
