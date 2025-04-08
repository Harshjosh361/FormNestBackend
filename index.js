import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import createForm from './googleFormService.js';
import FormTemplate from './models/FormTemplate.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
connectDB();


// generate Google Form
app.post('/generate-form', async (req, res) => {
  let { sem, subject, token } = req.body;
  
  if (!token || !sem || !subject) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    console.log('Searching for exact:', { sem, subject });
    
    // Searcing for exact match
    let template = await FormTemplate.findOne({
      sem: sem,
      subject: subject
    });
    
    console.log('🔍 Exact match result:', template ? 'Found' : 'Not found');
    
  
    if (!template) {
      return res.status(404).json({ 
        error: 'No form template found for the given semester and subject',
        searchParams: { sem, subject }
      });
    }
    const formUrl = await createForm(token, template.title, template.questions);
    res.json({ success: true, formUrl });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate form', details: error.message });
  }
});


//Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
