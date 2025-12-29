
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
import { addSkill, type SkillFormState } from './actions';
import { useEffect, useRef, useActionState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type AddSkillDialogProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const initialState: SkillFormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Skill'}
    </Button>
  );
}

export function AddSkillDialog({ children, open, onOpenChange }: AddSkillDialogProps) {
    const [state, formAction] = useActionState(addSkill, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({
                    title: "Success",
                    description: state.message,
                });
                onOpenChange(false);
                formRef.current?.reset();
            } else {
                toast({
                    title: "Error",
                    description: state.message,
                    variant: 'destructive'
                });
            }
        }
    }, [state, onOpenChange, toast]);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            formRef.current?.reset();
        }
        onOpenChange(isOpen);
    }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new skill.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="svg" className="text-right">SVG Icon</Label>
                <Textarea id="svg" name="svg" placeholder="<svg>...</svg>" className="col-span-3" required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <RadioGroup name="type" defaultValue="tech" className="col-span-3 flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tech" id="tech" />
                  <Label htmlFor="tech">Tech</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-tech" id="non-tech" />
                  <Label htmlFor="non-tech">Non-Tech</Label>
                </div>
              </RadioGroup>
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
