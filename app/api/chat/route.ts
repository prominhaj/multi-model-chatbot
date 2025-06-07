import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

// Create OpenRouter client using OpenAI-compatible interface
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "Multi-Model Chatbot",
  },
})

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    const result = streamText({
      model: openrouter(model),
      messages,
      temperature: 0.7,
      maxTokens: 4000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
