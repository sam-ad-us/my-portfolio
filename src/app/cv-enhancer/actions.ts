"use server";
import { refineCv } from '@/ai/flows/cv-refinement';

export async function handleCvRefinement(cvText: string): Promise<{
  success: boolean;
  data?: string;
  error?: string;
}> {
  try {
    if (!cvText) {
      return { success: false, error: 'CV text cannot be empty.' };
    }
    const result = await refineCv({ cvText });
    return { success: true, data: result.refinedCvText };
  } catch (error) {
    console.error('Error refining CV:', error);
    return { success: false, error: 'Failed to refine CV due to a server error.' };
  }
}
