require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI (with graceful handling)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('⚠️  Warning: OPENAI_API_KEY not found. Translation will not work until you set your API key.');
}

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Language mapping
const SUPPORTED_LANGUAGES = {
  'french': 'French',
  'german': 'German', 
  'spanish': 'Spanish'
};

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    // Validate input
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    if (!SUPPORTED_LANGUAGES[targetLanguage.toLowerCase()]) {
      return res.status(400).json({ error: 'Supported languages are: French, German, Spanish' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || !openai) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.' 
      });
    }

    const targetLang = SUPPORTED_LANGUAGES[targetLanguage.toLowerCase()];

    // Create the translation prompt
    const prompt = `Translate the following English text to ${targetLang}. Return only the translation, no explanations or additional text.

Text to translate: "${text}"

Translation:`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given English text to ${targetLang} accurately and naturally. Return only the translation without any additional text or explanations.`
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const translation = completion.choices[0].message.content.trim();

    res.json({
      originalText: text,
      translatedText: translation,
      targetLanguage: targetLang
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    if (error.status === 401) {
      res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Translation failed. Please try again.' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Polyglot translation server running on http://localhost:${PORT}`);
  console.log('Supported languages: French, German, Spanish');
});