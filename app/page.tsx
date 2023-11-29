"use client";

import {
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";
import {
  redirect,
  useRouter,
} from "next/navigation";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { userId } = useAuth();
  const isAuth = !!userId;
  const router = useRouter();

  return (
    <div className="w-screen min-h-screen h-full bg-gradient-to-r from-slate-50 to-slate-500">
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">
              Chat with any PDF
            </h1>
            <UserButton afterSignOutUrl="/"></UserButton>
          </div>

          <div className="flex mt-2">
            {isAuth && (
              <Button
                onClick={() => {
                  router.push("/chat");
                }}
              >
                Go to Chat
              </Button>
            )}
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Upload your pdf file and chat with bot
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <div className="">
                <FileUpload></FileUpload>
              </div>
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2"></LogIn>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
