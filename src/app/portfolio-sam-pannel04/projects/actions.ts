'use server';

import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/firebase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  techStack: z.string().min(1, 'Tech stack is required'),
  liveLink: z.string().url('Invalid URL format').or(z.literal('')),
  githubLink: z.string().url('Invalid URL format').or(z.literal('')),
  imageUrl: z.string().url('A valid image URL is required').optional(),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
}).refine(data => data.imageUrl || data.imageFile, {
  message: "Either an image URL or an image file must be provided.",
  path: ["imageUrl"], // Report error on imageUrl field
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
  
  const imageFile = formData.get('imageFile');
  const validatedFields = projectSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    techStack: formData.get('techStack'),
    liveLink: formData.get('liveLink'),
    githubLink: formData.get('githubLink'),
    imageUrl: formData.get('imageUrl') || undefined,
    imageFile: imageFile instanceof File && imageFile.size > 0 ? imageFile : undefined,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { techStack, imageFile: file, ...rest } = validatedFields.data;
  let finalImageUrl = rest.imageUrl;

  try {
    // Handle image upload if a file is provided
    if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
        
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        
        await uploadBytes(storageRef, fileBuffer, {
            contentType: file.type,
        });

        finalImageUrl = await getDownloadURL(storageRef);
    }
    
    if (!finalImageUrl) {
        return {
            success: false,
            message: 'Image URL is missing after processing.',
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
  } catch (error) {
    console.error('Error adding project:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to add project. ${errorMessage}` };
  }
}
