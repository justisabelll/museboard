'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Icon } from '@iconify/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { addItem } from '@/server/actions/add-item';
import { toast } from 'sonner';

const formSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  source: z.string().optional(),
  category_id: z.number(),
});

interface AddItemButtonProps {
  categoryDictionary: Record<number, string>;
}

export default function AddItemButton({
  categoryDictionary,
}: AddItemButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="bg-background text-foreground border-border"
        >
          <Icon icon="mdi:plus" className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Inspiration</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new piece of inspiration to your board.
          </DialogDescription>
        </DialogHeader>
        <AddItemForm
          setOpen={setOpen}
          categoryDictionary={categoryDictionary}
        />
      </DialogContent>
    </Dialog>
  );
}

interface AddItemFormProps extends AddItemButtonProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddItemForm = ({ setOpen, categoryDictionary }: AddItemFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      source: '',
      category_id: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addItem(values);
      toast.success('Inspiration added');
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to add');
      console.error('Error adding inspiration:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-widest">
                Category
              </FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="border-b border-input rounded-none focus:ring-0">
                    <SelectValue placeholder="SELECT CATEGORY" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border border-input rounded-none">
                  {Object.entries(categoryDictionary).map(([id, name]) => (
                    <SelectItem
                      key={id}
                      value={id}
                      className="text-sm uppercase"
                    >
                      {name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-xs italic mt-1">
                Choose the type of inspiration.
              </FormDescription>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-widest">
                Content
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter inspiration"
                  className="border-b border-input rounded-none focus:ring-0"
                />
              </FormControl>
              <FormDescription className="text-xs italic mt-1">
                Add text, image URL, or YouTube link.
              </FormDescription>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-widest">
                Source
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Add source (optional)"
                  className="border-b border-input rounded-none focus:ring-0"
                />
              </FormControl>
              <FormDescription className="text-xs italic mt-1">
                Credit the inspiration source.
              </FormDescription>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4 pt-8">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="text-xs uppercase tracking-widest border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 border border-primary transition-colors"
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
