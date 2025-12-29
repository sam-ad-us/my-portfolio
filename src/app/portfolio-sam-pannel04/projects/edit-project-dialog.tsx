"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormStatus } from 'react-dom';
import { updateProject, type ProjectFormState } from './actions';
import { useEffect, useRef, useActionState, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { type Project } from "@/components/project-card";

type EditProjectDialogProps = {
  children: React.ReactNode;
  project: Project;
};

const initialState: ProjectFormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function EditProjectDialog({ children, project }: EditProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useActionState(updateProject, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({
                    title: "Success",
                    description: state.message,
                });
                setOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: state.message,
                    variant: 'destructive'
                });
            }
        }
    }, [state, toast]);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            formRef.current?.reset();
            setIsUploading(false);
        }
        setOpen(isOpen);
    }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="grid gap-4 py-4">
            <input type="hidden" name="projectId" value={project.id} />
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" name="title" className="col-span-3" defaultValue={project.title} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" className="col-span-3" defaultValue={project.description} required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="techStack" className="text-right">Tech Stack</Label>
                <Input id="techStack" name="techStack" placeholder="React, Next.js, ..." className="col-span-3" defaultValue={project.techStack.join(', ')} required/>
                <p className="col-span-4 text-xs text-muted-foreground text-right">Comma-separated values.</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="liveLink" className="text-right">Project Link</Label>
                <Input id="liveLink" name="liveLink" placeholder="https://..." className="col-span-3" defaultValue={project.liveLink} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="githubLink" className="text-right">Code Link</Label>
                <Input id="githubLink" name="githubLink" placeholder="https://github.com/..." className="col-span-3" defaultValue={project.githubLink} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="upload-switch-edit" className="text-right">Change Image</Label>
                 <div className="col-span-3 flex items-center gap-2">
                    <Switch id="upload-switch-edit" checked={isUploading} onCheckedChange={setIsUploading} />
                    <span className="text-sm text-muted-foreground">{isUploading ? "Upload from device" : "Use Image URL"}</span>
                </div>
            </div>

            {isUploading ? (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageFile" className="text-right">New Image</Label>
                    <Input id="imageFile" name="imageFile" type="file" accept="image/*" className="col-span-3" />
                    <input type="hidden" name="imageUrl" value={project.imageUrl} />
                </div>
            ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" placeholder="https://..." className="col-span-3" defaultValue={project.imageUrl} />
                </div>
            )}
            
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <SubmitButton />
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
