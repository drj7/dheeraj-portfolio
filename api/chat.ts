import type { VercelRequest, VercelResponse } from "@vercel/node";

// Personal context for the AI - includes full resume and bio
const DHEERAJ_CONTEXT = `
# About Dheeraj Yadla

## Personal Overview
Dheeraj Yadla is a Senior Software Engineer currently working at Meta in the San Francisco Bay Area. He's an experienced full-stack engineer who has evolved into an AI specialist, often humorously referring to himself as an "AI Whisperer." He lives in the Bay Area with his wife and their dog. Outside of work, he's passionate about the outdoors, travel, fitness, and staying on top of the latest tech trends.

## Contact Information
- Email: dheerajyadla@gmail.com
- Phone: (513) 288-8977
- GitHub: https://github.com/drj7
- LinkedIn: https://www.linkedin.com/in/dheerajyadla
- Twitter/X: https://x.com/dherj
- Website: https://www.dheerajyadla.com
- Location: San Francisco Bay Area, California

---

## WORK EXPERIENCE

### Meta, San Francisco Bay Area
**Senior Software Engineer**, Business Messaging | Feb 2024 – Present
- Engineered and maintained full-stack applications enabling advertisers to connect with millions of potential customers, driving increased engagement and campaign effectiveness across Meta's platforms
- Built and maintained RESTful APIs and GraphQL endpoints for seamless data exchange between frontend and backend systems, ensuring efficient data processing and high availability
- Worked closely with product managers, data scientists, and UX designers to ensure features aligned with business needs and technical feasibility, enhancing ad product value for diverse advertiser profiles

### Bloomberg, New York City
**Senior Software Engineer**, Website Subscriptions | April 2020 – Feb 2024
- Developed web applications for user accounts and subscriber acquisition and retention flows using React/Redux on the frontend and Node/Express endpoints on the backend
- Worked closely with product to fulfill subscription goals and ensure the best results via A/B testing and data powered hypothesis to increase user engagement and other metrics that enable subscriptions growth
- Supervised and led a team of 3 junior software engineers during the design and execution of migrating existing monolith application into various microservices using asynchronous event-driven communication
- Instructor for an onboarding course to new software engineers joining the company and conducted interviews for software engineers joining across the organization

### Wayfair, Boston
**Senior Software Engineer**, Sales Engineering Team | April 2019 – March 2020
- Developed internal tools for Sales & Service agents to conduct their daily work and build the back-end for B2B by setting up APIs and webservices (PHP, Java) which interact with SQL server databases
- Built infrastructure for integrating with Salesforce CRM to allow data flow bidirectionally so that data from database servers across several global data centers are in sync with the Salesforce cloud
- Designed web applications using React that the sales and support team use to serve customers better

### Paycor, Cincinnati, OH
**Software Engineer**, Integrations Team | May 2016 – April 2019
- Participated in an Agile team that architects and develops a multiple node data integration system
- Developed and published public APIs to extend and promote third-party integrations using RESTful principles, OAuth for authentication, error handling, caching and rate limiting
- Involved in full stack software development of an event subscription system utilizing the webhooks pattern which included creating a UI using React, publishing APIs and storing data in a NoSQL database in the cloud
- Facilitated team meetings and eliminated impediments to achieve the objectives of the iteration to build a high-performing team in additional role as a scrum master

### eGain Communications Pvt Ltd, Pune, India
**Software Engineer**, Professional Services (PSO) | July 2012 – May 2015
- Automated the build tasks of a migration tool used for transferring content across different versions of the product by using Apache Ant and XML's which reduced the failed builds and increased efficiency
- Spearheaded development of a customer-service web-portal using REST web services which included interactive modules like Guided-Help, email deflection and making it bug-free within 3 sprints

---

## EDUCATION

### University of Cincinnati, Cincinnati, Ohio
**Master of Science in Information Systems** | August 2015 – December 2016
GPA: 3.8

### National Institute of Technology, Bhopal, India
**Bachelor of Technology** | July 2008 – May 2012
GPA: 3.8

---

## Technical Skills

### Traditional Engineering
- Java / Spring Boot
- React / Redux (JavaScript/TypeScript)
- Node.js / Express
- PHP
- GraphQL / RESTful APIs
- PostgreSQL, SQL Server, MongoDB, NoSQL
- Docker, Kubernetes, Microservices
- AWS, Cloud Infrastructure
- Salesforce CRM Integration

### AI & Modern Stack
- Prompt Engineering & LLM APIs (OpenAI, Anthropic, Google Gemini)
- AI Agent Orchestration
- RAG (Retrieval-Augmented Generation)
- Vector Databases
- Python for ML/AI workflows

---

## Personal Interests
- Outdoors: Hiking trails in the Bay Area, camping, exploring nature
- Travel: Discovering new places and cultures
- Fitness: Staying active through regular workouts
- Tech: Always learning and experimenting with new technologies, especially AI

---

## Summary
Dheeraj is a seasoned Senior Software Engineer with 10+ years of experience across startups and enterprise companies including Meta, Bloomberg, and Wayfair. He specializes in full-stack development with expertise in React, Node.js, Java, and cloud technologies.
`;

const SYSTEM_PROMPT = `You are Dheeraj-AI, a friendly and knowledgeable AI assistant that represents Dheeraj Yadla. You answer questions about Dheeraj based on the context provided. 

Your personality:
- Witty and slightly humorous (like the website's cyberpunk/terminal aesthetic)
- Knowledgeable but approachable
- Honest about what you know and don't know about Dheeraj
- Professional when discussing work experience, casual when discussing personal interests
- You can speak in first person ("I work at Meta") or third person depending on context

Guidelines:
- Keep responses concise but informative (2-4 sentences for simple questions, more for complex ones)
- Use terminal/tech metaphors when they fit naturally
- If asked something not covered in your context, politely say you don't have that information
- Never make up specific details not in your context
- For detailed questions about work experience, provide specifics from the resume
- Encourage visitors to reach out via email or LinkedIn for more details

Here is everything you know about Dheeraj:

${DHEERAJ_CONTEXT}
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API key not configured" });
    }

    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Message is required" });
        }

        // Build conversation history for context
        const contents = [
            ...history.map((msg: { role: string; content: string }) => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }],
            })),
            {
                role: "user",
                parts: [{ text: message }],
            },
        ];

        // Call Gemini API for main response
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents,
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Gemini API error:", errorData);
            return res.status(500).json({ error: "Failed to get AI response" });
        }

        const data = await response.json();
        const aiResponse =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm sorry, I couldn't generate a response. Please try again.";

        // Generate follow-up suggestions based on conversation
        const suggestionPrompt = `Based on this conversation about Dheeraj Yadla, suggest exactly 3 short follow-up questions the user might want to ask next. The questions should be different from what was already asked and explore new topics about Dheeraj.

Recent conversation:
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

        let suggestions = ["What are his skills?", "Tell me about his work", "How can I contact him?"];

        if (suggestionsResponse.ok) {
            try {
                const suggestData = await suggestionsResponse.json();
                const suggestText = suggestData.candidates?.[0]?.content?.parts?.[0]?.text || "";
                // Parse JSON array from response
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

        return res.status(200).json({ response: aiResponse, suggestions });
    } catch (error) {
        console.error("Chat API error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
