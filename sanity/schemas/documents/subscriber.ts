import { defineField, defineType } from "sanity";

export default defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  fields: [
    // replace email field with:
defineField({
  name: "email",
  title: "Email",
  type: "string",
  validation: (Rule) =>
    Rule.required().email().custom(async (value, context) => {
      if (!value) return true;
      const { getClient } = context as any;
      const client = getClient({ apiVersion: "2024-01-01" });
      const exists = await client.fetch(
        `count(*[_type=="subscriber" && lower(email)==lower($email)])`,
        { email: value }
      );
      return exists > 0 ? "This email is already subscribed." : true;
    }),
})
,
    defineField({ name: "status", title: "Status", type: "string", initialValue: "active" }),
    defineField({ name: "source", title: "Source", type: "string" }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime" }),
    defineField({ name: "ip", title: "IP", type: "string" }),
    defineField({ name: "userAgent", title: "User Agent", type: "string" }),
  ],
});
