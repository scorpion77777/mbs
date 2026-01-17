import { NextResponse } from "next/server";
import { Resend } from "resend";
import { neon } from "@neondatabase/serverless";

<<<<<<< HEAD

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { neon } from "@neondatabase/serverless";

=======
>>>>>>> b9214749bd94cd72a03250d83bfd0cf934d33334
const sql = neon(process.env.DATABASE_URL!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Save subscriber (deduplicated)
    await sql`
      INSERT INTO subscribers (email, source)
      VALUES (${email}, 'homepage')
      ON CONFLICT (email) DO NOTHING;
    `;

    // Save to Resend audience
    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> b9214749bd94cd72a03250d83bfd0cf934d33334
