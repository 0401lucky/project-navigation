interface TagBadgeProps {
  tag: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  return (
    <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
      {tag}
    </span>
  );
};
