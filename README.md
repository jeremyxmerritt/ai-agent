# AI Agent with Context Injection

A simple Node.js application that implements an AI agent with basic context injection capabilities using Anthropic's Claude API.

## Features

- **Context Management**: Store and retrieve user context through Q&A pairs and document text
- **Task Execution**: Handle specialized tasks (analysis, writing, research) with injected context
- **Cost Tracking**: Track API usage and costs per user
- **REST API**: Clean API endpoints for agent interaction
- **Error Handling**: Comprehensive error handling and validation

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Anthropic API key

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   cd ai-agent
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Store Context
Store user context (Q&A pairs or documents):

```bash
POST /agent/context
Content-Type: application/json

{
  "userId": "user123",
  "type": "qa",
  "data": {
    "question": "What is our main product?",
    "answer": "AI-powered analytics tools"
  }
}

# OR for documents:
{
  "userId": "user123",
  "type": "document",
  "data": {
    "title": "Company Overview",
    "content": "Our company builds cutting-edge AI solutions..."
  }
}
```

### Execute Task
Execute a task with context injection:

```bash
POST /agent/task
Content-Type: application/json

{
  "userId": "user123",
  "taskType": "analysis",
  "prompt": "Analyze our market position based on the provided context",
  "options": {
    "includeContext": true,
    "maxTokens": 1000
  }
}
```

**Task Types:**
- `analysis`: For analytical tasks
- `writing`: For content creation
- `research`: For research and investigation

### Get User Context
Retrieve stored context for a user:

```bash
GET /agent/context/user123
```

### Get Usage Statistics
Get usage and cost statistics for a user:

```bash
GET /agent/usage/user123
```

### Health Check
Check if the service is running:

```bash
GET /health
```

## Example Usage

1. **Store some context:**
   ```bash
   curl -X POST http://localhost:3000/agent/context \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "user123",
       "type": "qa",
       "data": {
         "question": "What is our company mission?",
         "answer": "To democratize AI for businesses worldwide"
       }
     }'
   ```

2. **Execute a task:**
   ```bash
   curl -X POST http://localhost:3000/agent/task \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "user123",
       "taskType": "writing",
       "prompt": "Write a brief company introduction",
       "options": {
         "includeContext": true,
         "maxTokens": 500
       }
     }'
   ```

3. **Check usage:**
   ```bash
   curl http://localhost:3000/agent/usage/user123
   ```

## Response Format

### Successful Task Execution
```json
{
  "success": true,
  "response": "Generated AI response text...",
  "usage": {
    "inputTokens": 150,
    "outputTokens": 200,
    "totalTokens": 350
  },
  "cost": {
    "inputCost": 0.00045,
    "outputCost": 0.003,
    "totalCost": 0.00345
  },
  "taskType": "analysis",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description"
}
```

## Project Structure

```
ai-agent/
├── src/
│   ├── config/           # Configuration management
│   ├── providers/        # AI provider implementations
│   ├── context/          # Context management
│   ├── agents/           # Agent orchestration
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── package.json
├── .env.example
└── README.md
```

## Cost Tracking

The application tracks:
- Total requests per user
- Token usage (input/output)
- Cost calculations based on Anthropic pricing
- Request history (last 100 requests)

Current pricing (as of implementation):
- Input tokens: $0.003 per 1K tokens
- Output tokens: $0.015 per 1K tokens

## Limitations

- **Storage**: Uses in-memory storage (data is lost on restart)
- **Authentication**: No authentication implemented
- **Rate Limiting**: No rate limiting implemented
- **Scaling**: Single instance only

## Development

To run tests (when implemented):
```bash
npm test
```

To run in development mode:
```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License