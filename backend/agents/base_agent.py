from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import os
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json

class BaseAgent(ABC):
    """Base class for all research assistant agents"""
    
    def __init__(self):
        self.llm = self._initialize_llm()
        self.agent_name = self.__class__.__name__
        
    def _initialize_llm(self) -> ChatOpenAI:
        """Initialize the LLM with Alchemyst proxy configuration"""
        alchemyst_api_key = os.getenv("ALCHEMYST_API_KEY")
        openai_api_key = os.getenv("OPENAI_API_KEY")
        
        if not alchemyst_api_key or not openai_api_key:
            raise ValueError("ALCHEMYST_API_KEY and OPENAI_API_KEY must be set in environment variables")
        
        base_url = f"https://platform-backend.getalchemystai.com/api/v1/proxy/https://api.openai.com/v1/{openai_api_key}"
        
        return ChatOpenAI(
            api_key=alchemyst_api_key,
            model="gpt-4o",
            configuration={
                "baseURL": base_url,
            }
        )
    
    @abstractmethod
    async def process_request(self, **kwargs) -> Dict[str, Any]:
        """Process the main request for this agent"""
        pass
    
    async def _call_llm(self, messages: List, temperature: float = 0.7) -> str:
        """Make a call to the LLM with the given messages"""
        try:
            response = await self.llm.ainvoke(messages)
            return response.content
        except Exception as e:
            raise Exception(f"LLM call failed: {str(e)}")
    
    def _create_system_message(self, system_prompt: str) -> SystemMessage:
        """Create a system message for the agent"""
        return SystemMessage(content=system_prompt)
    
    def _create_user_message(self, user_input: str) -> HumanMessage:
        """Create a user message"""
        return HumanMessage(content=user_input)
    
    def log_activity(self, activity: str, data: Dict[str, Any] = None):
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