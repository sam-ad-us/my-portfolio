
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
import { addSkill, type SkillFormState } from './actions';
import { useEffect, useRef, useActionState, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predefinedSkills } from "./predefined-skills";

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
    const [selectedSkillName, setSelectedSkillName] = useState<string | undefined>();

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({
                    title: "Success",
                    description: state.message,
                });
                onOpenChange(false);
                formRef.current?.reset();
                setSelectedSkillName(undefined);
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
            setSelectedSkillName(undefined);
        }
        onOpenChange(isOpen);
    }
    
    const selectedSkillPreview = predefinedSkills.find(s => s.name === selectedSkillName);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogDescription>
            Select a skill from the list to add it to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Skill</Label>
                <div className="col-span-3">
                    <Select name="name" required onValueChange={setSelectedSkillName}>
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
