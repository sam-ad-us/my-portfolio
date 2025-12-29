'use server';

import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db, storage } from '@/lib/firebase';

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
    const imageFile = formData.get('imageFile') as File;
    const imageUrlFromForm = formData.get('imageUrl') as string;

    // Basic server-side validation
    if (!title || !description || !techStack) {
      return { success: false, message: 'Title, Description, and Tech Stack are required.' };
    }
    if (!imageUrlFromForm && (!imageFile || imageFile.size === 0)) {
        return { success: false, message: 'Either an Image URL or an Image File must be provided.' };
    }


    let finalImageUrl = imageUrlFromForm;

    if (imageFile && imageFile.size > 0) {
      try {
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        const fileBuffer = await imageFile.arrayBuffer();
        await uploadBytes(storageRef, fileBuffer, { contentType: imageFile.type });
        finalImageUrl = await getDownloadURL(storageRef);
      } catch (uploadError) {
        console.error("SERVER_ACTION_ERROR (File Upload):", uploadError);
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'An unknown error occurred during file upload.';
        return { success: false, message: `Failed to upload image. ${errorMessage}` };
      }
    }

    if (!finalImageUrl) {
        return { success: false, message: 'Image is required but could not be processed.' };
    }
    
    const techStackArray = techStack.split(',').map((tech) => tech.trim());
    
    try {
      await addDoc(collection(db, 'projects'), {
        title,
        description,
        techStack: techStackArray,
        liveLink,
        githubLink,
        imageUrl: finalImageUrl,
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error("SERVER_ACTION_ERROR (Firestore Write):", dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'An unknown error occurred during database write.';
      return { success: false, message: `Failed to save project to database. ${errorMessage}` };
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
    await deleteDoc(doc(db, 'projects', projectId));

    if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }

    revalidatePath('/portfolio-sam-pannel04/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    
    return { success: true, message: 'Project deleted successfully!' };
  } catch (error) {
    console.error('Error deleting project:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, message: `Failed to delete project. ${errorMessage}` };
  }
}
