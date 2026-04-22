export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { filename, prompt, brand, category } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: `เขียนแคปชั่น TikTok สั้นๆ สำหรับ ${brand} หมวด ${category} จาก prompt: ${prompt}` }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ post: data.choices[0].message.content });
  } catch (error) {
    res.status(200).json({ post: `ลอง ${brand} สวยๆ #CrystalCastle #${category}` });
  }
}