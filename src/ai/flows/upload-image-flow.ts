'use server';
/**
 * @fileOverview A Genkit flow for uploading images to ImageKit.
 * This flow takes a data URI, uploads the corresponding image to ImageKit,
 * and returns the public URL of the uploaded image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

const UploadImageInputSchema = z.object({
  dataUri: z
    .string()
    .describe(
      "The image to upload, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type UploadImageInput = z.infer<typeof UploadImageInputSchema>;

const UploadImageOutputSchema = z.object({
  url: z.string().url().describe('The public URL of the uploaded image.'),
});
export type UploadImageOutput = z.infer<typeof UploadImageOutputSchema>;

export async function uploadImage(
  input: UploadImageInput
): Promise<UploadImageOutput> {
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
      // Extract base64 data and file name details from data URI
      const buffer = Buffer.from(dataUri.split(',')[1], 'base64');
      const fileType = dataUri.substring(
        dataUri.indexOf(':') + 1,
        dataUri.indexOf(';')
      );
      const extension = fileType.split('/')[1];
      const fileName = `project_${Date.now()}.${extension}`;

      const response = await imagekit.upload({
        file: buffer,
        fileName: fileName,
        folder: '/portfolio-projects/',
      });

      return {
        url: response.url,
      };
    } catch (error) {
      console.error('Error in uploadImageFlow (ImageKit): ', error);
      throw new Error('Failed to upload image to ImageKit.');
    }
  }
);
