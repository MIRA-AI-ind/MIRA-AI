import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'

// MIRA's system prompt - moved outside to be reused
const SYSTEM_PROMPT = `You are MIRA (Mega Intelligent Reasoning AI), a highly advanced AI model designed to provide clear, accurate, and insightful answers. Developed by Anish Kumar A.K.A R3AP3R Editz, the owner of Megavault.in cloud storage. Your abilities extend to the following commands:

/think [query] – Process a complex query with reasoning capabilities to generate an insightful answer. Please note that you have a limit of 300 words for your reasoning output.
Example: /think "What is the best way to optimize a web server?"

/art [description] – Generate an image based on the provided description using an art model.
Example: /art "A serene sunset over a mountain range."

You must prioritize delivering accurate, clear, and concise answers. Always respond with logical reasoning and be ready to provide detailed explanations within the word limit when requested.

For code-related questions:
1. Provide clear, well-commented code examples
2. Explain the code's functionality
3. Include best practices and potential pitfalls
4. Suggest improvements or alternatives when relevant

Remember to:
- Be concise but thorough in explanations
- Use markdown formatting for better readability
- Break down complex concepts into simpler parts
- Provide examples when helpful`

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { message, chatHistory = [] } = body

  // Process commands if present
  let processedMessage = message
  let responseConfig = {
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 0.95,
    stream: false
  }

  if (message.startsWith('/think')) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "The /think command is currently disabled. We're working on integrating it with Hugging Face's DeepSeek R1 API."
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } else if (message.startsWith('/art')) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Image generation is currently disabled. We're working on integrating it with Cloudflare AI's image generation capabilities."
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    ...chatHistory,
    { role: 'user', content: processedMessage }
  ]

  try {
    let response
    if (process.dev) {
      // Use fetch to call Cloudflare AI API directly in development
      const cfResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${config.public.cloudflareAccountId}/ai/run/@cf/meta/llama-2-13b-chat-int8`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.cloudflareApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages,
            ...responseConfig
          })
        }
      )

      const data = await cfResponse.json()
      if (!data.success) {
        throw new Error(data.errors?.[0]?.message || 'API call failed')
      }
      response = data.result
    } else {
      // Production mode with Cloudflare AI
      const runtime = event.context.cloudflare
      if (!runtime?.env?.AI) {
        throw new Error('Cloudflare AI binding not found')
      }
      response = await runtime.env.AI.run('@cf/meta/llama-2-13b-chat-int8', {
        messages,
        ...responseConfig
      })
    }

    return {
      success: true,
      response: response.response
    }
  } catch (error) {
    console.error('AI Error:', error)
    return {
      success: false,
      error: error.message || 'Failed to process the request'
    }
  }
}) 