
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
import { updateSkill, type SkillFormState } from './actions';
import { useEffect, useRef, useActionState, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { type Skill } from "./skill-types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


type EditSkillDialogProps = {
  children: React.ReactNode;
  skill: Skill;
};

const initialState: SkillFormState = {
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

export function EditSkillDialog({ children, skill }: EditSkillDialogProps) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useActionState(updateSkill, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
          <DialogDescription>
            Make changes to your skill below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="grid gap-4 py-4">
            <input type="hidden" name="skillId" value={skill.id} />
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" defaultValue={skill.name} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="svg" className="text-right">SVG Icon</Label>
                <Textarea id="svg" name="svg" className="col-span-3" defaultValue={skill.svg} required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <RadioGroup name="type" defaultValue={skill.type} className="col-span-3 flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tech" id="edit-tech" />
                  <Label htmlFor="edit-tech">Tech</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-tech" id="edit-non-tech" />
                  <Label htmlFor="edit-non-tech">Non-Tech</Label>
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
