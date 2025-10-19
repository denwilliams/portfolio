import { NextRequest } from 'next/server'
import { Agent, run } from '@openai/agents'
import { instructions } from './instructions'

// Configure the agent with Dennis's portfolio context
const portfolioAgent = new Agent({
  name: 'Portfolio Assistant',
  model: 'gpt-4.1-mini',
  instructions,
})

// In-memory session store (in production, use a database)
const sessions = new Map<string, any[]>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatInput, sessionId } = body

    if (!chatInput || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing chatInput or sessionId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get or create session history
    const history = sessions.get(sessionId) || []

    // Build the prompt with history
    let prompt = chatInput
    if (history.length > 0) {
      prompt = history.map((msg: any) =>
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n\n') + `\n\nUser: ${chatInput}`
    }

    // Set API key for OpenAI
    process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY!

    // Create a text stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Run the agent with streaming
          const result = await run(portfolioAgent, prompt, {
            stream: true,
          })

          // Convert to text stream and pipe chunks
          const textStream = result.toTextStream()
          let fullResponse = ''

          for await (const chunk of textStream) {
            fullResponse += chunk
            controller.enqueue(encoder.encode(chunk))
          }

          // Wait for completion
          await result.completed

          // Update session history
          const updatedHistory = [
            ...history,
            { role: 'user', content: chatInput },
            { role: 'assistant', content: fullResponse }
          ]
          sessions.set(sessionId, updatedHistory)

          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
          controller.enqueue(encoder.encode(`Error: ${errorMessage}`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
