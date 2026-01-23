"use client";

import { useEffect } from "react";

export default function ChatbaseClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("chatbase-script")) return; // Prevent double load

    const s = document.createElement("script");
    s.src = "https://www.chatbase.co/embed.min.js";
    s.id = "chatbase-script";
    s.onload = () => {
      // Initialize Chatbase
      window.chatbase = window.chatbase || function () {
        (window.chatbase.q = window.chatbase.q || []).push(arguments);
      };
      window.chatbase("init", {
        chatbotId: "EHdHN1otJBP2Cys6XWLQ2", // <-- Replace this
        domain: "www.chatbase.co",
      });
    };
    document.body.appendChild(s);
  }, []);

  return null;
}
