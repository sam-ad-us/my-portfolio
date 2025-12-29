
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { predefinedSkills } from './predefined-skills';

export type SkillFormState = {
  success: boolean;
  message: string;
};

export async function addSkill(
  prevState: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  try {
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'tech' | 'non-tech';

    if (!name || !type) {
      return { success: false, message: 'Skill Name and Type are required.' };
    }
    
    const selectedSkill = predefinedSkills.find(skill => skill.name === name);

    if (!selectedSkill) {
      return { success: false, message: 'Selected skill not found.' };
    }

    await adminDb.collection('skills').add({
      name: selectedSkill.name,
      svg: selectedSkill.svg,
      type,
      createdAt: new Date(),
    });

    revalidatePath('/portfolio-sam-pannel04/skills');
    revalidatePath('/skills');
    
    return { success: true, message: 'Skill added successfully!' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, message: `Failed to add skill. ${errorMessage}` };
  }
}

export async function updateSkill(
  prevState: SkillFormState,
  formData: FormData
): Promise<SkillFormState> {
  try {
    const skillId = formData.get('skillId') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'tech' | 'non-tech';

    if (!skillId || !name || !type) {
      return { success: false, message: 'Skill ID, Name, and Type are required.' };
    }
    
    const selectedSkill = predefinedSkills.find(skill => skill.name === name);

    if (!selectedSkill) {
      return { success: false, message: 'Selected skill not found.' };
    }

    const skillRef = adminDb.collection('skills').doc(skillId);
    await skillRef.update({
      name: selectedSkill.name,
      svg: selectedSkill.svg,
      type,
    });

    revalidatePath('/portfolio-sam-pannel04/skills');
    revalidatePath('/skills');
    
    return { success: true, message: 'Skill updated successfully!' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, message: `Failed to update skill. ${errorMessage}` };
  }
}

export async function deleteSkill(skillId: string): Promise<{ success: boolean; message: string }> {
  try {
    await adminDb.collection('skills').doc(skillId).delete();

    revalidatePath('/portfolio-sam-pannel04/skills');
    revalidatePath('/skills');
    
    return { success: true, message: 'Skill deleted successfully!' };
  } catch (error: any) {
    const errorMessage = error.message || 'An unknown server error occurred.';
    return { success: false, message: `Failed to delete skill. ${errorMessage}` };
  }
}
