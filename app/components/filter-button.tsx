'use client';

interface FilterButtonsProps {
  categoryDictionary: Record<string, string>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function FilterButtons({
  categoryDictionary,
  selectedCategory,
  setSelectedCategory,
}: FilterButtonsProps) {
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex justify-center mb-16 space-x-12">
      <button
        key="all"
        onClick={() => handleCategoryClick('all')}
        className={`p-3 transition-all duration-300 text-sm uppercase tracking-wider ${
          selectedCategory === 'all'
            ? 'text-foreground border-b border-foreground dark:text-foreground dark:border-foreground'
            : 'text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground'
        }`}
      >
        <span>All</span>
      </button>
      {Object.values(categoryDictionary).map((value) => (
        <button
          key={value}
          onClick={() => handleCategoryClick(value)}
          className={`p-3 transition-all duration-300 text-sm uppercase tracking-wider ${
            selectedCategory === value
              ? 'text-foreground border-b border-foreground dark:text-foreground dark:border-foreground'
              : 'text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground'
          }`}
        >
          {/* Icon components would go here */}
          <span>{value === 'youtube' ? 'Videos' : `${value}s`}</span>
        </button>
      ))}
    </div>
  );
}
