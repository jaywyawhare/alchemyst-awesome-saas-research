import json
from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent
from datetime import datetime

class ProposalAgent(BaseAgent):
    """Automated Research Proposal Generator - Generates and improves research proposals"""
    
    def __init__(self):
        super().__init__()
        self.proposal_sections = [
            "title",
            "abstract",
            "introduction",
            "literature_review",
            "research_questions",
            "hypotheses",
            "methodology",
            "data_collection",
            "analysis_plan",
            "expected_outcomes",
            "timeline",
            "budget",
            "references"
        ]
    
    def get_capabilities(self) -> List[str]:
        return [
            "Generate complete research proposals",
            "Improve existing proposals with feedback",
            "Create proposal sections individually",
            "Validate proposal structure",
            "Generate funding justifications"
        ]
    
    async def generate_proposal(self, research_topic: str, research_question: str, 
                               methodology: str, expected_outcomes: str,
                               additional_context: str = "") -> Dict[str, Any]:
        """Generate a complete research proposal"""
        self.log_activity("generate_proposal", {
            "research_topic": research_topic,
            "methodology": methodology
        })
        
        try:
            proposal_prompt = f"""
            Generate a comprehensive research proposal based on the following information:
            
            Research Topic: {research_topic}
            Research Question: {research_question}
            Methodology: {methodology}
            Expected Outcomes: {expected_outcomes}
            Additional Context: {additional_context}
            
            Create a complete research proposal with the following sections:
            1. Title - Clear and descriptive
            2. Abstract - Summary of the research (150-250 words)
            3. Introduction - Background and significance
            4. Literature Review - Brief overview of relevant research
            5. Research Questions - Specific questions to be addressed
            6. Hypotheses - Testable predictions
            7. Methodology - Detailed research design
            8. Data Collection - Methods and procedures
            9. Analysis Plan - Statistical or analytical approach
            10. Expected Outcomes - Anticipated results and impact
            11. Timeline - Project schedule (6-12 months)
            12. Budget - Estimated costs and justification
            13. References - Key sources (at least 10)
            
            Format the proposal professionally with clear headings and academic writing style.
            Return as a structured JSON object with each section as a key.
            """
            
            messages = [
                self._create_system_message("You are an expert research proposal writer. Generate comprehensive, well-structured proposals that follow academic standards."),
                self._create_user_message(proposal_prompt)
            ]
            
            response = await self._call_llm(messages, temperature=0.7)
            
            try:
                proposal_data = json.loads(response)
                return {
                    "proposal": proposal_data,
                    "generated_at": str(datetime.now()),
                    "sections_completed": len(proposal_data.keys()),
                    "status": "complete"
                }
            except json.JSONDecodeError:
                # Fallback: generate structured proposal
                return await self._generate_structured_proposal(
                    research_topic, research_question, methodology, expected_outcomes, additional_context
                )
                
        except Exception as e:
            raise Exception(f"Failed to generate proposal: {str(e)}")
    
    async def _generate_structured_proposal(self, research_topic: str, research_question: str,
                                          methodology: str, expected_outcomes: str,
                                          additional_context: str) -> Dict[str, Any]:
        """Generate proposal section by section"""
        proposal = {}
        
        # Generate each section individually
        sections_to_generate = [
            ("title", f"Generate a clear, descriptive title for research on: {research_topic}"),
            ("abstract", f"Write an abstract (150-250 words) for research on {research_topic}. Research question: {research_question}. Methodology: {methodology}"),
            ("introduction", f"Write an introduction for research on {research_topic}. Include background, significance, and context."),
            ("research_questions", f"Formulate specific research questions for: {research_question}"),
            ("hypotheses", f"Generate testable hypotheses for research on {research_topic}"),
            ("methodology", f"Detail the methodology for: {methodology}"),
            ("expected_outcomes", f"Describe expected outcomes: {expected_outcomes}"),
            ("timeline", "Create a 12-month project timeline with milestones"),
            ("budget", "Estimate budget for this research project with cost breakdown"),
            ("references", f"Generate 10 relevant references for research on {research_topic}")
        ]
        
        for section_name, prompt in sections_to_generate:
            try:
                section_prompt = f"""
                {prompt}
                
                Additional context: {additional_context}
                
                Write this section in academic style, be specific and detailed.
                """
                
                messages = [
                    self._create_system_message(f"You are writing the {section_name} section of a research proposal."),
                    self._create_user_message(section_prompt)
                ]
                
                section_content = await self._call_llm(messages, temperature=0.6)
                proposal[section_name] = section_content.strip()
                
            except Exception as e:
                proposal[section_name] = f"Error generating {section_name}: {str(e)}"
        
        return {
            "proposal": proposal,
            "generated_at": str(datetime.now()),
            "sections_completed": len(proposal.keys()),
            "status": "complete"
        }
    
    async def improve_proposal(self, proposal_text: str, feedback: str) -> Dict[str, Any]:
        """Improve an existing proposal based on feedback"""
        self.log_activity("improve_proposal", {"feedback_length": len(feedback)})
        
        try:
            improvement_prompt = f"""
            Improve the following research proposal based on the provided feedback:
            
            Original Proposal:
            {proposal_text}
            
            Feedback for Improvement:
            {feedback}
            
            Please:
            1. Address all points in the feedback
            2. Maintain the original structure and flow
            3. Improve clarity, specificity, and academic rigor
            4. Ensure all sections are well-developed
            5. Fix any grammatical or formatting issues
            
            Return the improved proposal with the same structure as the original.
            """
            
            messages = [
                self._create_system_message("You are an expert research proposal editor. Improve proposals based on feedback while maintaining academic standards."),
                self._create_user_message(improvement_prompt)
            ]
            
            improved_proposal = await self._call_llm(messages, temperature=0.6)
            
            return {
                "improved_proposal": improved_proposal,
                "original_proposal": proposal_text,
                "feedback_applied": feedback,
                "improved_at": str(datetime.now()),
                "status": "improved"
            }
            
        except Exception as e:
            raise Exception(f"Failed to improve proposal: {str(e)}")
    
    async def generate_section(self, section_name: str, context: Dict[str, str]) -> str:
        """Generate a specific section of a research proposal"""
        self.log_activity("generate_section", {"section": section_name})
        
        if section_name not in self.proposal_sections:
            raise ValueError(f"Invalid section: {section_name}")
        
        section_prompts = {
            "title": "Generate a clear, descriptive research title",
            "abstract": "Write a comprehensive abstract (150-250 words)",
            "introduction": "Write an introduction with background and significance",
            "literature_review": "Write a literature review section",
            "research_questions": "Formulate specific research questions",
            "hypotheses": "Generate testable hypotheses",
            "methodology": "Detail the research methodology",
            "data_collection": "Describe data collection methods",
            "analysis_plan": "Outline the analysis plan",
            "expected_outcomes": "Describe expected outcomes and impact",
            "timeline": "Create a project timeline with milestones",
            "budget": "Estimate budget with cost breakdown",
            "references": "Generate relevant references"
        }
        
        prompt = f"""
        {section_prompts.get(section_name, f"Write the {section_name} section")}
        
        Context:
        {json.dumps(context, indent=2)}
        
        Write this section in academic style, be specific and detailed.
        """
        
        messages = [
            self._create_system_message(f"You are writing the {section_name} section of a research proposal."),
            self._create_user_message(prompt)
        ]
        
        return await self._call_llm(messages, temperature=0.6)
    
    async def validate_proposal(self, proposal: Dict[str, Any]) -> Dict[str, Any]:
        """Validate a research proposal for completeness and quality"""
        self.log_activity("validate_proposal", {"sections_count": len(proposal.keys())})
        
        try:
            validation_prompt = f"""
            Validate the following research proposal for completeness and quality:
            
            {json.dumps(proposal, indent=2)}
            
            Assess:
            1. Completeness - Are all essential sections present?
            2. Quality - Is the writing clear and academic?
            3. Coherence - Do sections flow logically?
            4. Specificity - Are methods and outcomes specific enough?
            5. Feasibility - Is the research feasible?
            6. Impact - Is the significance clear?
            
            Return a JSON object with:
            - overall_score: 1-10
            - missing_sections: list of missing sections
            - quality_issues: list of quality problems
            - recommendations: list of improvement suggestions
            - is_ready: boolean (ready for submission)
            """
            
            messages = [
                self._create_system_message("You are a research proposal reviewer. Assess proposals for completeness, quality, and feasibility."),
                self._create_user_message(validation_prompt)
            ]
            
            response = await self._call_llm(messages, temperature=0.5)
            
            try:
                validation_result = json.loads(response)
                return {
                    "validation": validation_result,
                    "validated_at": str(datetime.now()),
                    "proposal_sections": list(proposal.keys())
                }
            except json.JSONDecodeError:
                return {
                    "validation": {"error": "Could not parse validation result"},
                    "validated_at": str(datetime.now()),
                    "proposal_sections": list(proposal.keys())
                }
                
        except Exception as e:
            return {
                "validation": {"error": f"Validation failed: {str(e)}"},
                "validated_at": str(datetime.now()),
                "proposal_sections": list(proposal.keys())
            }
    
    async def generate_funding_justification(self, proposal: Dict[str, Any], 
                                           funding_amount: str = "50,000") -> str:
        """Generate funding justification for a research proposal"""
        self.log_activity("generate_funding_justification", {"funding_amount": funding_amount})
        
        try:
            justification_prompt = f"""
            Generate a funding justification for the following research proposal:
            
            {json.dumps(proposal, indent=2)}
            
            Funding Amount: ${funding_amount}
            
            Create a compelling justification that includes:
            1. Research significance and impact
            2. Innovation and novelty
            3. Feasibility and methodology strength
            4. Expected outcomes and benefits
            5. Cost-effectiveness
            6. Alignment with funding priorities
            
            Write in a persuasive, professional tone suitable for funding applications.
            """
            
            messages = [
                self._create_system_message("You are a grant writing expert. Create compelling funding justifications."),
                self._create_user_message(justification_prompt)
            ]
            
            return await self._call_llm(messages, temperature=0.7)
            
        except Exception as e:
            return f"Error generating funding justification: {str(e)}"
    
    async def process_request(self, **kwargs) -> Dict[str, Any]:
        """Process proposal generation request"""
        action = kwargs.get('action', 'generate')
        
        if action == 'generate':
            research_topic = kwargs.get('research_topic')
            research_question = kwargs.get('research_question')
            methodology = kwargs.get('methodology')
            expected_outcomes = kwargs.get('expected_outcomes')
            additional_context = kwargs.get('additional_context', '')
            
            if not all([research_topic, research_question, methodology, expected_outcomes]):
                raise ValueError("research_topic, research_question, methodology, and expected_outcomes are required")
            
            return await self.generate_proposal(research_topic, research_question, methodology, expected_outcomes, additional_context)
        
        elif action == 'improve':
            proposal_text = kwargs.get('proposal_text')
            feedback = kwargs.get('feedback')
            
            if not proposal_text or not feedback:
                raise ValueError("proposal_text and feedback are required")
            
            return await self.improve_proposal(proposal_text, feedback)
        
        elif action == 'validate':
            proposal = kwargs.get('proposal')
            
            if not proposal:
                raise ValueError("proposal is required")
            
            return await self.validate_proposal(proposal)
        
        elif action == 'funding_justification':
            proposal = kwargs.get('proposal')
            funding_amount = kwargs.get('funding_amount', '50,000')
            
            if not proposal:
                raise ValueError("proposal is required")
            
            justification = await self.generate_funding_justification(proposal, funding_amount)
            return {"funding_justification": justification}
        
        else:
            raise ValueError(f"Unknown action: {action}") 