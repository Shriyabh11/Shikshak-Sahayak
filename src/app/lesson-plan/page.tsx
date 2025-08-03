'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Lightbulb, Loader2 } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import {
  GenerateLessonPlanInput,
  GenerateLessonPlanOutput,
  generateLessonPlan,
} from '@/ai/flows/generate-lesson-plan';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard-layout';

const formSchema = z.object({
  topic: z.string().min(2, {
    message: 'Topic must be at least 2 characters.',
  }),
  grade: z.coerce.number().min(1).max(12),
  curriculum: z.string().min(2, {
    message: 'Curriculum must be at least 2 characters.',
  }),
});

export default function LessonPlanPage() {
  const { toast } = useToast();
  const [lessonPlanOutput, setLessonPlanOutput] = useState<GenerateLessonPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      grade: 10,
      curriculum: 'CBSE',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setLessonPlanOutput(null);
    try {
      const input: GenerateLessonPlanInput = values;
      const output = await generateLessonPlan(input);
      setLessonPlanOutput(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating lesson plan',
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
          <h1 className="text-3xl font-bold tracking-tight font-headline">Lesson Plan Generation</h1>
          <p className="text-muted-foreground">
            Generate AI-powered lesson plan suggestions tailored to your needs.
          </p>
        </div>
        <Card className="mx-4 md:mx-8">
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
            <CardDescription>
              Provide the details below to generate lesson plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Photosynthesis" {...field} />
                        </FormControl>
                        <FormDescription>The main topic for the lesson.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} />
                        </FormControl>
                        <FormDescription>The grade level for the students.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="curriculum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Curriculum</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CBSE, ICSE" {...field} />
                        </FormControl>
                        <FormDescription>The curriculum to align with.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Suggestions
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating suggestions...</p>
          </div>
        )}

        {lessonPlanOutput && (
          <div className="space-y-6 px-4 md:px-8">
            <h2 className="text-2xl font-bold tracking-tight font-headline">Generated Suggestions</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lessonPlanOutput.lessonPlanSuggestions.map((plan, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-start gap-2">
                      <Lightbulb className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                      <span className="font-headline">{plan.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{plan.description}</p>
                    <div>
                      <h4 className="font-semibold">Curriculum Relevance:</h4>
                      <p className="text-sm text-muted-foreground">{plan.relevanceToCurriculum}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
