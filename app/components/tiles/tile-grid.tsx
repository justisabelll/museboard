'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TileModal } from '@/app/components/tiles/tile-modal';
import { Icon } from '@iconify/react';
import { Inspiration } from '@/server/db/schema';
import Image from 'next/image';
import { FilterButtons } from '@/app/components/filter-button';

interface TileGridProps {
  items: Inspiration[];
  dictionary: Record<number, string>;
}

const getYouTubeVideoThumbnail = (url: string) => {
  const regex = /[?&]v=([^&]+)/;
  const match = url.match(regex);
  const videoId = match ? match[1] : null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export function TileGrid({ items, dictionary }: TileGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = items.filter(
    (item) =>
      selectedCategory === 'all' ||
      dictionary[item.category_id].toLowerCase() ===
        selectedCategory.toLowerCase()
  );

  const categoryDictionary = Object.fromEntries(
    Object.entries(dictionary).map(([key, value]) => [key, value.toLowerCase()])
  );

  return (
    <>
      <FilterButtons
        categoryDictionary={categoryDictionary}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 mb-20">
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <Tile
              key={item.id}
              item={item}
              dictionary={dictionary}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

const Tile = ({
  item,
  dictionary,
  index,
}: {
  item: Inspiration;
  dictionary: Record<number, string>;
  index: number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, rotate: -5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, y: -20, rotate: 5 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      style={{
        zIndex: isModalOpen ? 50 : 1,
      }}
      whileHover={{
        scale: 1.05,
        zIndex: 10,
        transition: { duration: 0.1 },
      }}
    >
      <div
        className="w-full overflow-hidden cursor-pointer aspect-square rounded-xl border border-border bg-background shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setIsModalOpen(true)}
      >
        <TileContent item={item} dictionary={dictionary} />
      </div>
      <TileModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dictionary={dictionary}
      />
    </motion.div>
  );
};

const TileContent = ({
  item,
  dictionary,
}: {
  item: Inspiration;
  dictionary: Record<number, string>;
}) => {
  const categoryName = dictionary[item.category_id];

  switch (categoryName) {
    case 'image':
      return (
        <div className="relative w-full h-full">
          <Image
            src={item.content}
            width={300}
            height={300}
            alt="Inspiration"
            className="object-cover w-full h-full transition-all duration-200"
          />
        </div>
      );
    case 'quote':
      return (
        <div className="flex flex-col justify-center items-center p-2 sm:p-4 h-full text-center">
          <p className="text-xs sm:text-sm font-light text-foreground uppercase tracking-widest line-clamp-4 italic">
            &quot;{item.content}&quot;
          </p>
        </div>
      );
    case 'video':
      return (
        <div className="relative w-full h-full group">
          <Image
            src={getYouTubeVideoThumbnail(item.content)}
            alt="Video Thumbnail"
            className="object-cover scale-150 blur-sm  w-full h-full transition-all duration-200"
            width={300}
            height={300}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <Icon
              icon="mdi:play-circle-outline"
              className="w-8 h-8 sm:w-12 sm:h-12 text-white/90 group-hover:scale-110 transition-transform"
            />
          </div>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full bg-muted">
          <p className="text-sm text-muted-foreground">Unknown content type</p>
        </div>
      );
  }
};
