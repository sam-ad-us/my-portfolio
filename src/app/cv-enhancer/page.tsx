"use client";

import { useState } from 'react';
import { handleCvRefinement } from './actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CvEnhancerPage() {
  const [cvText, setCvText] = useState('');
  const [refinedCvText, setRefinedCvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please paste your CV text into the box.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setRefinedCvText('');

    const result = await handleCvRefinement(cvText);

    if (result.success && result.data) {
      setRefinedCvText(result.data);
      toast({
        title: 'CV Refined!',
        description: 'Your CV has been enhanced successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Something went wrong.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          AI CV Enhancer
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Paste your current CV text below and let our AI refine it to be more
          attractive to employers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Your CV Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your CV content here..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="min-h-[250px] text-base"
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Refining...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Refine with AI
              </>
            )}
          </Button>
        </div>

        {refinedCvText && (
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>AI-Refined CV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none rounded-md border bg-background/50 p-4 text-base">
                <pre className="whitespace-pre-wrap bg-transparent p-0 font-body">
                  {refinedCvText}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
