import OpenAI from "openai";

export type LlmModel = "gpt-4o-mini" | "gpt-4o" | "gpt-4.1";
export type PerplexityModel = "llama-3.1-sonar-small-128k-online" | "llama-3.1-sonar-huge-128k-online";

type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callLlm({
  model = "gpt-4o-mini",
  messages,
  temperature = 0.2,
  maxTokens = 800,
}: {
  model?: LlmModel;
  messages: LlmMessage[];
  temperature?: number;
  maxTokens?: number;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const content = completion.choices[0]?.message?.content || "";
  return content;
}

export async function callPerplexity({
  model = "llama-3.1-sonar-small-128k-online",
  messages,
  temperature = 0.2,
  maxTokens = 800,
}: {
  model?: PerplexityModel;
  messages: LlmMessage[];
  temperature?: number;
  maxTokens?: number;
}) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing PERPLEXITY_API_KEY");
  }

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Perplexity error: ${text}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  return data.choices?.[0]?.message?.content ?? "";
}
