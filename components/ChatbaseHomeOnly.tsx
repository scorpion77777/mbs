"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function ChatbaseHomeOnly() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <>
      <Script id="chatbase-config" strategy="afterInteractive">
        {`
          window.chatbaseConfig = {
            chatbotId: "${process.env.NEXT_PUBLIC_CHATBASE_ID}"
          };
        `}
      </Script>

      <Script
        src="https://www.chatbase.co/embed.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
