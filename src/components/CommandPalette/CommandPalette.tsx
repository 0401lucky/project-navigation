import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface CommandItem {
  id: string;
  title: string;
  run: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.title.toLowerCase().includes(q));
  }, [commands, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="absolute left-1/2 top-24 -translate-x-1/2 w-[92%] sm:w-[640px] card rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索命令..."
                className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto bg-white dark:bg-gray-900">
              {list.map((item) => (
                <li key={item.id}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 flex items-center justify-between"
                    onClick={() => {
                      onClose();
                      setTimeout(item.run, 0);
                    }}
                  >
                    <span className="text-gray-900 dark:text-white">{item.title}</span>
                    {item.shortcut && (
                      <span className="text-xs text-gray-500">{item.shortcut}</span>
                    )}
                  </button>
                </li>
              ))}
              {list.length === 0 && (
                <li className="px-4 py-6 text-sm text-gray-500">没有匹配的命令</li>
              )}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

