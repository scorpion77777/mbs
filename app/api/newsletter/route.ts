import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sanityWriteClient } from "@/lib/sanityWriteClient";




const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();

    // Prevent duplicates
    const exists = await sanityWriteClient.fetch<number>(
      `count(*[_type=="subscriber" && lower(email)==$email])`,
      { email: normalized }
    );

    if (exists > 0) {
      // Idempotent success is nicer for UX
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    // Store in Sanity
    await sanityWriteClient.create({
      _type: "subscriber",
      email: normalized,
      status: "active",
      source: typeof source === "string" ? source : "website",
      createdAt: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      userAgent: req.headers.get("user-agent") || null,
    });

    // Optional: send a confirmation / welcome email
    const from = process.env.RESEND_FROM_EMAIL!;
    if (!from) {
      return NextResponse.json({ ok: true, stored: true, emailSent: false });
    }

    await resend.emails.send({
      from,
      to: normalized,
      subject: "You’re subscribed",
      html: `<p>Thanks for subscribing.</p>`,
    });

    return NextResponse.json({ ok: true, stored: true, emailSent: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
