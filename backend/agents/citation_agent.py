import re
import requests
from typing import Dict, Any, List
from .base_agent import BaseAgent
import crossref_commons
from datetime import datetime

class CitationAgent(BaseAgent):
    """Research Paper Citation Assistant - Generates citations in various formats"""
    
    def __init__(self):
        super().__init__()
        self.citation_styles = {
            "apa": "American Psychological Association",
            "mla": "Modern Language Association", 
            "chicago": "Chicago Manual of Style",
            "harvard": "Harvard Referencing",
            "ieee": "IEEE",
            "vancouver": "Vancouver",
            "ama": "American Medical Association"
        }
    
    def get_capabilities(self) -> List[str]:
        return [
            "Generate citations from paper URLs",
            "Generate citations from DOIs",
            "Support multiple citation styles",
            "Extract metadata from academic papers"
        ]
    
    async def generate_citation(self, paper_url: str, citation_style: str = "apa") -> str:
        """Generate a citation for a paper in the specified style"""
        self.log_activity("generate_citation", {"paper_url": paper_url, "style": citation_style})
        
        # Extract DOI from URL if present
        doi = self._extract_doi_from_url(paper_url)
        
        if doi:
            return await self._generate_citation_from_doi(doi, citation_style)
        else:
            return await self._generate_citation_from_url(paper_url, citation_style)
    
    def _extract_doi_from_url(self, url: str) -> str:
        """Extract DOI from various URL formats"""
        doi_patterns = [
            r'doi\.org/(.+)',
            r'doi:(.+)',
            r'10\.\d{4,}/[-._;()/:\w]+'
        ]
        
        for pattern in doi_patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    async def _generate_citation_from_doi(self, doi: str, style: str) -> str:
        """Generate citation using CrossRef API"""
        try:
            # Get metadata from CrossRef
            metadata = crossref_commons.retrieval.get_publication_as_json(doi)
            
            if not metadata:
                raise Exception("Could not retrieve metadata for DOI")
            
            # Format citation using LLM
            citation_prompt = f"""
            Generate a {self.citation_styles.get(style, style)} citation for the following paper metadata:
            
            Title: {metadata.get('title', [''])[0] if metadata.get('title') else 'Unknown'}
            Authors: {', '.join([author.get('given', '') + ' ' + author.get('family', '') for author in metadata.get('author', [])])}
            Journal: {metadata.get('container-title', [''])[0] if metadata.get('container-title') else 'Unknown'}
            Year: {metadata.get('published-print', {}).get('date-parts', [[]])[0][0] if metadata.get('published-print') else 'Unknown'}
            DOI: {doi}
            
            Please format this as a proper {style.upper()} citation.
            """
            
            messages = [
                self._create_system_message("You are a citation expert. Generate accurate citations in the requested format."),
                self._create_user_message(citation_prompt)
            ]
            
            citation = await self._call_llm(messages, temperature=0.3)
            return citation.strip()
            
        except Exception as e:
            raise Exception(f"Failed to generate citation from DOI: {str(e)}")
    
    async def _generate_citation_from_url(self, url: str, style: str) -> str:
        """Generate citation from URL when DOI is not available"""
        try:
            # Try to extract basic information from the URL
            citation_prompt = f"""
            Generate a {self.citation_styles.get(style, style)} citation for the following paper URL:
            
            URL: {url}
            
            Please analyze the URL and generate an appropriate citation. If you cannot determine specific details, use placeholders like [Author] or [Title] and note that manual verification is needed.
            
            Format as a proper {style.upper()} citation.
            """
            
            messages = [
                self._create_system_message("You are a citation expert. Generate citations based on available information and note when manual verification is needed."),
                self._create_user_message(citation_prompt)
            ]
            
            citation = await self._call_llm(messages, temperature=0.3)
            return citation.strip()
            
        except Exception as e:
            raise Exception(f"Failed to generate citation from URL: {str(e)}")
    
    def get_available_styles(self) -> List[str]:
        """Get list of available citation styles"""
        return list(self.citation_styles.keys())
    
    async def process_request(self, **kwargs) -> Dict[str, Any]:
        """Process citation generation request"""
        paper_url = kwargs.get('paper_url')
        citation_style = kwargs.get('citation_style', 'apa')
        
        if not paper_url:
            raise ValueError("paper_url is required")
        
        citation = await self.generate_citation(paper_url, citation_style)
        
        return {
            "citation": citation,
            "style": citation_style,
            "paper_url": paper_url,
            "generated_at": str(datetime.now())
        } 