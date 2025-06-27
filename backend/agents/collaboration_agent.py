import json
import uuid
from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent
from datetime import datetime
import asyncio

class CollaborationAgent(BaseAgent):
    """Research Paper Collaboration Assistant - Enables real-time collaboration on papers"""
    
    def __init__(self):
        super().__init__()
        # In-memory storage (in production, use Redis or database)
        self.papers = {}
        self.comments = {}
        self.tasks = {}
        self.collaborators = {}
    
    def get_capabilities(self) -> List[str]:
        return [
            "Add comments to papers",
            "Assign tasks to collaborators",
            "Track collaboration history",
            "Real-time paper editing",
            "Version control for papers"
        ]
    
    async def add_comment(self, paper_id: str, comment: str, user_id: str, 
                         section: str = "general", line_number: Optional[int] = None) -> str:
        """Add a comment to a paper"""
        self.log_activity("add_comment", {"paper_id": paper_id, "user_id": user_id, "section": section})
        
        comment_id = str(uuid.uuid4())
        comment_data = {
            "id": comment_id,
            "paper_id": paper_id,
            "user_id": user_id,
            "comment": comment,
            "section": section,
            "line_number": line_number,
            "timestamp": str(datetime.now()),
            "status": "active"
        }
        
        if paper_id not in self.comments:
            self.comments[paper_id] = []
        
        self.comments[paper_id].append(comment_data)
        
        # Generate AI response to the comment
        ai_response = await self._generate_ai_response(comment, section)
        if ai_response:
            ai_comment_id = str(uuid.uuid4())
            ai_comment_data = {
                "id": ai_comment_id,
                "paper_id": paper_id,
                "user_id": "ai_assistant",
                "comment": ai_response,
                "section": section,
                "line_number": line_number,
                "timestamp": str(datetime.now()),
                "status": "active",
                "is_ai": True
            }
            self.comments[paper_id].append(ai_comment_data)
        
        return comment_id
    
    async def _generate_ai_response(self, comment: str, section: str) -> Optional[str]:
        """Generate AI response to a comment"""
        try:
            response_prompt = f"""
            A researcher has made the following comment on the {section} section of their paper:
            
            "{comment}"
            
            Provide a helpful, constructive response that:
            1. Acknowledges the comment
            2. Offers specific suggestions for improvement
            3. Maintains a collaborative and supportive tone
            4. Is concise but thorough
            
            Respond as an AI research assistant.
            """
            
            messages = [
                self._create_system_message("You are an AI research assistant helping with paper collaboration. Provide constructive, helpful feedback."),
                self._create_user_message(response_prompt)
            ]
            
            return await self._call_llm(messages, temperature=0.7)
            
        except Exception as e:
            return None
    
    async def get_comments(self, paper_id: str) -> List[Dict[str, Any]]:
        """Get all comments for a paper"""
        return self.comments.get(paper_id, [])
    
    async def create_task(self, paper_id: str, title: str, description: str, 
                         assigned_to: str, priority: str = "medium") -> str:
        """Create a task for paper collaboration"""
        self.log_activity("create_task", {"paper_id": paper_id, "assigned_to": assigned_to, "priority": priority})
        
        task_id = str(uuid.uuid4())
        task_data = {
            "id": task_id,
            "paper_id": paper_id,
            "title": title,
            "description": description,
            "assigned_to": assigned_to,
            "priority": priority,
            "status": "pending",
            "created_at": str(datetime.now()),
            "updated_at": str(datetime.now())
        }
        
        if paper_id not in self.tasks:
            self.tasks[paper_id] = []
        
        self.tasks[paper_id].append(task_data)
        return task_id
    
    async def update_task_status(self, task_id: str, status: str) -> bool:
        """Update the status of a task"""
        for paper_tasks in self.tasks.values():
            for task in paper_tasks:
                if task["id"] == task_id:
                    task["status"] = status
                    task["updated_at"] = str(datetime.now())
                    return True
        return False
    
    async def get_tasks(self, paper_id: str) -> List[Dict[str, Any]]:
        """Get all tasks for a paper"""
        return self.tasks.get(paper_id, [])
    
    async def add_collaborator(self, paper_id: str, user_id: str, role: str = "collaborator") -> bool:
        """Add a collaborator to a paper"""
        if paper_id not in self.collaborators:
            self.collaborators[paper_id] = []
        
        collaborator_data = {
            "user_id": user_id,
            "role": role,
            "added_at": str(datetime.now())
        }
        
        # Check if collaborator already exists
        for collab in self.collaborators[paper_id]:
            if collab["user_id"] == user_id:
                return False
        
        self.collaborators[paper_id].append(collaborator_data)
        return True
    
    async def get_collaborators(self, paper_id: str) -> List[Dict[str, Any]]:
        """Get all collaborators for a paper"""
        return self.collaborators.get(paper_id, [])
    
    async def create_paper_version(self, paper_id: str, content: str, user_id: str) -> str:
        """Create a new version of a paper"""
        self.log_activity("create_paper_version", {"paper_id": paper_id, "user_id": user_id})
        
        version_id = str(uuid.uuid4())
        version_data = {
            "id": version_id,
            "paper_id": paper_id,
            "content": content,
            "created_by": user_id,
            "created_at": str(datetime.now()),
            "version_number": len(self.papers.get(paper_id, [])) + 1
        }
        
        if paper_id not in self.papers:
            self.papers[paper_id] = []
        
        self.papers[paper_id].append(version_data)
        return version_id
    
    async def get_paper_versions(self, paper_id: str) -> List[Dict[str, Any]]:
        """Get all versions of a paper"""
        return self.papers.get(paper_id, [])
    
    async def get_latest_version(self, paper_id: str) -> Optional[Dict[str, Any]]:
        """Get the latest version of a paper"""
        versions = self.papers.get(paper_id, [])
        if versions:
            return max(versions, key=lambda x: x["created_at"])
        return None
    
    async def generate_collaboration_summary(self, paper_id: str) -> str:
        """Generate a summary of collaboration activity"""
        self.log_activity("generate_collaboration_summary", {"paper_id": paper_id})
        
        comments = await self.get_comments(paper_id)
        tasks = await self.get_tasks(paper_id)
        versions = await self.get_paper_versions(paper_id)
        collaborators = await self.get_collaborators(paper_id)
        
        summary_prompt = f"""
        Generate a collaboration summary for a research paper with the following activity:
        
        Comments: {len(comments)} total comments
        Tasks: {len(tasks)} tasks (pending: {len([t for t in tasks if t['status'] == 'pending'])}, completed: {len([t for t in tasks if t['status'] == 'completed'])})
        Versions: {len(versions)} versions created
        Collaborators: {len(collaborators)} team members
        
        Recent activity:
        - Latest comment: {comments[-1]['comment'][:100] + '...' if comments else 'None'}
        - Latest task: {tasks[-1]['title'] if tasks else 'None'}
        - Latest version: Version {versions[-1]['version_number'] if versions else 'None'}
        
        Provide a brief summary of the collaboration progress and suggest next steps.
        """
        
        messages = [
            self._create_system_message("You are a project management assistant. Generate concise collaboration summaries."),
            self._create_user_message(summary_prompt)
        ]
        
        return await self._call_llm(messages, temperature=0.5)
    
    async def process_request(self, **kwargs) -> Dict[str, Any]:
        """Process collaboration request"""
        action = kwargs.get('action')
        paper_id = kwargs.get('paper_id')
        
        if not action or not paper_id:
            raise ValueError("action and paper_id are required")
        
        if action == "add_comment":
            comment = kwargs.get('comment')
            user_id = kwargs.get('user_id')
            section = kwargs.get('section', 'general')
            comment_id = await self.add_comment(paper_id, comment, user_id, section)
            return {"comment_id": comment_id, "success": True}
        
        elif action == "get_comments":
            comments = await self.get_comments(paper_id)
            return {"comments": comments}
        
        elif action == "create_task":
            title = kwargs.get('title')
            description = kwargs.get('description')
            assigned_to = kwargs.get('assigned_to')
            priority = kwargs.get('priority', 'medium')
            task_id = await self.create_task(paper_id, title, description, assigned_to, priority)
            return {"task_id": task_id, "success": True}
        
        elif action == "get_tasks":
            tasks = await self.get_tasks(paper_id)
            return {"tasks": tasks}
        
        elif action == "get_summary":
            summary = await self.generate_collaboration_summary(paper_id)
            return {"summary": summary}
        
        else:
            raise ValueError(f"Unknown action: {action}") 