'use client';

import { useState } from 'react';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { aiChatbotAssistant } from '@/ai/flows/ai-chatbot-assistant';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/dashboard-layout';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiChatbotAssistant({ query: input });
      const assistantMessage: Message = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error getting response',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setMessages((prev) => prev.slice(0, -1)); // remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
       <div className="flex-1 space-y-4 py-4 md:py-8">
        <div className="space-y-2 px-4 md:px-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">AI Chatbot Assistant</h1>
          <p className="text-muted-foreground">
            Your personal AI assistant for all teaching-related questions.
          </p>
        </div>
        <Card className="h-[calc(100vh-12rem)] mx-4 md:mx-8">
          <CardContent className="h-full flex flex-col p-0">
            <ScrollArea className="flex-grow p-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-4',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="size-8 border">
                        <AvatarFallback><Bot className="size-4" /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-lg rounded-xl px-4 py-3',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="size-8 border">
                        <AvatarFallback><User className="size-4" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-4 justify-start">
                      <Avatar className="size-8 border">
                        <AvatarFallback><Bot className="size-4" /></AvatarFallback>
                      </Avatar>
                       <div className="max-w-lg rounded-xl px-4 py-3 bg-muted flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                       </div>
                   </div>
                )}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-grow"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="mr-2 size-4" /> Send
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
