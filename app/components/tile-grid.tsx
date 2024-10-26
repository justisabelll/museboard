'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TileModal } from '@/app/components/tile-modal';
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-20">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <Tile key={item.id} item={item} dictionary={dictionary} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

const Tile = ({
  item,
  dictionary,
}: {
  item: Inspiration;
  dictionary: Record<number, string>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="w-full h-full overflow-hidden bg-white cursor-pointer aspect-square"
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
          // removed this after uploadingthing
          unoptimized
          className="object-cover w-full h-full transition-all duration-300 filter hover:filter-none"
        />
      );
    case 'quote':
      return (
        <div className="flex flex-col justify-center items-center p-4 h-full text-center bg-white">
          <p className="text-sm font-light text-black uppercase tracking-widest line-clamp-4">
            {item.content}
          </p>
        </div>
      );
    case 'video':
      return (
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={getYouTubeVideoThumbnail(item.content)}
            alt="Video Thumbnail"
            className="object-cover w-full h-full transition-all duration-300 filter hover:filter-none"
            width={300}
            height={300}
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Icon
              icon="mdi:play-circle-outline"
              className="w-16 h-16 text-white"
            />
          </div>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-sm text-gray-500">Unknown content type</p>
        </div>
      );
  }
};
