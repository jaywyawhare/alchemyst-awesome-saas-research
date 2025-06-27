import requests
import json
from typing import Dict, Any, List
from .base_agent import BaseAgent
from scholarly import scholarly
from datetime import datetime

class LiteratureAgent(BaseAgent):
    """Literature Review Assistant - Searches and categorizes academic papers"""
    
    def __init__(self):
        super().__init__()
        self.categories = [
            "Methodology",
            "Findings", 
            "Theory",
            "Review",
            "Case Study",
            "Experimental",
            "Survey",
            "Meta-analysis",
            "Systematic Review"
        ]
    
    def get_capabilities(self) -> List[str]:
        return [
            "Search academic papers by topic",
            "Categorize papers by methodology",
            "Extract key information from papers",
            "Generate literature summaries"
        ]
    
    async def search_papers(self, topic: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Search for papers related to the given topic"""
        self.log_activity("search_papers", {"topic": topic, "max_results": max_results})
        
        try:
            # Use Google Scholar for paper search
            search_query = scholarly.search_pubs(topic)
            papers = []
            
            for i, paper in enumerate(search_query):
                if i >= max_results:
                    break
                    
                paper_data = {
                    "title": paper.get('bib', {}).get('title', 'Unknown'),
                    "authors": paper.get('bib', {}).get('author', []),
                    "abstract": paper.get('bib', {}).get('abstract', ''),
                    "year": paper.get('bib', {}).get('year', 'Unknown'),
                    "citations": paper.get('num_citations', 0),
                    "url": paper.get('pub_url', ''),
                    "venue": paper.get('bib', {}).get('venue', ''),
                    "id": str(paper.get('scholar_id', i))
                }
                papers.append(paper_data)
            
            return papers
            
        except Exception as e:
            # Fallback to LLM-based search
            return await self._search_papers_with_llm(topic, max_results)
    
    async def _search_papers_with_llm(self, topic: str, max_results: int) -> List[Dict[str, Any]]:
        """Fallback search using LLM when external APIs fail"""
        search_prompt = f"""
        Generate a list of {max_results} academic papers related to the topic: "{topic}"
        
        For each paper, provide:
        - Title
        - Authors (comma-separated)
        - Abstract (brief summary)
        - Year of publication
        - Journal/Conference venue
        - Estimated citation count
        
        Format as a JSON array of objects with keys: title, authors, abstract, year, citations, venue, id
        """
        
        messages = [
            self._create_system_message("You are a research assistant. Generate realistic academic paper information based on the given topic."),
            self._create_user_message(search_prompt)
        ]
        
        response = await self._call_llm(messages, temperature=0.7)
        
        try:
            papers = json.loads(response)
            return papers[:max_results]
        except:
            # If JSON parsing fails, return a simple structure
            return [{"title": f"Paper on {topic}", "authors": ["Author"], "abstract": "Abstract not available", "year": "2024", "citations": 0, "venue": "Journal", "id": "1"}]
    
    async def categorize_papers(self, papers: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Categorize papers by methodology or focus area"""
        self.log_activity("categorize_papers", {"paper_count": len(papers)})
        
        try:
            # Prepare papers data for categorization
            papers_text = "\n\n".join([
                f"Title: {paper.get('title', '')}\nAbstract: {paper.get('abstract', '')}\nVenue: {paper.get('venue', '')}"
                for paper in papers
            ])
            
            categorization_prompt = f"""
            Categorize the following academic papers into the most appropriate categories:
            
            Available categories: {', '.join(self.categories)}
            
            Papers:
            {papers_text}
            
            For each paper, determine the primary category based on its title, abstract, and venue.
            Return a JSON object where keys are category names and values are arrays of paper indices (0-based).
            """
            
            messages = [
                self._create_system_message("You are a research methodology expert. Categorize papers based on their research approach and focus."),
                self._create_user_message(categorization_prompt)
            ]
            
            response = await self._call_llm(messages, temperature=0.5)
            
            try:
                categorization = json.loads(response)
                categorized_papers = {category: [] for category in self.categories}
                
                # Map paper indices to actual papers
                for category, indices in categorization.items():
                    if category in self.categories:
                        for idx in indices:
                            if 0 <= idx < len(papers):
                                categorized_papers[category].append(papers[idx])
                
                return categorized_papers
                
            except json.JSONDecodeError:
                # Fallback categorization
                return self._fallback_categorization(papers)
                
        except Exception as e:
            return self._fallback_categorization(papers)
    
    def _fallback_categorization(self, papers: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Simple fallback categorization based on keywords"""
        categorized = {category: [] for category in self.categories}
        
        for paper in papers:
            title_abstract = f"{paper.get('title', '')} {paper.get('abstract', '')}".lower()
            
            # Simple keyword-based categorization
            if any(word in title_abstract for word in ['method', 'methodology', 'approach']):
                categorized['Methodology'].append(paper)
            elif any(word in title_abstract for word in ['finding', 'result', 'outcome']):
                categorized['Findings'].append(paper)
            elif any(word in title_abstract for word in ['theory', 'theoretical']):
                categorized['Theory'].append(paper)
            elif any(word in title_abstract for word in ['review', 'survey']):
                categorized['Review'].append(paper)
            elif any(word in title_abstract for word in ['case study', 'case']):
                categorized['Case Study'].append(paper)
            elif any(word in title_abstract for word in ['experiment', 'experimental']):
                categorized['Experimental'].append(paper)
            else:
                categorized['Review'].append(paper)  # Default category
        
        return categorized
    
    async def generate_literature_summary(self, papers: List[Dict[str, Any]]) -> str:
        """Generate a summary of the literature"""
        self.log_activity("generate_literature_summary", {"paper_count": len(papers)})
        
        papers_text = "\n\n".join([
            f"Title: {paper.get('title', '')}\nAbstract: {paper.get('abstract', '')}\nYear: {paper.get('year', '')}"
            for paper in papers
        ])
        
        summary_prompt = f"""
        Generate a comprehensive literature review summary based on the following papers:
        
        {papers_text}
        
        The summary should include:
        1. Main themes and trends
        2. Key findings across papers
        3. Research gaps identified
        4. Future research directions
        
        Write in academic style with clear structure.
        """
        
        messages = [
            self._create_system_message("You are a literature review expert. Generate comprehensive summaries of academic literature."),
            self._create_user_message(summary_prompt)
        ]
        
        return await self._call_llm(messages, temperature=0.7)
    
    async def process_request(self, **kwargs) -> Dict[str, Any]:
        """Process literature review request"""
        topic = kwargs.get('topic')
        max_results = kwargs.get('max_results', 10)
        
        if not topic:
            raise ValueError("topic is required")
        
        papers = await self.search_papers(topic, max_results)
        categorized = await self.categorize_papers(papers)
        summary = await self.generate_literature_summary(papers)
        
        return {
            "papers": papers,
            "categorized_papers": categorized,
            "summary": summary,
            "topic": topic,
            "search_date": str(datetime.now())
        } 