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
import { useFormState, useFormStatus } from 'react-dom';
import { addProject, type ProjectFormState } from './actions';
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

type AddProjectDialogProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const initialState: ProjectFormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Project'}
    </Button>
  );
}

export function AddProjectDialog({ children, open, onOpenChange }: AddProjectDialogProps) {
    const [state, formAction] = useFormState(addProject, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success",
                description: state.message,
            });
            onOpenChange(false);
            formRef.current?.reset();
        } else if (state.message && !state.success) {
             toast({
                title: "Error",
                description: state.message,
                variant: 'destructive'
            });
        }
    }, [state, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new project to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" name="title" className="col-span-3" />
                 {state.errors?.title && <p className="col-span-4 text-red-500 text-xs text-right">{state.errors.title[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" className="col-span-3" />
                {state.errors?.description && <p className="col-span-4 text-red-500 text-xs text-right">{state.errors.description[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="techStack" className="text-right">Tech Stack</Label>
                <Input id="techStack" name="techStack" placeholder="React, Next.js, ..." className="col-span-3" />
                <p className="col-span-4 text-xs text-muted-foreground text-right">Comma-separated values.</p>
                {state.errors?.techStack && <p className="col-span-4 text-red-500 text-xs text-right">{state.errors.techStack[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="liveLink" className="text-right">Project Link</Label>
                <Input id="liveLink" name="liveLink" placeholder="https://..." className="col-span-3" />
                 {state.errors?.liveLink && <p className="col-span-4 text-red-500 text-xs text-right">{state.errors.liveLink[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="githubLink" className="text-right">Code Link</Label>
                <Input id="githubLink" name="githubLink" placeholder="https://github.com/..." className="col-span-3" />
                 {state.errors?.githubLink && <p className="col-span-4 text-red-500 text-xs text-right">{state.errors.githubLink[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" placeholder="https://..." className="col-span-3" />
                 {state.errors?.imageUrl && <p className="col-span-4 text-red-500 text-xs text-right">{state.errors.imageUrl[0]}</p>}
            </div>
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
