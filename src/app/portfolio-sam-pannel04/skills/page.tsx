
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddSkillDialog } from "./add-skill-dialog";
import { EditSkillDialog } from "./edit-skill-dialog";
import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Skill } from "./skill-types";
import { deleteSkill } from "./actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";


export default function ManageSkillsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'skills'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const skillsData: Skill[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        skillsData.push({
          id: doc.id,
          name: data.name,
          svg: data.svg,
          type: data.type,
          createdAt: data.createdAt.toDate(),
        });
      });
      setSkills(skillsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching skills: ", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Could not fetch skills.",
        variant: "destructive"
      });
    });
    return () => unsubscribe();
  }, [toast]);

  const handleDelete = async (skillId: string) => {
    const result = await deleteSkill(skillId);
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Skills</h1>
        <AddSkillDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
           <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
            </Button>
        </AddSkillDialog>
      </div>
      
       <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Loading skills...
                </TableCell>
              </TableRow>
            ) : skills.length > 0 ? (
              skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell>
                    <div
                        className="h-8 w-8 text-primary"
                        dangerouslySetInnerHTML={{ __html: skill.svg }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                   <TableCell>
                    <Badge variant={skill.type === 'tech' ? 'secondary' : 'outline'}>
                      {skill.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <EditSkillDialog skill={skill}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                    </EditSkillDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the skill from your database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(skill.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No skills found. Add one to get started!
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
