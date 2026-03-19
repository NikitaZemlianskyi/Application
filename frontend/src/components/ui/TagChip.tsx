import { X } from 'lucide-react';

interface TagChipProps {
  name: string;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  tech: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  art: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  business: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  music: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  sports: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  food: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  science: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  health: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  education: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  travel: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
};

const DEFAULT_COLOR = { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

export function getTagColor(name: string): { bg: string; text: string; border: string } {
  return TAG_COLORS[name.toLowerCase()] || DEFAULT_COLOR;
}

/**
 * Generates a HEX color from a tag name using a simple string hash.
 * Used for calendar event coloring.
 */
export function getTagHexColor(name: string): string {
  const predefined: Record<string, string> = {
    tech: '#3b82f6',
    art: '#a855f7',
    business: '#10b981',
    music: '#ec4899',
    sports: '#f97316',
    food: '#f59e0b',
    science: '#06b6d4',
    health: '#22c55e',
    education: '#6366f1',
    travel: '#14b8a6',
  };

  const lower = name.toLowerCase();
  if (predefined[lower]) return predefined[lower];

  // Simple string hash -> hex color
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `#${((hash >> 0) & 0xffffff).toString(16).padStart(6, '0')}`;
  return color;
}

export const TagChip = ({ name, onRemove, size = 'sm' }: TagChipProps) => {
  const colors = getTagColor(name);
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses}`}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:opacity-70 focus:outline-none"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
