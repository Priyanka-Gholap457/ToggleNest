import OpenAI from "openai";

export const generateTasks = async (req, res) => {
  try {

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const { description } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a project manager. Break projects into clear tasks."
        },
        {
          role: "user",
          content: `Break this project into 5 tasks:\n${description}`
        }
      ]
    });

    const aiText = completion.choices[0].message.content;

    const tasks = aiText
    .split("\n")
    .filter(line => line.trim() !== "")
    .slice(0, 5);
    res.json({ tasks });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "AI generation failed",
      error: error.message
    });
  }
};

export const suggestPriority = async (req, res) => {
  try {

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const { task } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You classify task priorities for project management systems."
        },
        {
          role: "user",
          content: `Classify this task priority as High, Medium, or Low:\n${task}`
        }
      ]
    });

    const priority = completion.choices[0].message.content.trim();

    res.json({ priority });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Priority prediction failed",
      error: error.message
    });

  }
};

export const generateDescription = async (req, res) => {
  try {

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const { title } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You write short task descriptions for project management systems."
        },
        {
          role: "user",
          content: `Write a clear 2-3 sentence task description for: ${title}`
        }
      ]
    });

    const description = completion.choices[0].message.content.trim();

    res.json({ description });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Description generation failed",
      error: error.message
    });

  }
};