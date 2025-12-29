'use server';

import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
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

    if (!title || !description || !techStack) {
      return { success: false, message: 'Title, Description, and Tech Stack are required.' };
    }

    let finalImageUrl = imageUrlFromForm;

    if (imageFile && imageFile.size > 0) {
      try {
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        const fileBuffer = await imageFile.arrayBuffer();
        await uploadBytes(storageRef, fileBuffer, { contentType: imageFile.type });
        finalImageUrl = await getDownloadURL(storageRef);
      } catch (uploadError: any) {
        console.error("SERVER_ACTION_ERROR (File Upload):", uploadError);

        if (uploadError.code === 'storage/unknown') {
            return {
                success: false,
                message: "CORS configuration error. Your Firebase Storage bucket is not configured to allow uploads from this domain. Please configure CORS on your bucket to fix this."
            }
        }
        
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'An unknown error occurred during file upload.';
        return { success: false, message: `Failed to upload image. ${errorMessage}` };
      }
    }

    if (!finalImageUrl) {
        return { success: false, message: 'An image URL or an uploaded image file is required.' };
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
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (storageError) {
        console.warn(`Could not delete image from storage: ${imageUrl}. It might have been already deleted or the URL is incorrect.`, storageError);
        // We don't block the success of the overall delete operation if only image deletion fails.
      }
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
