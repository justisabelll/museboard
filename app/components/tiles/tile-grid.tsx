'use client';

import { useState, useEffect } from 'react';
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
  const [columns, setColumns] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setColumns(2);
      else if (window.innerWidth < 768) setColumns(3);
      else if (window.innerWidth < 1024) setColumns(4);
      else setColumns(5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div
        className="grid gap-4 mb-20"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
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
        <Image
          src={item.content}
          width={300}
          height={300}
          alt="Inspiration"
          className="object-cover w-full h-full transition-all duration-200 filter hover:filter-none"
        />
      );
    case 'quote':
      return (
        <div className="flex flex-col justify-center items-center p-4 h-full text-center  ">
          <p className="text-sm font-light text-foreground uppercase tracking-widest line-clamp-4 italic">
            &quot;{item.content}&quot;
          </p>
        </div>
      );
    case 'video':
      return (
        <div className="w-full h-full overflow-hidden group">
          <Image
            src={getYouTubeVideoThumbnail(item.content)}
            alt="Video Thumbnail"
            className="object-cover scale-150 w-full h-full transition-all duration-200 blur-sm group-hover:blur-none"
            width={300}
            height={300}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Icon
              icon="mdi:play-circle-outline"
              className="w-16 h-16 text-white transform scale-75 group-hover:scale-100 transition-transform duration-200"
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
