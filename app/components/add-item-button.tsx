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
import { UploadButton } from '@/lib/uploadthing';
import { FileInfo } from '../api/uploadthing/core';
import { deleteImage } from '@/server/actions/delete-image';

const formSchema = z.object({
  content: z.string().min(1, 'Content is required').or(z.literal('')),
  source: z.string().optional(),
  category_id: z.number(),
  image_key: z.string().optional(),
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
      image_key: '',
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (selectedCategory?.toLowerCase() === 'image') {
        if (!fileInfo?.url) {
          toast.error('Please upload an image first');
          return;
        }
        values.content = fileInfo.url;
        values.image_key = fileInfo.key;
      } else if (!values.content) {
        toast.error('Content is required');
        return;
      }

      await addItem(values);
      toast.success('Inspiration added');
      setOpen(false);
      form.reset();
      setFileInfo(null);
    } catch (error) {
      toast.error('Failed to add');
      console.error('Error adding inspiration:', error);
    }
  }

  const handleCancel = async () => {
    if (fileInfo?.key) {
      try {
        await deleteImage(fileInfo.key);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setOpen(false);
    form.reset();
  };

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
                onValueChange={(value) => {
                  field.onChange(Number(value));
                  setSelectedCategory(categoryDictionary[Number(value)]);
                }}
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
        {selectedCategory?.toLowerCase() === 'image' ? (
          <UploadButton
            appearance={{
              button:
                'group relative flex h-10 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-[calc(var(--radius)-2px)] border border-primary bg-primary/80 text-primary-foreground/80 transition-colors hover:bg-primary/90 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
            }}
            endpoint="imageUploader"
            onBeforeUploadBegin={async (files) => {
              try {
                const formData = new FormData();
                formData.append('file', files[0]);
                const response = await fetch('/api/optimize-image', {
                  method: 'POST',
                  body: formData,
                });

                if (!response.ok) {
                  throw new Error('Failed to optimize image');
                }

                const data = await response.json();

                const base64Response = await fetch(data.optimizedImage);
                const blob = await base64Response.blob();

                return [
                  new File([blob], data.filename, {
                    type: 'image/webp',
                  }),
                ];
              } catch (error) {
                console.error('Error optimizing image:', error);
                throw error;
              }
            }}
            onUploadError={(error) => {
              console.error('Error uploading image:', error);
              toast.error('Failed to upload image');
              setIsUploading(false);
            }}
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                toast.success('Image uploaded successfully');
                setFileInfo({
                  url: res[0].url,
                  filename: res[0].name,
                  key: res[0].key,
                });
                setIsUploading(false);
              }
            }}
            onUploadBegin={() => {
              setIsUploading(true);
            }}
          />
        ) : (
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
                  {selectedCategory?.toLowerCase() === 'image'
                    ? 'Upload an image.'
                    : 'Add text, image URL, or YouTube link.'}
                </FormDescription>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />
        )}
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
            onClick={handleCancel}
            disabled={isUploading}
            className="text-xs uppercase tracking-widest border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
            className="text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 border border-primary transition-colors"
          >
            {isUploading ? 'Uploading image...' : 'Add'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
