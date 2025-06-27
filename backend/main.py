from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv

# Import our agents
from agents.citation_agent import CitationAgent
from agents.literature_agent import LiteratureAgent
from agents.collaboration_agent import CollaborationAgent
from agents.data_extraction_agent import DataExtractionAgent
from agents.proposal_agent import ProposalAgent

load_dotenv()

app = FastAPI(
    title="Agentic Research Assistant Suite",
    description="A comprehensive suite of AI agents for research assistance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
citation_agent = CitationAgent()
literature_agent = LiteratureAgent()
collaboration_agent = CollaborationAgent()
data_extraction_agent = DataExtractionAgent()
proposal_agent = ProposalAgent()

# Pydantic models
class CitationRequest(BaseModel):
    paper_url: str
    citation_style: str = "apa"

class LiteratureRequest(BaseModel):
    topic: str
    max_results: int = 10

class CollaborationRequest(BaseModel):
    paper_id: str
    comment: str
    user_id: str

class DataExtractionRequest(BaseModel):
    file_content: str
    extraction_type: str = "tables"

class ProposalRequest(BaseModel):
    research_topic: str
    research_question: str
    methodology: str
    expected_outcomes: str

@app.get("/")
async def root():
    return {"message": "Agentic Research Assistant Suite API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "agents": ["citation", "literature", "collaboration", "data_extraction", "proposal"]}

# Citation Agent Endpoints
@app.post("/api/citation/generate")
async def generate_citation(request: CitationRequest):
    try:
        citation = await citation_agent.generate_citation(request.paper_url, request.citation_style)
        return {"citation": citation, "style": request.citation_style}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/citation/styles")
async def get_citation_styles():
    return {"styles": citation_agent.get_available_styles()}

# Literature Review Agent Endpoints
@app.post("/api/literature/search")
async def search_literature(request: LiteratureRequest):
    try:
        papers = await literature_agent.search_papers(request.topic, request.max_results)
        return {"papers": papers, "topic": request.topic}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/literature/categorize")
async def categorize_papers(papers: List[Dict[str, Any]]):
    try:
        categorized = await literature_agent.categorize_papers(papers)
        return {"categorized_papers": categorized}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Collaboration Agent Endpoints
@app.post("/api/collaboration/comment")
async def add_comment(request: CollaborationRequest):
    try:
        result = await collaboration_agent.add_comment(request.paper_id, request.comment, request.user_id)
        return {"success": True, "comment_id": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/collaboration/comments/{paper_id}")
async def get_comments(paper_id: str):
    try:
        comments = await collaboration_agent.get_comments(paper_id)
        return {"comments": comments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Data Extraction Agent Endpoints
@app.post("/api/data/extract")
async def extract_data(request: DataExtractionRequest):
    try:
        extracted_data = await data_extraction_agent.extract_data(request.file_content, request.extraction_type)
        return {"extracted_data": extracted_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/data/analyze")
async def analyze_data(data: Dict[str, Any]):
    try:
        analysis = await data_extraction_agent.analyze_data(data)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Proposal Agent Endpoints
@app.post("/api/proposal/generate")
async def generate_proposal(request: ProposalRequest):
    try:
        proposal = await proposal_agent.generate_proposal(
            request.research_topic,
            request.research_question,
            request.methodology,
            request.expected_outcomes
        )
        return {"proposal": proposal}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/proposal/improve")
async def improve_proposal(proposal_text: str, feedback: str):
    try:
        improved = await proposal_agent.improve_proposal(proposal_text, feedback)
        return {"improved_proposal": improved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 