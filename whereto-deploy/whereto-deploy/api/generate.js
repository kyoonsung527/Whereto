export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { vibe, location, cuisine, afterDinner, budget } = req.body;

  const prompt = `You are Whereto, a date planning AI for Canadian cities (Toronto, Vancouver, Montreal).

The user answered a 5-question quiz:
- Vibe: ${JSON.stringify(vibe)}
- Location: ${JSON.stringify(location)}
- Cuisine preference: ${JSON.stringify(cuisine)}
- After dinner: ${JSON.stringify(afterDinner)}
- Budget: ${JSON.stringify(budget)}

Generate exactly 5 unique date course options. Each course should:
- Have 3-4 stops (dinner → drinks/activity → dessert/stroll)
- Use REAL restaurants, bars, cafés in the city near the user's location
- Match their vibe, cuisine, after-dinner preference, and budget
- Feel curated and personal, not generic

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "courses": [
    {
      "name": "Short evocative course name",
      "area": "Neighbourhood A → Neighbourhood B · City",
      "duration": "~X hrs",
      "transport": "Walking or Driving",
      "summary": "2-3 sentence description of why this course was chosen for them",
      "tags": ["Vibe", "Cuisine", "Transport", "Budget range"],
      "spots": [
        {
          "name": "Restaurant/Bar/Place Name",
          "type": "Type · Neighbourhood",
          "time": "6:30 PM",
          "duration": "~1.5 hrs",
          "why": "1-2 sentences on why this specific place fits them. Use <strong> for 1 key phrase.",
          "tags": ["tag1", "tag2", "tag3"],
          "address": "Full street address for Google Maps"
        }
      ]
    }
  ]
}`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
        max_tokens: 3000
      })
    });

    const data = await openaiRes.json();
    if (!openaiRes.ok) throw new Error(data.error?.message || 'OpenAI error');

    const text = data.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
