/**
 * Local development server for testing the chat API.
 * Run with: node server.dev.js
 * Requires GEMINI_API_KEY environment variable.
 */

import express from "express";

const app = express();
app.use(express.json());

// Personal context for the AI
const DHEERAJ_CONTEXT = `
# About Dheeraj Yadla

## Personal Overview
Dheeraj Yadla is a Senior Software Engineer currently working at Meta in the San Francisco Bay Area. He's an experienced full-stack engineer who has evolved into an AI specialist. He lives in the Bay Area with his wife and their dog.

## Contact Information
- Email: dheerajyadla@gmail.com
- Phone: (513) 288-8977
- GitHub: https://github.com/drj7
- LinkedIn: https://www.linkedin.com/in/dheerajyadla
- Location: San Francisco Bay Area, California

## WORK EXPERIENCE

### Meta, San Francisco Bay Area
**Senior Software Engineer**, Business Messaging | Feb 2024 – Present
- Engineered full-stack applications enabling advertisers to connect with millions of customers
- Built RESTful APIs and GraphQL endpoints for frontend/backend data exchange
- Worked with product managers, data scientists, and UX designers

### Bloomberg, New York City
**Senior Software Engineer**, Website Subscriptions | April 2020 – Feb 2024
- Developed web apps for user accounts and subscriber acquisition using React/Redux and Node/Express
- Led a team of 3 junior engineers migrating monolith to microservices
- Conducted onboarding training and interviews

### Wayfair, Boston
**Senior Software Engineer**, Sales Engineering | April 2019 – March 2020
- Developed internal tools for Sales & Service agents
- Built Salesforce CRM integration infrastructure
- Designed React web applications

### Paycor, Cincinnati, OH
**Software Engineer**, Integrations Team | May 2016 – April 2019
- Developed public APIs using RESTful principles, OAuth, rate limiting
- Built event subscription system with webhooks using React and NoSQL
- Served as scrum master

### eGain Communications, Pune, India
**Software Engineer** | July 2012 – May 2015
- Automated build tasks reducing failed builds
- Developed customer-service web-portal

## EDUCATION
- **MS in Information Systems**, University of Cincinnati (GPA: 3.8)
- **B.Tech**, National Institute of Technology, Bhopal (GPA: 3.8)

## Technical Skills
- React, Redux, TypeScript, Node.js, Java, PHP
- GraphQL, REST APIs, PostgreSQL, MongoDB
- Docker, Kubernetes, AWS
- AI: Prompt Engineering, LLM APIs, RAG

## Personal Interests
- Outdoors/hiking, Travel, Fitness, Tech/AI
`;

const SYSTEM_PROMPT = `You are Dheeraj-AI, a friendly AI assistant representing Dheeraj Yadla. 
Be witty, concise, and helpful. Answer questions about Dheeraj based on the context.
For technical skills and work history, be specific. For personal questions, be warm.
Keep responses under 3-4 sentences unless more detail is requested.

Context about Dheeraj:
${DHEERAJ_CONTEXT}`;

// Fallback responses for when the API fails - with witty, funny tone
const FALLBACK_RESPONSES = [
  {
    keywords: ["skill", "skills", "tech", "technology", "stack", "programming", "languages"],
    responses: [
      "Ah, skills! Dheeraj's tech stack reads like a developer's dream buffet: React, Node.js, TypeScript, Java, GraphQL, and a healthy serving of AI/ML. He's basically a full-stack wizard who also speaks fluent Robot. 🤖",
      "Skills.exe loading... React ✓ Node.js ✓ TypeScript ✓ Java ✓ Python ✓ AI/LLMs ✓ Making computers do his bidding ✓. The man's got range!",
      "Let's see... React, Node, TypeScript, Java, GraphQL, PostgreSQL, Docker, Kubernetes, and he's dabbling in AI like it's going out of style (it's not). Think of him as a coding Swiss Army knife.",
    ],
    suggestions: ["Where has he worked?", "Tell me about his AI skills", "How can I contact him?"],
  },
  {
    keywords: ["experience", "work", "job", "career", "worked", "company", "companies"],
    responses: [
      "Career speedrun: eGain → Paycor → Wayfair → Bloomberg → Meta. That's 10+ years of building things that millions of people use. Not bad for someone who started in Pune and ended up in the Bay Area! 🚀",
      "Dheeraj's been busy! Meta (making advertisers happy), Bloomberg (subscriptions guru), Wayfair (sales tools wizard), Paycor (integrations master), and eGain (where it all began). Each stop added a new superpower.",
      "From building customer portals in India to engineering at Meta - Dheeraj's career arc looks like a nicely optimized algorithm. Currently shipping features that connect millions of advertisers with their audiences.",
    ],
    suggestions: ["What does he do at Meta?", "What are his skills?", "Tell me about Bloomberg"],
  },
  {
    keywords: ["who", "about", "dheeraj", "bio", "background", "introduction"],
    responses: [
      "Dheeraj Yadla: Senior Software Engineer at Meta, recovering full-stack developer turned AI enthusiast. Lives in the Bay Area with his wife and a dog who probably has opinions about his code. Hiking trails by day, shipping features by... also day. ☀️",
      "Meet Dheeraj: A software engineer who went from 'Hello World' to 'Hello, I work at Meta.' 10+ years of making computers do useful things, a Master's from Cincinnati, and an unhealthy obsession with clean code and hiking trails.",
      "That's Dheeraj! Engineer by profession, AI whisperer by choice, outdoors enthusiast by weekend. Currently at Meta, previously at Bloomberg, Wayfair, and more. The kind of guy who debugs code AND climbs mountains.",
    ],
    suggestions: ["What are his skills?", "Where has he worked?", "What does he do for fun?"],
  },
  {
    keywords: ["meta", "facebook"],
    responses: [
      "At Meta, Dheeraj works on Business Messaging - basically helping advertisers connect with potential customers at scale. Think full-stack engineering meets product impact. He's been there since Feb 2024, building both the frontend magic and backend APIs.",
      "Meta gig: Senior Software Engineer on Business Messaging since 2024. He's engineering solutions that help millions of advertisers reach their audiences. GraphQL, React, cross-functional collaboration - the whole enterprise package.",
    ],
    suggestions: ["What did he do before Meta?", "What are his tech skills?", "How can I reach him?"],
  },
  {
    keywords: ["bloomberg"],
    responses: [
      "Bloomberg era (2020-2024): Dheeraj was the subscriptions whisperer. React/Redux frontend, Node/Express backend, and leading a team migrating a monolith to microservices. Also taught new engineers the ropes. Senior engineer with a teaching gig! 📰",
      "At Bloomberg, Dheeraj owned web apps for subscriber acquisition. Led 3 junior engineers through a monolith-to-microservices migration and even ran onboarding courses. Four years of making news accessible.",
    ],
    suggestions: ["What does he do at Meta?", "Any other companies?", "What's his tech stack?"],
  },
  {
    keywords: ["contact", "email", "reach", "hire", "connect", "linkedin", "github"],
    responses: [
      "Want to get in touch? Here's the bat signal: dheerajyadla@gmail.com 📧 | LinkedIn: linkedin.com/in/dheerajyadla | GitHub: github.com/drj7 | Twitter/X: @dherj. He reads emails, I promise!",
      "Ping him! Email: dheerajyadla@gmail.com | LinkedIn: dheerajyadla | GitHub: drj7 | X: @dherj. For job things, use LinkedIn. For 'your code is cool' things, use any of them. For robot uprising concerns, maybe wait.",
    ],
    suggestions: ["Where does he work?", "What are his skills?", "Tell me about his projects"],
  },
  {
    keywords: ["education", "degree", "university", "college", "school", "study"],
    responses: [
      "Academic stats: Master's in Information Systems from University of Cincinnati (GPA: 3.8), Bachelor's from NIT Bhopal (also 3.8). The man collected 3.8s like Pokémon. 🎓",
      "Education speedrun: B.Tech from NIT Bhopal (India's MIT equivalent), then a Master's at University of Cincinnati. Both with 3.8 GPA because consistency is key.",
    ],
    suggestions: ["Where does he work now?", "What are his skills?", "Tell me about his experience"],
  },
  {
    keywords: ["hobby", "hobbies", "fun", "interest", "interests", "outside", "free time", "personal"],
    responses: [
      "When not coding: hiking Bay Area trails, traveling to new places, staying fit, and nerding out on the latest tech. Lives with his wife and their dog, who I'm told is an excellent rubber duck debugger. 🐕",
      "Work-life balance achieved: Hiking, travel adventures, fitness goals, and keeping up with tech trends. He's proof that engineers can touch grass AND ship features.",
    ],
    suggestions: ["What are his skills?", "Where does he work?", "How can I contact him?"],
  },
  {
    keywords: ["ai", "llm", "artificial intelligence", "machine learning", "prompt", "gpt", "gemini"],
    responses: [
      "AI skills? Oh, Dheeraj went full AI-pilled. Prompt engineering, LLM APIs (OpenAI, Anthropic, Gemini), RAG systems, vector databases, and agent orchestration. He built THIS chatbot, for crying out loud! 🤖",
      "The AI corner: Prompt engineering wizard, LLM API wrangler (OpenAI, Gemini, Anthropic), RAG enthusiast, vector database explorer. He's basically training for the future while living in it.",
    ],
    suggestions: ["What else can he build?", "Traditional tech skills?", "Where does he work?"],
  },
];

// Default fallback for unmatched queries
const DEFAULT_FALLBACK = {
  responses: [
    "My neural pathways are a bit foggy on that one! But I can tell you Dheeraj is a Senior Engineer at Meta, loves coding AND hiking, and is always up for a good tech chat. Drop him a line at dheerajyadla@gmail.com! 📬",
    "Hmm, my circuits are drawing a blank there. But here's what I know for sure: Dheeraj = 10+ years of software engineering + Meta badge + AI enthusiast + trail hiker. Want specifics? Try asking about his skills or experience!",
    "That question is outside my training data! But fun fact: Dheeraj can probably answer it himself at dheerajyadla@gmail.com. Meanwhile, I can talk your ear off about his tech stack, career, or hiking adventures!",
    "Beep boop, processing error! Just kidding - I just don't have that info. Ask me about Dheeraj's work at Meta, his full-stack skills, or why he chose to live near mountains. Those I can nail! 🎯",
  ],
  suggestions: ["Who is Dheeraj?", "What are his skills?", "How can I contact him?"],
};

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  for (const category of FALLBACK_RESPONSES) {
    if (category.keywords.some(keyword => lowerMessage.includes(keyword))) {
      const response = category.responses[Math.floor(Math.random() * category.responses.length)];
      return { response, suggestions: category.suggestions };
    }
  }

  // Return default fallback
  const response = DEFAULT_FALLBACK.responses[Math.floor(Math.random() * DEFAULT_FALLBACK.responses.length)];
  return { response, suggestions: DEFAULT_FALLBACK.suggestions };
}

app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      response:
        "GEMINI_API_KEY not set. Run: export GEMINI_API_KEY=your_key_here",
    });
  }

  try {
    const { message, history = [] } = req.body;

    const contents = [
      ...history.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error");
      const fallback = getFallbackResponse(message);
      return res.json({ response: fallback.response, suggestions: fallback.suggestions });
    }

    const data = await response.json();
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response. Try again!";

    // Generate follow-up suggestions
    const suggestionPrompt = `Based on this conversation about Dheeraj Yadla, suggest exactly 3 short follow-up questions the user might want to ask next. Questions should explore new topics.

User: ${message}
Assistant: ${aiResponse}

Return ONLY a JSON array of 3 short questions (max 5 words each), nothing else. Example: ["What projects did he build?", "Where is he based?", "What are his hobbies?"]`;

    const suggestionsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: suggestionPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 100,
          },
        }),
      }
    );

    let suggestions = [
      "What are his skills?",
      "Tell me about his work",
      "How can I contact him?",
    ];

    if (suggestionsResponse.ok) {
      try {
        const suggestData = await suggestionsResponse.json();
        const suggestText =
          suggestData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const match = suggestText.match(/\[[\s\S]*?\]/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            suggestions = parsed.slice(0, 3);
          }
        }
      } catch {
        // Use default suggestions if parsing fails
      }
    }

    res.json({ response: aiResponse, suggestions });
  } catch (error) {
    console.error("Error:", error);
    // Use fallback response instead of error
    try {
      const { message = "" } = req.body || {};
      const fallback = getFallbackResponse(message);
      res.json({ response: fallback.response, suggestions: fallback.suggestions });
    } catch {
      res.json({
        response: "Whoops! My circuits are fried right now. But hey, you can always reach Dheeraj directly at dheerajyadla@gmail.com - he actually likes emails! 📧",
        suggestions: ["Who is Dheeraj?", "What are his skills?", "How can I contact him?"]
      });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🤖 Dheeraj-AI Dev Server running on http://localhost:${PORT}`);
  console.log(`\n📝 Make sure to set GEMINI_API_KEY environment variable`);
  console.log(`   export GEMINI_API_KEY=your_api_key`);
  console.log(`\n🚀 Start the frontend: npm run dev\n`);
});
