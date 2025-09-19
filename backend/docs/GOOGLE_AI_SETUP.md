# Google AI API Setup Guide

## How to Get a Valid Google AI API Key

### Step 1: Go to Google AI Studio
1. Visit: https://aistudio.google.com/
2. Sign in with your Google account

### Step 2: Create a New API Key
1. Click on "Get API key" in the left sidebar
2. Click "Create API key"
3. Select "Create API key in new project" or choose an existing project
4. Copy the generated API key

### Step 3: Update Your .env File
Replace the current API key in your `.env` file:

```env
# Replace this with your actual API key from Google AI Studio
GOOGLE_AI_API_KEY=your_actual_api_key_here

# You can also specify the model (optional)
GOOGLE_AI_MODEL=gemini-1.5-pro
```

### Step 4: Verify the API Key
You can test if your API key works by:

1. Starting the backend server:
   ```bash
   npm run dev
   ```

2. Testing the API connection:
   ```bash
   curl http://localhost:5000/api/ai-counseling/test
   ```

   Or visit in browser: http://localhost:5000/api/ai-counseling/test

### Available Models
- `gemini-pro` (default)
- `gemini-1.5-pro` (recommended for better performance)
- `gemini-1.5-flash` (faster responses)

### Troubleshooting

#### Error: "API key not valid"
- Make sure you copied the entire API key correctly
- Check that there are no extra spaces or characters
- Verify the API key is enabled for the Generative Language API

#### Error: "Quota exceeded"
- You may have reached the free tier limits
- Consider upgrading to a paid plan in Google Cloud Console

#### Error: "Model not found"
- Check that the model name in `GOOGLE_AI_MODEL` is correct
- Some models may not be available in all regions

### Rate Limits (Free Tier)
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per minute

### Security Notes
- Never commit your API key to version control
- Keep your `.env` file in `.gitignore`
- Rotate your API key regularly
- Monitor usage in Google Cloud Console

### Testing Your Setup

After updating your API key, test the integration:

1. Start the backend server
2. Visit the AI Counseling page in the frontend
3. Send a test message
4. Check the console for any errors

The system will show helpful error messages if there are issues with the API key or connection.