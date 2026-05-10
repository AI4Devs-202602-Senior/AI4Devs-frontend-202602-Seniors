import { useState, useEffect } from 'react';
import {
  Candidate,
  InterviewStep,
  KanbanBoard,
} from '../types/position';
import {
  getInterviewFlow,
  getCandidates,
  updateCandidateStage,
} from '../services/positionService';

/**
 * Custom hook to load and manage kanban board data for a position.
 * Fetches interview flow and candidates in parallel, normalizes by step.
 * Provides optimistic move with rollback on error.
 *
 * @param positionId - The position to load
 * @returns Object with board data, loading state, error, and moveCandidate function
 */
export const usePositionBoard = (positionId: number) => {
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [positionName, setPositionName] = useState('');

  // Load data on mount or when positionId changes
  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both endpoints in parallel
        const [flowData, candidatesData] = await Promise.all([
          getInterviewFlow(positionId),
          getCandidates(positionId),
        ]);

        // Build column map from steps
        const columns: Record<number, InterviewStep> = {};
        flowData.interviewFlow.interviewSteps.forEach((step) => {
          columns[step.id] = step;
        });

        // Normalize candidates by step
        const candidatesByStep: Record<number, Candidate[]> = {};
        Object.keys(columns).forEach((stepId) => {
          candidatesByStep[stepId] = [];
        });
        candidatesData.forEach((candidate) => {
          if (candidatesByStep[candidate.currentInterviewStep]) {
            candidatesByStep[candidate.currentInterviewStep].push(candidate);
          }
        });

        setPositionName(flowData.positionName);
        setBoard({
          columns,
          candidates: candidatesByStep,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, [positionId]);

  /**
   * Move candidate from one step to another (optimistic).
   * Updates local state immediately, reverts on API error.
   *
   * @param applicationId - The application ID
   * @param fromStepId - Current step ID
   * @param toStepId - Target step ID
   * @param onSuccess - Callback on successful move
   * @param onError - Callback on error (receives error message)
   */
  const moveCandidate = async (
    applicationId: number,
    fromStepId: number,
    toStepId: number,
    onSuccess?: () => void,
    onError?: (message: string) => void
  ) => {
    if (!board) return;

    // Find candidate to move
    const candidate = board.candidates[fromStepId].find(
      (c) => c.applicationId === applicationId
    );
    if (!candidate) {
      onError?.('Candidate not found');
      return;
    }

    // Save original state for rollback
    const originalBoard = JSON.parse(JSON.stringify(board));

    // Optimistic update: move candidate immediately
    const updatedCandidates = { ...board.candidates };
    updatedCandidates[fromStepId] = updatedCandidates[fromStepId].filter(
      (c) => c.applicationId !== applicationId
    );
    updatedCandidates[toStepId] = [
      ...updatedCandidates[toStepId],
      { ...candidate, currentInterviewStep: toStepId },
    ];

    setBoard({
      columns: board.columns,
      candidates: updatedCandidates,
    });

    // Call API
    try {
      await updateCandidateStage(applicationId, toStepId);
      onSuccess?.();
    } catch (err) {
      // Rollback on error
      setBoard(originalBoard);
      const message =
        err instanceof Error ? err.message : 'Failed to update candidate stage';
      onError?.(message);
    }
  };

  return {
    board,
    loading,
    error,
    positionName,
    moveCandidate,
  };
};
