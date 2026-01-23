"use client";

import { useEffect } from "react";

export default function ChatbaseClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("chatbase-script")) return; // prevent double load

    // Wrap the original Chatbase snippet
    window.chatbase = window.chatbase || function (...args: any[]) {
      if (!window.chatbase.q) window.chatbase.q = [];
      window.chatbase.q.push(args);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") return target.q;
        return (...args: any[]) => target(prop, ...args);
      },
    });

    const onLoad = () => {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "chatbase-script";
      script.domain = "www.chatbase.co";
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
  }, []);

  return null;
}
