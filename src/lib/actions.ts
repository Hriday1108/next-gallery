'use server';

import {
  suggestTasks,
  type SuggestTasksInput,
} from '@/ai/flows/suggest-tasks';

export async function getTaskSuggestions(
  input: SuggestTasksInput
): Promise<{ tasks?: string[]; error?: string }> {
  try {
    const result = await suggestTasks(input);
    if (!result.tasks || result.tasks.length === 0) {
      return { error: 'The AI could not generate tasks based on the input. Please try refining your description and skills.' };
    }
    return { tasks: result.tasks };
  } catch (error) {
    console.error('Error getting task suggestions:', error);
    return { error: 'An unexpected error occurred while generating tasks. Please try again later.' };
  }
}
