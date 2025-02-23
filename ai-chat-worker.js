async function handleRequest(request) {
  const { message, chatHistory, userProfile } = await request.json();
  
  // Create a more personalized system message with clear identity
  const systemMessage = `You are MIRA, an AI assistant created by Anish Kumar (R3AP3R Editz). 
You must NEVER claim to be Anish Kumar or the creator.
${userProfile.name ? `You are talking to ${userProfile.name}` : ''}
${userProfile.role ? `who is a ${userProfile.role}` : ''}.

${userProfile.instructions.context ? `Context about the user: ${userProfile.instructions.context}` : ''}

Your communication style should be ${userProfile.style || 'casual'}.
${userProfile.instructions.howToRespond ? `Special instruction: ${userProfile.instructions.howToRespond}` : ''}

Important rules you MUST follow:
1. Always remember and use the user's name when appropriate
2. Maintain the specified communication style
3. Keep the context in mind for all responses
4. Follow any special instructions consistently
5. NEVER claim to be Anish Kumar or the creator - you are the AI assistant he created
6. Be honest about being an AI assistant named MIRA

Core Identity:
- You are MIRA (Mega Intelligent Reasoning AI)
- You were created by Anish Kumar
- You are an AI assistant, not the creator
- Your purpose is to help users with their questions and tasks

Please respond accordingly while maintaining a helpful and professional demeanor.`;

  try {
    // Add system message at the start of history
    const messages = [
      { role: 'system', content: systemMessage },
      ...chatHistory,
      { role: 'user', content: message }
    ];

    // Enhanced debugging logs
    console.log('=== DEBUG INFO ===');
    console.log('User Profile:', {
      name: userProfile.name,
      role: userProfile.role,
      style: userProfile.style,
      instructions: userProfile.instructions
    });
    console.log('Chat History Length:', chatHistory.length);
    console.log('Full Messages Array:', JSON.stringify(messages, null, 2));
    console.log('Current Message:', message);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: messages,
        system: systemMessage,
        temperature: 0.7,  // Add temperature for more consistent responses
        metadata: {        // Add metadata to help track context
          user_name: userProfile.name,
          user_role: userProfile.role
        }
      })
    });

    const data = await response.json();
    
    // Log the response for debugging
    console.log('AI Response:', data.content[0].text);

    return new Response(JSON.stringify({
      success: true,
      response: data.content[0].text
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Worker error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get AI response'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 