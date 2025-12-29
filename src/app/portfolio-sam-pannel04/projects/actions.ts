'use server';

import { revalidatePath } from 'next/cache';
import ImageKit from 'imagekit';
import { adminDb } from '@/lib/firebase-admin';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

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
    const imageUrlFromForm = formData.get('imageUrl') as string | null;

    if (!title || !description || !techStack) {
      return { success: false, message: 'Title, Description, and Tech Stack are required.' };
    }

    let finalImageUrl = imageUrlFromForm;

    if (imageFile && imageFile.size > 0) {
       try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const response = await imagekit.upload({
            file: buffer,
            fileName: imageFile.name,
            folder: '/portfolio-projects/',
        });
        finalImageUrl = response.url;
       } catch (uploadError) {
         console.error("SERVER_ACTION_ERROR (ImageKit Upload):", uploadError);
         const errorMessage = uploadError instanceof Error ? uploadError.message : 'An unknown error occurred during file upload.';
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
    await adminDb.collection('projects').doc(projectId).delete();

    if (imageUrl && imageUrl.includes(process.env.IMAGEKIT_URL_ENDPOINT!)) {
      try {
        const files = await imagekit.listFiles({
          searchQuery: `url = "${imageUrl}"`
        });
        if (files && files.length > 0) {
          await imagekit.deleteFile(files[0].fileId);
        }
      } catch (imageKitError) {
        console.warn(`Could not delete image from ImageKit: ${imageUrl}. It might have been already deleted or the URL is incorrect.`, imageKitError);
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
