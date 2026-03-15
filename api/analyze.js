import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { image, mediaType } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: image } },
          { type: "text", text: "You are a product listing expert for Amazon and Walmart marketplace sellers. Analyze this product image and return ONLY a JSON object with no other text, no markdown, no backticks. The JSON must have these exact fields: title (SEO-optimized product title max 200 chars with key search terms), category (one of: Electronics, Home and Garden, Clothing, Toys and Games, Sports and Outdoors, Beauty, Automotive, Health, Office, Photography, Accessories, Fitness, Other), suggestedPrice (format XX.XX - suggest a COMPETITIVE price, research typical marketplace prices for this product type and err on the lower end to stay competitive and get sales), estimatedCost (format XX.XX - estimate typical wholesale/sourcing cost for this type of product), brand (detected or suggested brand name), weight (format X.X in pounds), condition (New), description (compelling 150-200 word product description with bullet points using the bullet character), keywords (array of 5-8 relevant search keywords)" }
        ]
      }]
    });
    const text = msg.content[0].text;
    let parsed;
    try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
    catch { parsed = { title: "Product", description: text.slice(0, 500), category: "Other", keywords: [] }; }
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "AI analysis failed: " + err.message });
  }
}
