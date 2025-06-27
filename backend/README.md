# Agentic Research Assistant Suite - Backend

A comprehensive suite of AI agents for research assistance, built with FastAPI and using the Alchemyst proxy for LLM access.

## Features

- **Citation Agent**: Generate citations in various formats from paper URLs/DOIs
- **Literature Review Agent**: Search and categorize academic papers
- **Collaboration Agent**: Real-time collaboration with comments and task management
- **Data Extraction Agent**: Extract and analyze data from research papers
- **Proposal Agent**: Generate and improve research proposals

## Setup

### Prerequisites

- Python 3.11
- Alchemyst Platform API Key

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Key Setup

This project uses the **Alchemyst proxy** to access LLM capabilities. You only need:

1. **Alchemyst Platform API Key**: Get this from the Alchemyst platform
2. Set it in your `.env` file: `ALCHEMYST_API_KEY=your_key_here`

The proxy configuration automatically handles the OpenAI API calls through Alchemyst's infrastructure.

## API Endpoints

### Citation Agent
- `POST /api/citation/generate` - Generate citations
- `GET /api/citation/styles` - Get available citation styles

### Literature Review Agent
- `POST /api/literature/search` - Search for papers
- `POST /api/literature/categorize` - Categorize papers

### Collaboration Agent
- `POST /api/collaboration/comment` - Add comments
- `GET /api/collaboration/comments/{paper_id}` - Get comments

### Data Extraction Agent
- `POST /api/data/extract` - Extract data from papers
- `POST /api/data/analyze` - Analyze extracted data

### Proposal Agent
- `POST /api/proposal/generate` - Generate research proposals
- `POST /api/proposal/improve` - Improve proposals with feedback

## Architecture

- **FastAPI**: Modern, fast web framework
- **LangChain**: LLM integration and agent framework
- **Alchemyst Proxy**: LLM access without OpenAI API key
- **In-memory storage**: For development (can be replaced with MongoDB/Redis)

## Development

### Adding New Agents

1. Create a new agent class in `agents/` directory
2. Inherit from `BaseAgent`
3. Implement required methods: `process_request()`, `get_capabilities()`
4. Add endpoints in `main.py`

### Testing

```bash
curl http://localhost:8000/health

curl -X POST http://localhost:8000/api/citation/generate \
  -H "Content-Type: application/json" \
  -d '{"paper_url": "https://doi.org/10.1038/nature12373", "citation_style": "apa"}'
```
