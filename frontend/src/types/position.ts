/**
 * Position and kanban-related types for the LTI Talent Tracking System.
 */

/**
 * Interview step in a position's interview flow.
 * @property id - Unique identifier
 * @property interviewFlowId - Parent interview flow ID
 * @property interviewTypeId - Type of interview
 * @property name - Step name (e.g., "Initial Screening", "Technical Interview")
 * @property orderIndex - Order in the pipeline
 */
export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

/**
 * Interview flow pipeline for a position.
 * @property id - Unique identifier
 * @property description - Flow description
 * @property interviewSteps - Ordered list of interview steps
 */
export interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

/**
 * Position with interview flow details.
 * @property positionName - The position title
 * @property interviewFlow - The interview pipeline
 */
export interface PositionDetail {
  positionName: string;
  interviewFlow: InterviewFlow;
}

/**
 * Candidate in the kanban board.
 * @property id - Candidate ID (for drag-drop tracking)
 * @property applicationId - Application ID (unique identifier for the candidate-position combo)
 * @property fullName - Candidate's full name
 * @property currentInterviewStep - The step ID candidate is currently in
 * @property averageScore - Interview score (0-5)
 */
export interface Candidate {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: number;
  averageScore: number;
}

/**
 * Kanban board state: candidates grouped by interview step.
 * @property columns - Map of step ID to step details
 * @property candidates - Map of step ID to candidates in that step
 */
export interface KanbanBoard {
  columns: Record<number, InterviewStep>;
  candidates: Record<number, Candidate[]>;
}

/**
 * API response for updating a candidate's stage.
 */
export interface UpdateStageResponse {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: unknown[];
  };
}
