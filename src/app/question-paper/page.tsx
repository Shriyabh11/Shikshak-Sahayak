'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  GenerateQuestionPaperInput,
  GenerateQuestionPaperOutput,
  generateQuestionPaper,
} from '@/ai/flows/generate-question-paper';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard-layout';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  grade: z.string().min(1, { message: 'Grade is required.' }),
  subject: z.string().min(2, { message: 'Subject must be at least 2 characters.' }),
  topic: z.string().min(2, { message: 'Topic must be at least 2 characters.' }),
  questionType: z.string({ required_error: 'Please select a question type.' }),
  difficultyLevel: z.string({ required_error: 'Please select a difficulty level.' }),
});

export default function QuestionPaperPage() {
  const { toast } = useToast();
  const [questionPaperOutput, setQuestionPaperOutput] = useState<GenerateQuestionPaperOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: '10th',
      subject: 'Science',
      topic: 'Chemical Reactions',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuestionPaperOutput(null);
    try {
      const input: GenerateQuestionPaperInput = values;
      const output = await generateQuestionPaper(input);
      setQuestionPaperOutput(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating question paper',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 py-4 md:py-8">
        <div className="space-y-2 px-4 md:px-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Question Paper Generation</h1>
          <p className="text-muted-foreground">
            Create custom question papers with the help of AI.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 px-4 md:px-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Paper Details</CardTitle>
                <CardDescription>Fill in the details to generate a question paper.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="grade" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl><Input placeholder="e.g., 10th" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl><Input placeholder="e.g., Physics" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="topic" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl><Input placeholder="e.g., Laws of Motion" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="questionType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                            <SelectItem value="Short Answer">Short Answer</SelectItem>
                            <SelectItem value="Essay">Essay</SelectItem>
                            <SelectItem value="Fill in the Blanks">Fill in the Blanks</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="difficultyLevel" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a difficulty" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate Paper
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Generated Question Paper</CardTitle>
                <CardDescription>Review the generated paper below.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {!isLoading && !questionPaperOutput && (
                  <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
                    <p className="text-muted-foreground">Your question paper will appear here.</p>
                  </div>
                )}
                {questionPaperOutput && (
                  <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border bg-muted/20 p-4">
                    <pre className="whitespace-pre-wrap text-sm font-sans">{questionPaperOutput.questionPaper}</pre>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
