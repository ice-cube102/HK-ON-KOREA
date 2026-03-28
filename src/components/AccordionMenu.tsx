import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AccordionMenu: React.FC<{ title: string; items: string[]; openModal: (t: string, c: string) => void; isOpen: boolean; onToggle: () => void; isDarkMode?: boolean }> = ({ title, items, openModal, isOpen, onToggle, isDarkMode }) => {
  return (
    <div className="w-full">
      <button 
        onClick={onToggle}
        className={`w-full flex justify-between items-center py-2 text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-left`}
      >
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {items.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => openModal(item, `${item} details.`)}
                className={`block w-full text-left py-2 pl-4 text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
