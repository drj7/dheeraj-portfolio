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
            ...history.map((msg) => ({
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

        const data = await response.json();
        const aiResponse =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response. Try again!";

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ response: "Something went wrong. Try again!" });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n🤖 Dheeraj-AI Dev Server running on http://localhost:${PORT}`);
    console.log(`\n📝 Make sure to set GEMINI_API_KEY environment variable`);
    console.log(`   export GEMINI_API_KEY=your_api_key`);
    console.log(`\n🚀 Start the frontend: npm run dev\n`);
});
