import { useState } from 'react';
import { TagChip } from './TagChip';

interface TagMultiSelectProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  label?: string;
  helperText?: string;
}

export const TagMultiSelect = ({
  tags,
  onChange,
  maxTags = 5,
  label,
  helperText,
}: TagMultiSelectProps) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (value: string) => {
    const newTag = value.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
      onChange([...tags, newTag]);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 min-h-[42px]">
        {tags.map((tag, index) => (
          <TagChip
            key={index}
            name={tag}
            onRemove={() => removeTag(index)}
            size="md"
          />
        ))}
        {tags.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? 'Type a tag and press Enter...' : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm py-1"
          />
        )}
      </div>
      <div className="mt-1 flex justify-between">
        {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
        <p className="text-xs text-gray-400 ml-auto">
          {tags.length}/{maxTags} tags
        </p>
      </div>
    </div>
  );
};
