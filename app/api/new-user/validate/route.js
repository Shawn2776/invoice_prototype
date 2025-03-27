import { businessTypeSchema } from "@/lib/validation";

export async function POST(request) {
  console.log("in backend");

  const body = await request.json();
  const result = businessTypeSchema.safeParse(body);

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error.format() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
