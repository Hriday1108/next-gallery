'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { getTaskSuggestions } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  internshipDescription: z
    .string()
    .min(50, { message: 'Description must be at least 50 characters.' })
    .max(1000, { message: 'Description must be 1000 characters or less.' }),
  skills: z
    .string()
    .min(3, { message: 'Please enter at least one skill.' })
    .max(200, { message: 'Skills must be 200 characters or less.' }),
});

type TaskSuggesterFormProps = {
  onTasksSuggested: (tasks: string[]) => void;
};

export function TaskSuggesterForm({ onTasksSuggested }: TaskSuggesterFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      internshipDescription: '',
      skills: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await getTaskSuggestions(values);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'AI Generation Error',
          description: result.error,
        });
      } else if (result.tasks) {
        onTasksSuggested(result.tasks);
        toast({
          title: 'Tasks Generated!',
          description: 'Your new tasks have been added to the list.',
          className: 'bg-green-100 dark:bg-green-900',
        });
        form.reset();
      }
    });
  }

  return (
    <Card className="sticky top-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Task Suggester
        </CardTitle>
        <CardDescription>
          Provide your internship details and let AI suggest relevant tasks.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="internshipDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internship Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Work with the marketing team to develop social media campaigns...'"
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Skills</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'JavaScript, React, Figma, Content Writing'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Suggest Tasks'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
