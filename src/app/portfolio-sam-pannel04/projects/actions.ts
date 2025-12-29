'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { uploadImage } from '@/ai/flows/upload-image-flow';
import { type Project } from '@/components/project-card';


export type ProjectFormState = {
  success: boolean;
  message: string;
};

export async function addProject(
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const techStack = formData.get('techStack') as string;
    const liveLink = formData.get('liveLink') as string;
    const githubLink = formData.get('githubLink') as string;
    const imageFile = formData.get('imageFile') as File | null;
    let imageUrlFromForm = formData.get('imageUrl') as string | null;

    if (!title || !description || !techStack) {
      return { success: false, message: 'Title, Description, and Tech Stack are required.' };
    }

    let finalImageUrl = imageUrlFromForm;

    if (imageFile && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const dataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        
        const uploadResult = await uploadImage({ dataUri });
        finalImageUrl = uploadResult.url;

      } catch (uploadError: any) {
         console.error("SERVER_ACTION_ERROR (ImageKit Upload):", uploadError);
         const errorMessage = uploadError.message || 'An unknown error occurred during file upload.';
         if (errorMessage.includes('CORS')) {
            return { success: false, message: 'Image upload failed due to a CORS policy on the storage bucket. Please configure your bucket to allow uploads from this domain.' };
         }
         return { success: false, message: `Failed to upload image. ${errorMessage}` };
      }
    }

    if (!finalImageUrl) {
      return { success: false, message: 'An image URL or an uploaded image file is required.' };
    }

    const techStackArray = techStack.split(',').map((tech) => tech.trim());
    
    try {
      await adminDb.collection('projects').add({
        title,
        description,
        techStack: techStackArray,
        liveLink,
        githubLink,
        imageUrl: finalImageUrl,
        createdAt: new Date(),
      });
    } catch (dbError: any) {
      console.error("SERVER_ACTION_ERROR (Firestore Write):", dbError);
      return { success: false, message: `Failed to save project to database. ${dbError.message}` };
    }

    revalidatePath('/portfolio-sam-pannel04/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    
    return { success: true, message: 'Project added successfully!' };

  } catch (error: unknown) {
    console.error("SERVER_ACTION_ERROR (Outer Catch):", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, message: `Failed to add project. ${errorMessage}` };
  }
}

export async function updateProject(
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
    try {
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const techStack = formData.get('techStack') as string;
    const liveLink = formData.get('liveLink') as string;
    const githubLink = formData.get('githubLink') as string;
    const imageFile = formData.get('imageFile') as File | null;
    let imageUrlFromForm = formData.get('imageUrl') as string | null;

    if (!projectId || !title || !description || !techStack) {
      return { success: false, message: 'Project ID, Title, Description, and Tech Stack are required.' };
    }

    let finalImageUrl = imageUrlFromForm;

    if (imageFile && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const dataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        
        const uploadResult = await uploadImage({ dataUri });
        finalImageUrl = uploadResult.url;

      } catch (uploadError: any) {
         console.error("SERVER_ACTION_ERROR (ImageKit Upload):", uploadError);
         const errorMessage = uploadError.message || 'An unknown error occurred during file upload.';
         return { success: false, message: `Failed to upload image. ${errorMessage}` };
      }
    }

    if (!finalImageUrl) {
      return { success: false, message: 'An image URL or an uploaded image file is required.' };
    }

    const techStackArray = techStack.split(',').map((tech) => tech.trim());
    
    try {
      const projectRef = adminDb.collection('projects').doc(projectId);
      await projectRef.update({
        title,
        description,
        techStack: techStackArray,
        liveLink,
        githubLink,
        imageUrl: finalImageUrl,
      });

    } catch (dbError: any) {
      console.error("SERVER_ACTION_ERROR (Firestore Update):", dbError);
      return { success: false, message: `Failed to update project. ${dbError.message}` };
    }

    revalidatePath('/portfolio-sam-pannel04/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    
    return { success: true, message: 'Project updated successfully!' };

  } catch (error: unknown) {
    console.error("SERVER_ACTION_ERROR (Outer Catch - Update):", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, message: `Failed to update project. ${errorMessage}` };
  }
}


export async function deleteProject(projectId: string, imageUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    await adminDb.collection('projects').doc(projectId).delete();

    // ImageKit deletion is not implemented in the provided flow, 
    // but if it were, the logic would go here.
    // For now, we just delete the Firestore document.

    revalidatePath('/portfolio-sam-pannel04/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    
    return { success: true, message: 'Project deleted successfully!' };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    const errorMessage = error.message || 'An unknown server error occurred.';
    return { success: false, message: `Failed to delete project. ${errorMessage}` };
  }
}
