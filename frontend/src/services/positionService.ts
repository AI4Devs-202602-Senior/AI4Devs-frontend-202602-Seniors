import axios from 'axios';
import {
  Candidate,
  InterviewFlow,
  PositionDetail,
  UpdateStageResponse,
} from '../types/position';

const API_BASE = 'http://localhost:3010';

/**
 * Fetches the interview flow for a given position.
 * @param positionId - The position ID
 * @returns Promise resolving to position detail with interview flow
 * @throws Error if position not found
 */
export const getInterviewFlow = async (
  positionId: number
): Promise<PositionDetail> => {
  const response = await axios.get<PositionDetail>(
    `${API_BASE}/positions/${positionId}/interviewFlow`
  );
  return response.data;
};

/**
 * Fetches all candidates for a given position.
 * @param positionId - The position ID
 * @returns Promise resolving to array of candidates
 * @throws Error if position not found
 */
export const getCandidates = async (positionId: number): Promise<Candidate[]> => {
  const response = await axios.get<Candidate[]>(
    `${API_BASE}/positions/${positionId}/candidates`
  );
  return response.data;
};

/**
 * Updates a candidate's interview stage (optimistic).
 * @param applicationId - The application ID
 * @param stepId - The target interview step ID
 * @returns Promise resolving to the updated application data
 * @throws Error if application or step not found
 */
export const updateCandidateStage = async (
  applicationId: number,
  stepId: number
): Promise<UpdateStageResponse> => {
  const response = await axios.put<UpdateStageResponse>(
    `${API_BASE}/candidates/${applicationId}/stage`,
    {
      applicationId: String(applicationId),
      currentInterviewStep: String(stepId),
    }
  );
  return response.data;
};
