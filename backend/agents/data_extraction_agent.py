import re
import json
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent
from datetime import datetime
import plotly.graph_objects as go
import plotly.express as px
from io import StringIO

class DataExtractionAgent(BaseAgent):
    """Data Extraction & Analysis Agent - Extracts and analyzes data from research papers"""
    
    def __init__(self):
        super().__init__()
        self.extraction_types = ["tables", "figures", "statistics", "keywords", "references"]
    
    def get_capabilities(self) -> List[str]:
        return [
            "Extract tables from research papers",
            "Extract statistical data",
            "Generate data visualizations",
            "Analyze research trends",
            "Extract key findings and statistics"
        ]
    
    async def extract_data(self, file_content: str, extraction_type: str = "tables") -> Dict[str, Any]:
        """Extract data from research paper content"""
        self.log_activity("extract_data", {"extraction_type": extraction_type, "content_length": len(file_content)})
        
        if extraction_type == "tables":
            return await self._extract_tables(file_content)
        elif extraction_type == "statistics":
            return await self._extract_statistics(file_content)
        elif extraction_type == "keywords":
            return await self._extract_keywords(file_content)
        elif extraction_type == "references":
            return await self._extract_references(file_content)
        elif extraction_type == "figures":
            return await self._extract_figures(file_content)
        else:
            return await self._extract_all(file_content)
    
    async def _extract_tables(self, content: str) -> Dict[str, Any]:
        """Extract tables from research paper content"""
        try:
            # Use LLM to identify and extract tables
            table_prompt = f"""
            Extract all tables from the following research paper content. For each table:
            1. Identify the table structure
            2. Extract the data in a structured format
            3. Provide the table caption/title
            4. Note any footnotes or explanations
            
            Content:
            {content[:5000]}  # Limit content length for processing
            
            Return the result as a JSON object with:
            - tables: array of table objects
            - table_count: total number of tables found
            - extraction_quality: assessment of extraction quality
            """
            
            messages = [
                self._create_system_message("You are a data extraction expert. Extract tables from research papers accurately."),
                self._create_user_message(table_prompt)
            ]
            
            response = await self._call_llm(messages, temperature=0.3)
            
            try:
                result = json.loads(response)
                return {
                    "extraction_type": "tables",
                    "data": result,
                    "timestamp": str(datetime.now())
                }
            except json.JSONDecodeError:
                # Fallback extraction
                return self._fallback_table_extraction(content)
                
        except Exception as e:
            return self._fallback_table_extraction(content)
    
    def _fallback_table_extraction(self, content: str) -> Dict[str, Any]:
        """Simple fallback table extraction using regex"""
        # Look for table-like patterns
        table_patterns = [
            r'Table \d+[\.:]?\s*([^\n]+)',
            r'(\d+\.\d+\s+\d+\.\d+\s+\d+\.\d+)',  # Number patterns
        ]
        
        tables = []
        for pattern in table_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                tables.append({
                    "title": f"Extracted Table {len(tables) + 1}",
                    "data": match,
                    "confidence": "low"
                })
        
        return {
            "extraction_type": "tables",
            "data": {
                "tables": tables,
                "table_count": len(tables),
                "extraction_quality": "basic"
            },
            "timestamp": str(datetime.now())
        }
    
    async def _extract_statistics(self, content: str) -> Dict[str, Any]:
        """Extract statistical information from research paper"""
        stats_prompt = f"""
        Extract statistical information from the following research paper content:
        
        {content[:3000]}
        
        Look for:
        - Sample sizes (n=)
        - P-values
        - Confidence intervals
        - Effect sizes
        - Mean/median values
        - Standard deviations
        - Correlation coefficients
        - Statistical test results
        
        Return as JSON with categories for different types of statistics.
        """
        
        messages = [
            self._create_system_message("You are a statistics expert. Extract and categorize statistical information accurately."),
            self._create_user_message(stats_prompt)
        ]
        
        response = await self._call_llm(messages, temperature=0.3)
        
        try:
            stats_data = json.loads(response)
            return {
                "extraction_type": "statistics",
                "data": stats_data,
                "timestamp": str(datetime.now())
            }
        except json.JSONDecodeError:
            return self._fallback_stats_extraction(content)
    
    def _fallback_stats_extraction(self, content: str) -> Dict[str, Any]:
        """Fallback statistical extraction using regex"""
        stats = {
            "sample_sizes": re.findall(r'n\s*=\s*(\d+)', content, re.IGNORECASE),
            "p_values": re.findall(r'p\s*[<>=]\s*([0-9.]+)', content, re.IGNORECASE),
            "correlations": re.findall(r'r\s*=\s*([-0-9.]+)', content, re.IGNORECASE),
            "means": re.findall(r'mean\s*=\s*([0-9.]+)', content, re.IGNORECASE),
        }
        
        return {
            "extraction_type": "statistics",
            "data": stats,
            "timestamp": str(datetime.now())
        }
    
    async def _extract_keywords(self, content: str) -> Dict[str, Any]:
        """Extract keywords and key terms from research paper"""
        keywords_prompt = f"""
        Extract key terms, concepts, and important keywords from this research paper:
        
        {content[:2000]}
        
        Focus on:
        - Technical terms
        - Methodology keywords
        - Key concepts
        - Research variables
        - Domain-specific terminology
        
        Return as JSON with categorized keywords.
        """
        
        messages = [
            self._create_system_message("You are a research analysis expert. Extract and categorize key terms accurately."),
            self._create_user_message(keywords_prompt)
        ]
        
        response = await self._call_llm(messages, temperature=0.5)
        
        try:
            keywords_data = json.loads(response)
            return {
                "extraction_type": "keywords",
                "data": keywords_data,
                "timestamp": str(datetime.now())
            }
        except json.JSONDecodeError:
            return {"extraction_type": "keywords", "data": {"keywords": []}, "timestamp": str(datetime.now())}
    
    async def _extract_references(self, content: str) -> Dict[str, Any]:
        """Extract references and citations from research paper"""
        refs_prompt = f"""
        Extract all references and citations from this research paper:
        
        {content}
        
        Look for:
        - Author names and years
        - Journal names
        - Book titles
        - DOI numbers
        - URLs
        
        Return as JSON with structured reference data.
        """
        
        messages = [
            self._create_system_message("You are a bibliographic expert. Extract references accurately."),
            self._create_user_message(refs_prompt)
        ]
        
        response = await self._call_llm(messages, temperature=0.3)
        
        try:
            refs_data = json.loads(response)
            return {
                "extraction_type": "references",
                "data": refs_data,
                "timestamp": str(datetime.now())
            }
        except json.JSONDecodeError:
            return {"extraction_type": "references", "data": {"references": []}, "timestamp": str(datetime.now())}
    
    async def _extract_figures(self, content: str) -> Dict[str, Any]:
        """Extract figure information from research paper"""
        figures_prompt = f"""
        Extract information about figures, charts, and graphs from this research paper:
        
        {content[:2000]}
        
        Look for:
        - Figure captions
        - Chart descriptions
        - Graph data
        - Visual elements mentioned
        
        Return as JSON with figure details.
        """
        
        messages = [
            self._create_system_message("You are a data visualization expert. Extract figure information accurately."),
            self._create_user_message(figures_prompt)
        ]
        
        response = await self._call_llm(messages, temperature=0.5)
        
        try:
            figures_data = json.loads(response)
            return {
                "extraction_type": "figures",
                "data": figures_data,
                "timestamp": str(datetime.now())
            }
        except json.JSONDecodeError:
            return {"extraction_type": "figures", "data": {"figures": []}, "timestamp": str(datetime.now())}
    
    async def _extract_all(self, content: str) -> Dict[str, Any]:
        """Extract all types of data from research paper"""
        results = {}
        
        for extraction_type in self.extraction_types:
            try:
                result = await self.extract_data(content, extraction_type)
                results[extraction_type] = result["data"]
            except Exception as e:
                results[extraction_type] = {"error": str(e)}
        
        return {
            "extraction_type": "all",
            "data": results,
            "timestamp": str(datetime.now())
        }
    
    async def analyze_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze extracted data and generate insights"""
        self.log_activity("analyze_data", {"data_type": type(data).__name__})
        
        analysis_prompt = f"""
        Analyze the following extracted research data and provide insights:
        
        {json.dumps(data, indent=2)}
        
        Provide analysis including:
        1. Key patterns and trends
        2. Notable findings
        3. Data quality assessment
        4. Recommendations for further analysis
        5. Potential research implications
        
        Return as structured JSON with analysis sections.
        """
        
        messages = [
            self._create_system_message("You are a data analysis expert. Provide comprehensive insights from research data."),
            self._create_user_message(analysis_prompt)
        ]
        
        response = await self._call_llm(messages, temperature=0.7)
        
        try:
            analysis = json.loads(response)
            return {
                "analysis": analysis,
                "timestamp": str(datetime.now())
            }
        except json.JSONDecodeError:
            return {
                "analysis": {"insights": "Analysis completed but could not parse structured response"},
                "timestamp": str(datetime.now())
            }
    
    async def generate_visualization(self, data: Dict[str, Any], chart_type: str = "bar") -> Dict[str, Any]:
        """Generate data visualizations"""
        self.log_activity("generate_visualization", {"chart_type": chart_type})
        
        try:
            # Convert data to pandas DataFrame if possible
            if isinstance(data, dict) and "tables" in data:
                # Try to create visualization from table data
                return await self._create_table_visualization(data["tables"], chart_type)
            elif isinstance(data, dict) and "statistics" in data:
                # Try to create visualization from statistics
                return await self._create_stats_visualization(data["statistics"], chart_type)
            else:
                # Generic visualization
                return await self._create_generic_visualization(data, chart_type)
                
        except Exception as e:
            return {
                "error": f"Could not generate visualization: {str(e)}",
                "chart_type": chart_type,
                "timestamp": str(datetime.now())
            }
    
    async def _create_table_visualization(self, tables: List[Dict], chart_type: str) -> Dict[str, Any]:
        """Create visualization from table data"""
        # This would typically involve converting table data to charts
        # For now, return a simple representation
        return {
            "visualization_type": chart_type,
            "data_source": "tables",
            "table_count": len(tables),
            "message": "Table visualization would be generated here",
            "timestamp": str(datetime.now())
        }
    
    async def _create_stats_visualization(self, stats: Dict, chart_type: str) -> Dict[str, Any]:
        """Create visualization from statistical data"""
        return {
            "visualization_type": chart_type,
            "data_source": "statistics",
            "stats_categories": list(stats.keys()),
            "message": "Statistical visualization would be generated here",
            "timestamp": str(datetime.now())
        }
    
    async def _create_generic_visualization(self, data: Any, chart_type: str) -> Dict[str, Any]:
        """Create generic visualization from any data"""
        return {
            "visualization_type": chart_type,
            "data_type": type(data).__name__,
            "message": "Generic visualization would be generated here",
            "timestamp": str(datetime.now())
        }
    
    async def process_request(self, **kwargs) -> Dict[str, Any]:
        """Process data extraction request"""
        file_content = kwargs.get('file_content')
        extraction_type = kwargs.get('extraction_type', 'tables')
        
        if not file_content:
            raise ValueError("file_content is required")
        
        extracted_data = await self.extract_data(file_content, extraction_type)
        analysis = await self.analyze_data(extracted_data["data"])
        
        return {
            "extracted_data": extracted_data,
            "analysis": analysis,
            "extraction_type": extraction_type,
            "timestamp": str(datetime.now())
        } 