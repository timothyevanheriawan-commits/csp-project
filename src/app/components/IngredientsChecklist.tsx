'use client';

import { useState } from 'react';
import { Download, CheckCircle, Circle } from 'lucide-react';

interface IngredientsChecklistProps {
  ingredients: string[];
}

export default function IngredientsChecklist({ ingredients }: IngredientsChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const downloadShoppingList = () => {
    const uncheckedItems = ingredients.filter((_, index) => !checkedItems.has(index));
    const content = `Daftar Belanja:\n\n${uncheckedItems.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daftar-belanja.txt';
    a.click();
  };

  return (
    <div>
      <div className="space-y-3 mb-6">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            onClick={() => toggleItem(index)}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${checkedItems.has(index)
              ? 'bg-green-50 border-l-4 border-green-500'
              : 'hover:bg-gray-50'
              }`}
          >
            {checkedItems.has(index) ? (
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            )}
            <span className={`${checkedItems.has(index)
              ? 'text-gray-500 line-through'
              : 'text-text-light'
              }`}>
              {ingredient}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}