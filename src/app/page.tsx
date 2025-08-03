'use client';

import Link from "next/link";
import { ArrowRight, BookOpen, Bot, FileText, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";

const features = [
  {
    title: "Lesson Plan Generation",
    description: "AI-powered tool to generate lesson plans based on topic, grade, and curriculum.",
    href: "/lesson-plan",
    icon: <BookOpen className="size-8 text-primary" />,
  },
  {
    title: "Question Paper Generation",
    description: "Generate custom question papers for any grade, subject, and difficulty level.",
    href: "/question-paper",
    icon: <FileText className="size-8 text-primary" />,
  },
  {
    title: "Voice Coaching",
    description: "Improve your pronunciation and delivery with real-time feedback.",
    href: "/voice-coaching",
    icon: <Mic className="size-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome back, Teacher!
          </h1>
          <p className="text-muted-foreground">
            Here are the tools to assist you in your teaching journey.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.href} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="font-headline break-words">{feature.title}</CardTitle>
                    <CardDescription className="break-words">{feature.description}</CardDescription>
                  </div>
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link href={feature.href}>
                    Go to {feature.title.split(" ")[0]}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-4">
           <h2 className="text-2xl font-bold tracking-tight font-headline">Need quick help?</h2>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle className="font-headline">AI Chatbot Assistant</CardTitle>
                        <CardDescription>Get instant help and answers to your teaching-related questions.</CardDescription>
                    </div>
                     <Bot className="size-10 text-primary" />
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/chatbot">
                            Start a conversation
                            <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}