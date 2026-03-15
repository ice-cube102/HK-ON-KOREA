import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AccordionMenu: React.FC<{ title: string; items: string[]; openModal: (t: string, c: string) => void }> = ({ title, items, openModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-[#8B0033] text-white font-bold"
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
            className="bg-[#141414] text-white overflow-hidden"
          >
            {items.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => openModal(item, `${item} details.`)}
                className="block w-full text-left p-4 hover:bg-[#202020] transition-colors"
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
