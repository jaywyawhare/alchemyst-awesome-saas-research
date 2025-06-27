from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import os
from langchain_openai import ChatOpenAI
import json
from datetime import datetime

class BaseAgent(ABC):
    """Base class for all research assistant agents using Alchemyst proxy"""
    
    def __init__(self):
        self.alchemyst_api_key = os.getenv("ALCHEMYST_API_KEY")
        self.agent_name = self.__class__.__name__
        
        if not self.alchemyst_api_key:
            raise ValueError("ALCHEMYST_API_KEY must be set in environment variables")
        
        # Initialize LLM with correct Alchemyst proxy configuration
        self.llm = self._initialize_llm()
    
    def _initialize_llm(self) -> ChatOpenAI:
        """Initialize the LLM with correct Alchemyst proxy configuration"""
        # For Alchemyst AI proxy - no OpenAI API key needed
        BASE_URL_WITH_PROXY = "https://platform-backend.getalchemystai.com/api/v1/proxy/default"
        
        return ChatOpenAI(
            api_key=self.alchemyst_api_key,
            model="alchemyst-ai/alchemyst-c1",
            base_url=BASE_URL_WITH_PROXY,
        )
    
    @abstractmethod
    async def process_request(self, **kwargs) -> Dict[str, Any]:
        """Process the main request for this agent"""
        pass
    
    async def _call_llm(self, messages: List[Dict], temperature: float = 0.7) -> str:
        """Make a call to the LLM with the given messages"""
        try:
            # Convert messages to the format expected by LangChain
            formatted_messages = []
            for msg in messages:
                if isinstance(msg, dict):
                    formatted_messages.append(msg)
                else:
                    # Handle LangChain message objects if needed
                    formatted_messages.append({"role": "user", "content": str(msg)})
            
            # Use the LLM to generate response
            result = self.llm.invoke(formatted_messages)
            return result.content
            
        except Exception as e:
            self.log_activity("llm_exception", {"error": str(e)})
            raise Exception(f"LLM call failed: {str(e)}")
    
    def _create_system_message(self, system_prompt: str) -> Dict[str, str]:
        """Create a system message for the agent"""
        return {"role": "system", "content": system_prompt}
    
    def _create_user_message(self, user_input: str) -> Dict[str, str]:
        """Create a user message"""
        return {"role": "user", "content": user_input}
    
    def log_activity(self, activity: str, data: Optional[Dict[str, Any]] = None):
        """Log agent activity for observability"""
        log_entry = {
            "agent": self.agent_name,
            "activity": activity,
            "timestamp": str(datetime.now()),
            "data": data or {}
        }
        print(f"AGENT_LOG: {json.dumps(log_entry)}")
    
    def get_agent_info(self) -> Dict[str, Any]:
        """Get information about this agent"""
        return {
            "name": self.agent_name,
            "description": self.__doc__ or "No description available",
            "capabilities": self.get_capabilities()
        }
    
    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Return list of capabilities for this agent"""
        pass 