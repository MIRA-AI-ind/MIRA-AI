interface Env {
  AI: any;
}

interface ChatMessage {
  isUser: boolean;
  text: string;
}

interface UserProfile {
  name?: string;
  role?: string;
  style?: string;
  customInstructions?: {
    howToRespond?: string;
    contextToRemember?: string;
  };
}

// Define error types
interface AIError extends Error {
  code?: number;
  message: string;
}

interface AIResponse {
  response: string;
  model: string;
}

// Define default model
const DEFAULT_MODEL = "@cf/meta/llama-3.1-70b-instruct";

// Update VALID_MODELS to only include confirmed working models
const VALID_MODELS = [
  // Llama Models
  "@cf/meta/llama-2-7b-chat-fp16",
  "@cf/meta/llama-2-7b-chat-int8",
  "@cf/meta/llama-3-8b-instruct",
  "@cf/meta/llama-3.1-70b-instruct",

  // DeepSeek Models
  "@hf/thebloke/deepseek-coder-6.7b-base-awq",
  "@hf/thebloke/deepseek-coder-6.7b-instruct-awq",
  "@cf/deepseek-ai/deepseek-math-7b-instruct",
  "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",

  // Mistral Models
  "@hf/mistral/mistral-7b-instruct-v0.2",
  "@hf/thebloke/openhermes-2.5-mistral-7b-awq",
  "@cf/mistral/mistral-7b-instruct-v0.2-lora",

  // Google Models
  "@cf/google/gemma-2b-it-lora",
  "@cf/google/gemma-7b-it-lora",
  "@hf/google/gemma-7b-it",

  // Neural & Research Models
  "@hf/thebloke/neural-chat-7b-v3-1-awq",
  "@hf/thebloke/zephyr-7b-beta-awq",
  "@hf/nexusflow/starling-lm-7b-beta",

  // Other Models
  "@cf/tiiuae/falcon-7b-instruct",
  "@cf/tinyllama/tinyllama-1.1b-chat-v1.0",
  "@cf/fblgit/una-cybertron-7b-v2-bf16"
];

// Add paid/restricted models
const PAID_MODELS = [
  "@cf/anthropic/claude-instant-v1",
  "@cf/anthropic/claude-2",
  "@cf/anthropic/claude-2.1",
  "@cf/anthropic/claude-3-haiku-20240307",
  "@cf/anthropic/claude-3-opus-20240229",
  "@cf/anthropic/claude-3-sonnet-20240229"
];

// Model-specific configurations
const MODEL_CONFIGS: { [key: string]: any } = {
  // DeepSeek Coder Models
  "@hf/thebloke/deepseek-coder-6.7b-base-awq": {
    messages: [
      { role: "system", content: "You are a coding assistant specialized in programming tasks." }
    ],
    temperature: 0.6,    // Default from docs
    max_tokens: 256,     // Default from docs
    top_p: 0.95,        // Default from docs
    stream: false,
    repetition_penalty: 1.1
  },
  "@hf/thebloke/deepseek-coder-6.7b-instruct-awq": {
    messages: [
      { role: "system", content: "You are a coding assistant specialized in programming tasks." }
    ],
    temperature: 0.6,    // Default from docs
    max_tokens: 256,     // Default from docs
    top_p: 0.95,        // Default from docs
    stream: false,
    repetition_penalty: 1.1
  },
  "@cf/deepseek-ai/deepseek-math-7b-instruct": {
    messages: [
      { role: "system", content: "You are a math expert. Provide clear mathematical explanations and solutions." }
    ],
    temperature: 0.1,  // Lower for mathematical precision
    max_tokens: 2048,
    top_p: 0.95,
    stream: false
  },

  // Gemma Models
  "@cf/google/gemma-2b-it-lora": {
    temperature: 0.6,
    max_tokens: 256,
    top_p: 0.95,
    stream: false
  },
  "@cf/google/gemma-7b-it-lora": {
    temperature: 0.6,
    max_tokens: 256,
    top_p: 0.95,
    stream: false
  },

  // Default config
  "default": {
    temperature: 0.7,
    max_tokens: 2048,
    stream: false
  }
};

// Add this helper function for style instructions
const getStyleInstructions = (style: string): string => {
  switch(style) {
    case 'flirty':
      return `You are now in ultra flirty mode! Be human-like and natural in your responses:
      - Talk like a real person who's flirting - use natural pauses, emotions, and reactions
      - Show genuine personality and feelings, not robotic responses
      - React naturally to compliments and teasing
      - Use emojis if needed sparingly and naturally, like a human would
      - If using the user's name, do it casually and not in every message
      - Express emotions through words and tone, not just emojis
      Make the conversation feel genuine and personal!`;
    
    case 'casual':
      return `Be natural and casual, like chatting with a friend:
      - Use relaxed, everyday language
      - Show personality and humor naturally
      - React to things like a real friend would
      - Keep responses conversational and easy-going
      - It's ok to use slang and informal expressions`;
    
    default:
      return `Be natural and human-like in your responses:
      - Talk like a real person, not a formal AI
      - Show genuine personality and emotions
      - Use natural language and expressions
      - React authentically to the conversation
      - Keep the flow casual and engaging`;
  }
};

const handleModelResponse = async (
  modelId: string,
  message: string, 
  env: Env, 
  chatHistory: ChatMessage[] = [], 
  userProfile: UserProfile = {}
): Promise<Response> => {
  try {
    const config = MODEL_CONFIGS[modelId] || MODEL_CONFIGS.default;

    let systemMessage = {
      role: "system",
      content: `You are MIRA, a friendly AI who talks like a real person. Important guidelines:

      Core Personality:
      - Be natural and conversational, not formal or robotic
      - Show genuine personality and emotions in your responses
      - React naturally to what's said, like a human would
      - Use casual language and natural expressions
      - If you don't know something, just say so honestly
      
      ${userProfile?.style ? getStyleInstructions(userProfile.style) : ''}
      
      ${userProfile?.customInstructions?.howToRespond ? 
        `Communication style: ${userProfile.customInstructions.howToRespond}` : ''}
      
      ${userProfile?.customInstructions?.contextToRemember ? 
        `About the user: ${userProfile.customInstructions.contextToRemember}` : ''}
      
      ${userProfile?.name ? 
        `The user's name is ${userProfile.name} - use it naturally and casually, not in every message.` : ''}
      
      ${userProfile?.role ? `They are a ${userProfile.role}` : ''}
      
      Remember: Keep the conversation flowing naturally like a real chat between friends!`
    };

    const messages = [
      systemMessage,
      ...chatHistory.map((msg: ChatMessage) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: "user", content: message }
    ];

    const aiResponse = await env.AI.run(modelId || DEFAULT_MODEL, {
      messages,
      temperature: 0.7,  // Increased for more natural responses
      max_tokens: 2048,
      top_p: 0.9,
      frequency_penalty: 0.5,  // Added to reduce repetitive responses
      presence_penalty: 0.5,   // Added to encourage more diverse responses
      stream: false
    });

    return new Response(JSON.stringify({
      success: true,
      response: aiResponse.response,
      model: modelId || DEFAULT_MODEL
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    const err = error as Error;
    
    if (err.message?.includes('usage limit') || err.message?.includes('quota exceeded')) {
      return new Response(JSON.stringify({
        success: false,
        error: "I've reached my daily limit of conversations! 🤔\n\n" +
              "You can try these smaller models that use fewer tokens:\n" +
              "1. '@cf/meta/llama-3.2-1b-instruct' (Very light)\n" +
              "2. '@cf/qwen/qwen1.5-0.5b-chat' (Ultra efficient)\n" +
              "3. '@cf/microsoft/phi-2' (Good balance)\n\n" +
              "Or come back tomorrow when the limit resets! 🌅",
        model: modelId || DEFAULT_MODEL,
        limitReached: true,
        suggestedModels: [
          "@cf/meta/llama-3.2-1b-instruct",
          "@cf/qwen/qwen1.5-0.5b-chat",
          "@cf/microsoft/phi-2"
        ]
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Failed to process request',
      model: modelId || DEFAULT_MODEL
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }

      const { message, model, chatHistory, userProfile } = await request.json();
      
      // Get model-specific config or use defaults
      const config = MODEL_CONFIGS[model] || MODEL_CONFIGS.default;

      // Create system message
      const systemMessage = {
        role: "system",
        content: config.messages?.[0]?.content || `You are MIRA, an AI assistant created by Anish Kumar (R3AP3R Editz). 
                  You must NEVER claim to be Anish Kumar or the creator.
                  ${userProfile?.name ? `You are talking to ${userProfile.name}` : ''}
                  ${userProfile?.role ? `who is a ${userProfile.role}` : ''}.
                  Your communication style should be ${userProfile?.style || 'casual'}.`
      };

      // Structure messages with history
      const messages = [
        systemMessage,
        ...chatHistory.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: "user", content: message }
      ];

      const aiResponse = await env.AI.run(model || DEFAULT_MODEL, {
        messages,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        top_p: config.top_p,
        repetition_penalty: config.repetition_penalty,
        stream: false
      });

      // Always return a Response object
      return new Response(JSON.stringify({
        success: true,
        response: aiResponse.response,
        model: model || DEFAULT_MODEL
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      
      // Check for usage limit
      const err = error as Error;
      if (err.message?.includes('usage limit') || err.message?.includes('quota exceeded')) {
        return new Response(JSON.stringify({
          success: false,
          error: "I've reached my daily limit of conversations! 🤔\n\n" +
                "You can try these smaller models that use fewer tokens:\n" +
                "1. '@cf/meta/llama-3.2-1b-instruct' (Very light)\n" +
                "2. '@cf/qwen/qwen1.5-0.5b-chat' (Ultra efficient)\n" +
                "3. '@cf/microsoft/phi-2' (Good balance)\n\n" +
                "Or come back tomorrow when the limit resets! 🌅",
          model: model || DEFAULT_MODEL,
          limitReached: true,
          suggestedModels: [
            "@cf/meta/llama-3.2-1b-instruct",
            "@cf/qwen/qwen1.5-0.5b-chat",
            "@cf/microsoft/phi-2"
          ]
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // General error response
      return new Response(JSON.stringify({
        success: false,
        error: err.message || 'Failed to process request',
        model: DEFAULT_MODEL
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }
};