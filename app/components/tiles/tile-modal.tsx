import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Inspiration } from '@/server/db/schema';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { deleteItem } from '@/server/actions/delete-item';
import { toast } from 'sonner';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';

import {
  PlyrLayout,
  plyrLayoutIcons,
} from '@vidstack/react/player/layouts/plyr';

interface TileModalProps {
  item: Inspiration;
  isOpen: boolean;
  onClose: () => void;
  dictionary: Record<number, string>;
}

export function TileModal({
  item,
  isOpen,
  onClose,
  dictionary,
}: TileModalProps) {
  const { data: session } = useSession();
  const categoryName = dictionary[item.category_id];

  const handleDelete = async () => {
    try {
      await deleteItem(item.id);
      toast.success('Inspiration deleted successfully');
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      console.error('Error deleting inspiration:', error);
      toast.error('Failed to delete inspiration');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-background border-border mx-4">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-lg sm:text-2xl font-normal uppercase tracking-widest text-foreground">
            {categoryName}
          </DialogTitle>
          <DialogDescription className="font-light text-xs sm:text-sm text-muted-foreground">
            Added on {new Date(item.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 sm:mt-6 max-w-full">
          <RenderContent item={item} categoryName={categoryName} />
        </div>
        {item.source && (
          <div className="mt-6 border-t border-border pt-4">
            <h4 className="text-sm font-normal uppercase tracking-wider mb-1 text-foreground">
              Source:
            </h4>
            <span className="text-foreground hover:underline flex items-center font-light">
              {item.source}
            </span>
          </div>
        )}
        <div className="mt-8 flex justify-end space-x-4">
          {session?.user && (
            <Button
              onClick={handleDelete}
              variant="outline"
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors uppercase tracking-wider"
            >
              Delete
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground border border-border transition-colors uppercase tracking-wider"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const RenderContent = ({
  item,
  categoryName,
}: {
  item: Inspiration;
  categoryName: string;
}) => {
  switch (categoryName.toLowerCase()) {
    case 'image':
      return (
        <div className="relative w-full flex items-center justify-center">
          <Image
            src={item.content}
            alt="Inspiration"
            className="w-auto h-auto max-w-full max-h-[60vh] object-contain"
            width={800}
            height={800}
            unoptimized
          />
        </div>
      );
    case 'quote':
      return (
        <blockquote className="text-base sm:text-xl font-light italic border-l-2 border-border pl-4 py-2 text-foreground">
          {item.content}
        </blockquote>
      );
    case 'video':
      return (
        <div className="aspect-video w-full">
          <MediaPlayer src={item.content} crossOrigin="">
            <MediaProvider />
            <PlyrLayout
              icons={plyrLayoutIcons}
              style={{
                '--plyr-color-main': 'hsl(var(--primary))',
                '--plyr-video-control-color': 'hsl(var(--foreground))',
                '--plyr-video-control-color-hover': 'hsl(var(--primary))',
                '--plyr-video-control-background-hover': 'hsl(var(--accent))',
                '--plyr-menu-background': 'hsl(var(--background))',
                '--plyr-menu-color': 'hsl(var(--foreground))',
              }}
            />
          </MediaPlayer>
        </div>
      );
    default:
      return (
        <p className="font-light text-foreground">Unsupported content type</p>
      );
  }
};
