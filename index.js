const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.post("/assistant", async (req, res) => {
    const { message, thread_id } = req.body;
    const assistant_id = process.env.OPENAI_ASSISTANT_ID;
    let thread_id_session = null;
    if (thread_id) {
        thread_id_session = thread_id;
    } else {
        const thread = await openai.beta.threads.create();
        thread_id_session = thread.id;
    }
    await openai.beta.threads.messages.create(thread_id_session, {
        role: "user",
        content: message,
    });

    const run = await openai.beta.threads.runs.create(thread_id_session, {
        assistant_id: assistant_id,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread_id_session, run.id);
    while (runStatus.status !== "completed") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread_id_session, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread_id_session);

    const lastMessageForRun = messages.data.filter(
        (message) => message.run_id === run.id && message.role === "assistant"
    ).pop();

    res.json({ message: lastMessageForRun.content[0].text.value, thread_id: thread_id_session });

});

const port = 7700;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})