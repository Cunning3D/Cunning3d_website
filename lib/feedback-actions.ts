'use server';

import type { ActionResponse, BlockFeedback, PageFeedback } from '@/components/components/feedback/schema';
import { onBlockFeedbackAction, onPageFeedbackAction } from './github';

export async function sendPageFeedbackAction(feedback: PageFeedback): Promise<ActionResponse> {
  return onPageFeedbackAction(feedback);
}

export async function sendBlockFeedbackAction(feedback: BlockFeedback): Promise<ActionResponse> {
  return onBlockFeedbackAction(feedback);
}
