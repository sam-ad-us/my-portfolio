
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { uploadImage } from '@/ai/flows/upload-image-flow';
import { FieldValue } from 'firebase-admin/firestore';
import { type EducationEntry } from '@/types/user-profile';

export type UserProfileState = {
  success: boolean;
  message: string;
};

const adminUid = 'emM4KrlWNMR9Vhh7uCMmH5D6t362';

export async function updateUserProfile(
  prevState: UserProfileState,
  formData: FormData
): Promise<UserProfileState> {
  try {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const introduction = formData.get('introduction') as string;
    const passions = formData.get('passions') as string;
    const githubLink = formData.get('githubLink') as string;
    const linkedinLink = formData.get('linkedinLink') as string;
    const twitterLink = formData.get('twitterLink') as string;
    const instagramLink = formData.get('instagramLink') as string;
    const imageFile = formData.get('imageFile') as File | null;
    let imageUrlFromForm = formData.get('profilePicture') as string | null;

    // Handle education entries
    const educationEntries: EducationEntry[] = [];
    let i = 0;
    while (formData.has(`education[${i}].degree`)) {
        const degree = formData.get(`education[${i}].degree`) as string;
        const institution = formData.get(`education[${i}].institution`) as string;
        const dates = formData.get(`education[${i}].dates`) as string;
        const id = formData.get(`education[${i}].id`) as string;
        if (degree && institution && dates) {
            educationEntries.push({ id, degree, institution, dates });
        }
        i++;
    }

    if (!name || !role || !introduction) {
      return { success: false, message: 'Name, Role, and Introduction are required.' };
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
         return { success: false, message: `Failed to upload image. ${uploadError.message}` };
      }
    }

    const profileData: { [key: string]: any } = {
      name,
      role,
      introduction,
      education: educationEntries,
      passions,
      githubLink,
      linkedinLink,
      twitterLink,
      instagramLink,
      profilePicture: finalImageUrl || FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Remove empty fields so they don't overwrite existing data with nulls
    Object.keys(profileData).forEach(key => {
        if (profileData[key] === null || profileData[key] === undefined || profileData[key] === '') {
            delete profileData[key];
        }
    });

    await adminDb.collection('user_profiles').doc(adminUid).set(profileData, { merge: true });

    // Revalidate all paths where user profile data is displayed
    revalidatePath('/portfolio-sam-pannel04/about');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/'); // For footer
    
    return { success: true, message: 'Profile updated successfully!' };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, message: `Failed to update profile. ${errorMessage}` };
  }
}
