export const runtime = "edge"

export function GET() {
  const body = "google.com, pub-6460615081786537, DIRECT, f08c47fec0942fa0\n"
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}
