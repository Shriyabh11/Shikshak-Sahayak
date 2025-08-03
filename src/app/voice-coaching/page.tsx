'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Pause, Play, Square } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard-layout';

type RecordingState = 'idle' | 'recording' | 'paused' | 'finished';

export default function VoiceCoachingPage() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recordingState === 'recording') {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / 30));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    if (progress >= 100 && recordingState === 'recording') {
      setRecordingState('finished');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recordingState, progress]);

  const handleStart = () => {
    setTime(0);
    setProgress(0);
    setRecordingState('recording');
  };

  const handlePause = () => {
    setRecordingState(recordingState === 'paused' ? 'recording' : 'paused');
  };

  const handleStop = () => {
    setRecordingState('finished');
    setProgress(100);
  };
  
  const handleReset = () => {
    setRecordingState('idle');
    setTime(0);
    setProgress(0);
  };


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderFeedback = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Feedback Summary</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Clarity & Pronunciation</CardTitle></CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-green-600">88%</p>
            <p className="text-sm text-muted-foreground">Good clarity. A few words could be more distinct.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pace & Delivery</CardTitle></CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-yellow-600">75%</p>
            <p className="text-sm text-muted-foreground">Slightly fast pace. Try to pause between sentences.</p>
          </CardContent>
        </Card>
      </div>
       <Button onClick={handleReset}>Try Again</Button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 py-4 md:py-8">
        <div className="space-y-2 px-4 md:px-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Voice Coaching</h1>
          <p className="text-muted-foreground">
            Practice your delivery and get real-time feedback.
          </p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Recording Session</CardTitle>
            <CardDescription>
              {recordingState === 'idle' && 'Click start to begin your session.'}
              {recordingState === 'recording' && 'Recording... Speak clearly into your microphone.'}
              {recordingState === 'paused' && 'Session paused. Click resume to continue.'}
              {recordingState === 'finished' && 'Session complete. Review your feedback below.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 p-10">
            {recordingState !== 'finished' ? (
              <>
                <div
                  className={`relative flex items-center justify-center size-40 rounded-full ${
                    recordingState === 'recording' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-muted'
                  }`}
                >
                  <Mic className={`size-16 text-primary ${recordingState === 'recording' ? 'text-red-500' : ''}`} />
                   {recordingState === 'recording' && <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>}
                </div>
                <div className="w-full space-y-2">
                    <p className="text-center text-2xl font-mono">{formatTime(time)}</p>
                    <Progress value={progress} />
                </div>
                <div className="flex w-full justify-center gap-4">
                  {recordingState === 'idle' && (
                    <Button onClick={handleStart} size="lg">
                      <Play className="mr-2 size-4" /> Start Recording
                    </Button>
                  )}
                  {(recordingState === 'recording' || recordingState === 'paused') && (
                    <>
                      <Button onClick={handlePause} variant="secondary" size="lg">
                        {recordingState === 'paused' ? <Play className="mr-2 size-4" /> : <Pause className="mr-2 size-4" />}
                        {recordingState === 'paused' ? 'Resume' : 'Pause'}
                      </Button>
                      <Button onClick={handleStop} variant="destructive" size="lg">
                        <Square className="mr-2 size-4" /> Stop
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
                renderFeedback()
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
