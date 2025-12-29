"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddProjectDialog } from "./add-project-dialog";
import { useState } from "react";

export default function ManageProjectsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <AddProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Project
            </Button>
        </AddProjectDialog>

      </div>
      
       <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No projects found. Add one to get started!
                </TableCell>
            </TableRow>
            {/* Project rows will be mapped here */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
