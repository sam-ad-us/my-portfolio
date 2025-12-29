'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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
        const storageRef = ref(storage, `portfolio-projects/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      } catch (uploadError: any) {
         if (uploadError.code === 'storage/unknown') {
           console.error("CORS_ERROR (Firebase Storage):", "Please configure CORS on your Firebase Storage bucket.");
           return { success: false, message: 'Image upload failed due to a server configuration issue. Please check the CORS settings on your Firebase Storage bucket.'};
         }
        console.error("SERVER_ACTION_ERROR (Firebase Storage Upload):", uploadError);
        const errorMessage = uploadError.message || 'An unknown error occurred during file upload.';
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
      return { success: false, message: `Failed to save project to database. Firestore security rules might be preventing access.` };
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


export async function deleteProject(projectId: string, imageUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    await adminDb.collection('projects').doc(projectId).delete();

    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (storageError: any) {
        if (storageError.code === 'storage/object-not-found') {
          console.warn(`Image not found in Firebase Storage, but proceeding with Firestore deletion: ${imageUrl}`);
        } else {
           throw storageError;
        }
      }
    }

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
