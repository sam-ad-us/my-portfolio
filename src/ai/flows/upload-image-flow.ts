'use server';
/**
 * @fileOverview A Genkit flow for uploading images.
 * This flow takes a data URI, uploads the corresponding image to a publicly accessible
 * location, and returns the public URL of the uploaded image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getStorage, ref, uploadString, getDownloadURL} from 'firebase/storage';
import { app } from '@/lib/firebase'; // Assuming you have a firebase app instance exported

const storage = getStorage(app);

const UploadImageInputSchema = z.object({
  dataUri: z.string().describe(
    "The image to upload, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type UploadImageInput = z.infer<typeof UploadImageInputSchema>;

const UploadImageOutputSchema = z.object({
  url: z.string().url().describe('The public URL of the uploaded image.'),
});
export type UploadImageOutput = z.infer<typeof UploadImageOutputSchema>;


export async function uploadImage(input: UploadImageInput): Promise<UploadImageOutput> {
    return uploadImageFlow(input);
}


const uploadImageFlow = ai.defineFlow(
  {
    name: 'uploadImageFlow',
    inputSchema: UploadImageInputSchema,
    outputSchema: UploadImageOutputSchema,
  },
  async ({ dataUri }) => {
    try {
        const fileType = dataUri.substring(dataUri.indexOf(':') + 1, dataUri.indexOf(';'));
        const extension = fileType.split('/')[1];
        const fileName = `uploads/${Date.now()}.${extension}`;

        const storageRef = ref(storage, fileName);

        const snapshot = await uploadString(storageRef, dataUri, 'data_url');
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return {
            url: downloadUrl,
        };

    } catch (error) {
        console.error("Error in uploadImageFlow: ", error);
        throw new Error("Failed to upload image.");
    }
  }
);
