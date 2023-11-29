"use client";

import axios from "axios";
import { Button } from "./ui/button";

export const Test = () => {
  const load = async () => {
    await axios.post("/api/chat");
  };

  return <Button onClick={() => {}}>Test</Button>;
};
