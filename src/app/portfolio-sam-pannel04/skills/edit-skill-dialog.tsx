
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
import { Label } from "@/components/ui/label";
import { useFormStatus } from 'react-dom';
import { updateSkill, type SkillFormState } from './actions';
import { useEffect, useRef, useActionState, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { type Skill } from "./skill-types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predefinedSkills } from "./predefined-skills";


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
    const [selectedSkillName, setSelectedSkillName] = useState<string | undefined>(skill.name);


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
        if (isOpen) {
            setSelectedSkillName(skill.name);
        }
        setOpen(isOpen);
    }
    
    const selectedSkillPreview = predefinedSkills.find(s => s.name === selectedSkillName);


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                <Label htmlFor="name" className="text-right">Skill</Label>
                <div className="col-span-3">
                    <Select name="name" required onValueChange={setSelectedSkillName} defaultValue={skill.name}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a skill" />
                        </SelectTrigger>
                        <SelectContent>
                            {predefinedSkills.map(skill => (
                                <SelectItem key={skill.name} value={skill.name}>
                                    {skill.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedSkillPreview && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Icon Preview</Label>
                    <div className="col-span-3 flex items-center justify-start rounded-md border p-4">
                        <div
                            className="h-10 w-10 text-primary"
                            dangerouslySetInnerHTML={{ __html: selectedSkillPreview.svg }}
                        />
                    </div>
                </div>
            )}

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
