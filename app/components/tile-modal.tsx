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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white border border-black">
        <DialogHeader className="border-b border-black pb-4">
          <DialogTitle className="text-2xl font-normal uppercase tracking-widest">
            {categoryName}
          </DialogTitle>
          <DialogDescription className="font-light text-sm">
            Added on {new Date(item.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <RenderContent item={item} categoryName={categoryName} />
        </div>
        {item.source && (
          <div className="mt-6 border-t border-black pt-4">
            <h4 className="text-sm font-normal uppercase tracking-wider mb-1">
              Source:
            </h4>
            <span className="text-black hover:underline flex items-center font-light">
              {item.source}
            </span>
          </div>
        )}
        <div className="mt-8 flex justify-end space-x-4">
          {session?.user && (
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white transition-colors uppercase tracking-wider"
            >
              Delete
            </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-black text-white hover:bg-white hover:text-black border border-black transition-colors uppercase tracking-wider"
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
        <Image
          src={item.content}
          alt="Inspiration"
          className="w-full h-auto rounded-none max-h-[90vh] object-contain"
          width={100}
          height={100}
          unoptimized
        />
      );
    case 'quote':
      return (
        <blockquote className="text-xl font-light italic border-l-2 border-black pl-4 py-2">
          &quot;{item.content}&quot;
        </blockquote>
      );
    case 'video':
      return (
        <div className="aspect-video">
          <MediaPlayer src={item.content} crossOrigin="">
            <MediaProvider />
            <PlyrLayout
              icons={plyrLayoutIcons}
              style={{
                '--plyr-color-main': 'hsl(var(--primary))',
                '--plyr-video-control-color': 'hsl(var(--secondary))',
                '--plyr-video-control-color-hover': 'hsl(var(--secondary))',
                '--plyr-video-control-background-hover':
                  'hsl(var(--secondary-background))',
                '--plyr-audio-control-color': 'hsl(var(--primary))',
                '--plyr-audio-control-color-hover': 'hsl(var(--primary))',
                '--plyr-audio-control-background-hover':
                  'hsl(var(--secondary))',
                '--plyr-menu-background': 'hsl(var(--primary))',
                '--plyr-menu-color': 'hsl(var(--primary))',
              }}
            />
          </MediaPlayer>
        </div>
      );
    default:
      return <p className="font-light">Unsupported content type</p>;
  }
};
