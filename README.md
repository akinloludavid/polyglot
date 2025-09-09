# 🌍 Polyglot

An AI-powered translation web app that translates English text to French, German, or Spanish using OpenAI's GPT models.

## Features

- **Simple Interface**: Clean, intuitive web interface for easy translation
- **Multi-language Support**: Translate to French, German, or Spanish
- **AI-Powered**: Uses OpenAI's GPT-3.5-turbo for accurate translations
- **Real-time Translation**: Fast and responsive translation requests
- **Error Handling**: Comprehensive error handling and user feedback

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd polyglot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your OpenAI API key to the `.env` file:
     ```
     OPENAI_API_KEY=your_actual_openai_api_key_here
     PORT=3000
     ```

4. **Start the application**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Usage

1. Enter English text in the input field
2. Select your target language (French, German, or Spanish)
3. Click "Translate" to get the AI-powered translation
4. View the results with both original and translated text

## API Endpoints

### POST `/api/translate`
Translates English text to the specified target language.

**Request Body**:
```json
{
  "text": "Hello, how are you?",
  "targetLanguage": "french"
}
```

**Response**:
```json
{
  "originalText": "Hello, how are you?",
  "translatedText": "Bonjour, comment allez-vous ?",
  "targetLanguage": "French"
}
```

### GET `/api/health`
Health check endpoint.

## Supported Languages

- 🇫🇷 French
- 🇩🇪 German
- 🇪🇸 Spanish

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Server port (default: 3000)

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI**: OpenAI GPT-3.5-turbo
- **Styling**: Modern CSS with gradients and animations

## Error Handling

The application includes comprehensive error handling for:
- Missing or invalid OpenAI API key
- Rate limiting
- Network errors
- Invalid input validation
- Unsupported languages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
