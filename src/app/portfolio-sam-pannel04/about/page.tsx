
'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import { adminDb } from '@/lib/firebase-admin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile, type UserProfileState } from './actions';
import { useFormStatus } from 'react-dom';
import { Switch } from '@/components/ui/switch';
import { type UserProfile } from '@/types/user-profile';
import { Skeleton } from '@/components/ui/skeleton';

const initialState: UserProfileState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export default function ManageAboutPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, formAction] = useActionState(updateUserProfile, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const adminUid = 'emM4KrlWNMR9Vhh7uCMmH5D6t362';

  useEffect(() => {
    async function fetchProfile() {
      try {
        const docRef = doc(db, 'user_profiles', adminUid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Could not fetch profile data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [toast]);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success',
          description: state.message,
        });
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage About Section</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Edit Your Profile</CardTitle>
                <CardDescription>Update the information that appears on your public "About Me" page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage About Section</h1>
      </div>

      <form action={formAction} ref={formRef}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
            <CardDescription>
              Update the information that appears on your public "About Me" page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={profile?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input id="role" name="role" placeholder="e.g., Software Engineer" defaultValue={profile?.role} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="introduction">Introduction</Label>
              <Textarea id="introduction" name="introduction" placeholder="A brief introduction about yourself..." className="min-h-32" defaultValue={profile?.introduction} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea id="education" name="education" placeholder="Your educational background..." className="min-h-24" defaultValue={profile?.education} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="passions">Passions / Hobbies</Label>
              <Textarea id="passions" name="passions" placeholder="What are you passionate about outside of work?" className="min-h-24" defaultValue={profile?.passions} />
            </div>

            <div className="space-y-4 rounded-md border p-4">
                 <h3 className="text-lg font-medium">Social Links</h3>
                 <div className="space-y-2">
                    <Label htmlFor="githubLink">GitHub</Label>
                    <Input id="githubLink" name="githubLink" placeholder="https://github.com/..." defaultValue={profile?.githubLink} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="linkedinLink">LinkedIn</Label>
                    <Input id="linkedinLink" name="linkedinLink" placeholder="https://linkedin.com/in/..." defaultValue={profile?.linkedinLink} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="twitterLink">Twitter / X</Label>
                    <Input id="twitterLink" name="twitterLink" placeholder="https://twitter.com/..." defaultValue={profile?.twitterLink} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="instagramLink">Instagram</Label>
                    <Input id="instagramLink" name="instagramLink" placeholder="https://instagram.com/..." defaultValue={profile?.instagramLink} />
                 </div>
            </div>

             <div className="space-y-4 rounded-md border p-4">
                <h3 className="text-lg font-medium">Profile Picture</h3>
                 <div className="flex items-center gap-4">
                     <Label htmlFor="upload-switch">Change Image</Label>
                     <div className="flex items-center gap-2">
                        <Switch id="upload-switch" checked={isUploading} onCheckedChange={setIsUploading} />
                        <span className="text-sm text-muted-foreground">{isUploading ? "Upload from device" : "Use Image URL"}</span>
                    </div>
                </div>

                {isUploading ? (
                    <div className="space-y-2">
                        <Label htmlFor="imageFile">New Image</Label>
                        <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
                        {profile?.profilePicture && <input type="hidden" name="profilePicture" value={profile.profilePicture} />}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="profilePicture">Image URL</Label>
                        <Input id="profilePicture" name="profilePicture" placeholder="https://..." defaultValue={profile?.profilePicture} />
                    </div>
                )}
            </div>

            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
