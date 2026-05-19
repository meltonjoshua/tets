import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { message, household_id, history } = body;

  if (!message || typeof message !== 'string') {
    return Response.json({ error: 'Message is required' }, { status: 400 });
  }

  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    return Response.json({
      reply: "I'm still being set up! Please configure the OpenAI API key to enable AI features. In the meantime, I can suggest adding items to your shopping list or checking your chores from the main screens.",
    });
  }

  try {
    const systemPrompt = `You are Flatmate, the AI assistant for OurFlat — a life management app for two people sharing a home. You help with meal planning, shopping suggestions, chore scheduling, expense tracking, and home management. Be friendly, concise, and helpful. If asked about specific data (shopping lists, chores, calendar), acknowledge that you'll check but provide general advice. Suggest concrete actions the user can take within the app.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm having trouble thinking right now. Please try again!";

    return Response.json({ reply });
  } catch (error) {
    return Response.json({
      reply: "I'm having trouble connecting right now. Please try again in a moment.",
    });
  }
}