import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

type ProgressTrackerProps = {
  tasks: Task[];
};

export function ProgressTracker({ tasks }: ProgressTrackerProps) {
  const completedTasks = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Your Progress</CardTitle>
        <CheckCircle className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium whitespace-nowrap">
              <span className="text-xl font-bold text-primary">{completedTasks}</span>
              <span className="text-muted-foreground">/{totalTasks} tasks</span>
            </p>
            <div className="w-full">
                <Progress value={progressPercentage} className="h-3" />
            </div>
             <p className="text-lg font-bold text-primary tabular-nums">
                {Math.round(progressPercentage)}%
            </p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
            {progressPercentage === 100 ? "Amazing work! All tasks done." : "Keep up the great work!"}
        </p>
      </CardContent>
    </Card>
  );
}
