'use server';

import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db, storage } from '@/lib/firebase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  techStack: z.string().min(1, 'Tech stack is required'),
  liveLink: z.string().url('Invalid URL format').or(z.literal('')),
  githubLink: z.string().url('Invalid URL format').or(z.literal('')),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  imageFile: z
    .any()
    .optional(),
}).refine(data => {
    const file = data.imageFile;
    if (!file || file.size === 0) return !!data.imageUrl; // If no file, imageUrl must be present
    if (!data.imageUrl && file.size === 0) return false; // If no imageUrl and no file, it's invalid
    return true;
}, {
  message: "Either an image URL or an image file must be provided.",
  path: ["imageUrl"],
}).refine(data => {
    const file = data.imageFile;
    return !file || file.size === 0 || file.size <= MAX_FILE_SIZE;
}, {
    message: `Max image size is 5MB.`,
    path: ['imageFile'],
}).refine(data => {
    const file = data.imageFile;
    return !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type);
}, {
    message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
    path: ['imageFile'],
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
  try {
    const imageFile = formData.get('imageFile');
    
    const validatedFields = projectFormSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      techStack: formData.get('techStack'),
      liveLink: formData.get('liveLink'),
      githubLink: formData.get('githubLink'),
      imageUrl: formData.get('imageUrl'),
      imageFile: imageFile instanceof File && imageFile.size > 0 ? imageFile : undefined,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Please check your input.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { techStack, imageFile: file, imageUrl: providedImageUrl, ...rest } = validatedFields.data;
    let finalImageUrl = providedImageUrl;

    if (file) {
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
        const fileBuffer = await file.arrayBuffer();
        await uploadBytes(storageRef, fileBuffer, { contentType: file.type });
        finalImageUrl = await getDownloadURL(storageRef);
    }
    
    if (!finalImageUrl) {
        return {
            success: false,
            message: 'Image is required. Please provide a URL or upload a file.',
            errors: { imageUrl: ['Image is required.'] }
        };
    }

    const techStackArray = techStack.split(',').map((tech) => tech.trim());

    await addDoc(collection(db, 'projects'), {
      ...rest,
      imageUrl: finalImageUrl,
      techStack: techStackArray,
      createdAt: new Date(),
    });

    revalidatePath('/portfolio-sam-pannel04/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    
    return { success: true, message: 'Project added successfully!' };
  } catch (error: unknown) {
    console.error("SERVER_ACTION_ERROR:", error); // For server-side debugging
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
