'use server';

import { addDoc, collection } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/firebase';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  techStack: z.string().min(1, 'Tech stack is required'),
  liveLink: z.string().url('Invalid URL format').or(z.literal('')),
  githubLink: z.string().url('Invalid URL format').or(z.literal('')),
  imageUrl: z.string().url('Invalid URL format').or(z.literal('')),
});

export type ProjectFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export async function addProject(
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const validatedFields = projectSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    techStack: formData.get('techStack'),
    liveLink: formData.get('liveLink'),
    githubLink: formData.get('githubLink'),
    imageUrl: formData.get('imageUrl'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { techStack, ...rest } = validatedFields.data;

  try {
    const techStackArray = techStack.split(',').map((tech) => tech.trim());
    
    // In a real scenario, you'd also handle the image upload here
    // and get back a URL to store in Firestore.
    // For now, we're assuming imageUrl is provided directly.

    await addDoc(collection(db, 'projects'), {
      ...rest,
      techStack: techStackArray,
      createdAt: new Date(),
    });

    revalidatePath('/portfolio-sam-pannel04/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    
    return { success: true, message: 'Project added successfully!' };
  } catch (error) {
    console.error('Error adding project to Firestore:', error);
    return { success: false, message: 'Failed to add project. Please try again.' };
  }
}
