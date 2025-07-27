'use client';

import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Trash2,
  Flame,
  Minus,
  ChevronsDown,
  Circle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '@/types';
import { PRIORITIES, STATUSES } from '@/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TaskItemProps = {
  task: Task;
  onUpdate: (
    id: string,
    update: Partial<Pick<Task, 'status' | 'priority'>>
  ) => void;
  onDelete: (id: string) => void;
};

const priorityConfig: Record<
  TaskPriority,
  { icon: ReactNode; className: string; badgeVariant: 'destructive' | 'secondary' | 'outline' }
> = {
  High: {
    icon: <Flame className="h-4 w-4" />,
    className: 'text-red-500',
    badgeVariant: 'destructive',
  },
  Medium: {
    icon: <Minus className="h-4 w-4" />,
    className: 'text-yellow-500',
    badgeVariant: 'secondary',
  },
  Low: {
    icon: <ChevronsDown className="h-4 w-4" />,
    className: 'text-blue-500',
    badgeVariant: 'outline',
  },
};

const statusConfig: Record<TaskPriority, { icon: ReactNode; className: string }> = {
  High: {
    icon: <Flame className="h-4 w-4" />,
    className: 'text-red-500',
  },
  Medium: {
    icon: <Minus className="h-4 w-4" />,
    className: 'text-yellow-500',
  },
  Low: {
    icon: <ChevronsDown className="h-4 w-4" />,
    className: 'text-blue-500',
  },
};

const statusIconConfig: Record<TaskStatus, ReactNode> = {
  'To Do': <Circle className="h-4 w-4 text-muted-foreground" />,
  'In Progress': <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
  Completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const { id, description, priority, status } = task;

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-md',
        status === 'Completed' && 'bg-muted/50'
      )}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex-none">{statusIconConfig[status]}</div>
        <div className="flex-grow">
          <p className={cn('text-sm', status === 'Completed' && 'line-through text-muted-foreground')}>
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-none">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={priorityConfig[priority].badgeVariant} className="hidden sm:inline-flex">
                  <span className={priorityConfig[priority].className}>{priorityConfig[priority].icon}</span>
                  <span className="ml-1">{priority}</span>
                </Badge>
                 <Badge variant={priorityConfig[priority].badgeVariant} className="sm:hidden px-2">
                  <span className={priorityConfig[priority].className}>{priorityConfig[priority].icon}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{priority} Priority</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Select
            value={status}
            onValueChange={(newStatus: TaskStatus) =>
              onUpdate(id, { status: newStatus })
            }
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  <div className="flex items-center gap-2">
                    {statusIconConfig[s]}
                    <span>{s}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={priority}
            onValueChange={(newPriority: TaskPriority) =>
              onUpdate(id, { priority: newPriority })
            }
          >
            <SelectTrigger className="w-[120px] h-9 hidden md:flex">
              <SelectValue placeholder="Set priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                   <div className={cn("flex items-center gap-2", priorityConfig[p].className)}>
                    {priorityConfig[p].icon}
                    <span>{p}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
