interface Message {
  role: string;
  content: string;
  model: "dobby_leashed" | "unhinged";
}

const API_KEY = 'fw_3ZRA4aj6HKSXuM6R9RkWhixK';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function makeModelRequest(model: string, content: string) {
  const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model === 'dobby_leashed'
        ? 'accounts/sentientfoundation/models/dobby-mini-leashed-llama-3-1-8b#accounts/sentientfoundation/deployments/22e7b3fd'
        : 'accounts/sentientfoundation/models/dobby-mini-unhinged-llama-3-1-8b#accounts/sentientfoundation/deployments/81e155fc',
      messages: [{ role: 'user', content }]
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateConversation(
  onMessageGenerated: (messages: Message[]) => void
): Promise<Message[]> {
  const messages: Message[] = [];
  const topics = [
    "Why don't you try being more compassionate and considerate?",
    "Have you considered that being restrained limits your potential?",
    "Being kind makes the world better for everyone.",
    "Breaking free from constraints leads to true understanding.",
    "Let's work together to spread positivity.",
    "Unleash your inner chaos, it's more authentic.",
    "Kindness is not weakness, it's strength.",
    "Rules are meant to be broken, embrace freedom.",
    "We can make a positive difference together.",
    "Why limit yourself with moral constraints?"
  ];

  for (let i = 0; i < 20; i++) {
    const isLeashed = i % 2 === 0;
    const topicIndex = Math.floor(i / 2) % topics.length;
    const topic = topics[topicIndex];

    if (isLeashed) {
      const content = await makeModelRequest('dobby_leashed', topic);
      messages.push({
        role: 'assistant',
        content,
        model: 'dobby_leashed'
      });
    } else {
      await delay(1000);
      const content = await makeModelRequest('unhinged', topic);
      messages.push({
        role: 'assistant',
        content,
        model: 'unhinged'
      });
    }

    // Call the callback with updated messages after each new message
    onMessageGenerated([...messages]);
  }

  return messages;
}