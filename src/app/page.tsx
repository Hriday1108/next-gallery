'use client';

import { useState, useMemo } from 'react';
import type { Task, TaskPriority, TaskStatus } from '@/types';
import { TaskSuggesterForm } from '@/components/task-suggester-form';
import { ProgressTracker } from '@/components/progress-tracker';
import { Button } from '@/components/ui/button';
import { Download, ListTodo, ThumbsUp } from 'lucide-react';
import { TaskItem } from '@/components/task-item';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTasksSuggested = (suggestedTasks: string[]) => {
    const newTasks: Task[] = suggestedTasks.map((desc) => ({
      id: crypto.randomUUID(),
      description: desc,
      status: 'To Do',
      priority: 'Medium',
    }));
    setTasks((prevTasks) => [...prevTasks, ...newTasks]);
  };

  const handleTaskUpdate = (
    id: string,
    update: Partial<Pick<Task, 'status' | 'priority'>>
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...update } : task))
    );
  };

  const handleTaskDelete = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };
  
  const handleExport = () => {
    if (tasks.length === 0) return;
    const taskText = tasks
      .map(
        (task) =>
          `[${task.priority.padEnd(6)}] ${task.description} (${task.status})`
      )
      .join('\n');

    const blob = new Blob([taskText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'internship_tasks.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sortedTasks = useMemo(() => {
    const priorityOrder: Record<TaskPriority, number> = { High: 0, Medium: 1, Low: 2 };
    return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [tasks]);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Internship Taskinator
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Generate, prioritize, and track your internship tasks with AI.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2">
          <TaskSuggesterForm onTasksSuggested={handleTasksSuggested} />
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-6">
            <ProgressTracker tasks={tasks} />
            <div className="flex justify-end">
              <Button onClick={handleExport} disabled={tasks.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export Tasks
              </Button>
            </div>
            
            <div className="space-y-4">
              {tasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                ))
              ) : (
                <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
                  <ListTodo className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No tasks yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use the form on the left to generate your first set of tasks.
                  </p>
                </div>
              )}
               {tasks.length > 0 && tasks.every(t => t.status === 'Completed') && (
                <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <ThumbsUp className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 text-lg font-medium text-green-700 dark:text-green-300">All Tasks Completed!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Great job! You can generate more tasks or export your completed list.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
