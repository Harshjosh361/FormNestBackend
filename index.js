import express from 'express';
import cors from 'cors';
import {json}  from 'express';
import dotenv from 'dotenv'
dotenv.config();
import  createForm  from './googleFormService.js';

const app = express();
app.use(cors());
app.use(json());

app.post('/generate-form', async (req, res) => {
  const { sem, subject, token,questions } = req.body;

  if (!token || !sem || !subject || !questions) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const formUrl = await createForm(token, `${subject} - Semester ${sem}`, questions);
    res.json({ success: true, formUrl });
  } catch (error) {
    console.error('Form generation failed:', error);
    res.status(500).json({ error: 'Failed to generate form' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
