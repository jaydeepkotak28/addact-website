import { motion, AnimatePresence } from "framer-motion";
import RichText from "@/components/atoms/RichText";

export const AddactDropdownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="#3C4CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AddactRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export interface AccordionItem {
  title: string;
  description: string;
  image?: any;
}

interface AccordionListProps {
  items: AccordionItem[];
  activeIndex: number;
  onItemClick: (index: number) => void;
}


function AccordionRow({
  item,
  index,
  isActive,
  isLast,
  onClick,
}: {
  item: AccordionItem;
  index: number;
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className={`border-t border-black/8 ${isLast ? "border-b" : ""} cursor-pointer overflow-hidden`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.38, delay: index * 0.07 }}
      onClick={onClick}
    >
      <div className={`flex items-center gap-5 py-5 px-6 select-none ${isActive ? "pb-0" : ""}`}>
        <motion.div transition={{ duration: 0.3 }}>
          {isActive ? <AddactDropdownIcon /> : <AddactRightIcon />}
        </motion.div>

        <motion.span
          className="justify-start text-stone-950 text-xl lg:text-2xl xl:text-3xl font-medium font-['Montserrat'] leading-[48px]"
          animate={{ color: isActive ? "#0F0F0F" : "#0F0F0F" }}
          transition={{ duration: 0.3 }}
        >
          {item?.title}
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {isActive && item?.description && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              className="w-full 2xl:w-[723px] justify-start text-stone-950 text-xl font-normal font-['Montserrat'] leading-8 px-6 pl-[76px] pb-6"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.28, delay: 0.08 }}
            >
              <RichText html={item.description} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AccordionList({ items, activeIndex, onItemClick }: AccordionListProps) {
  return (
    <div>
      {items.map((item, index) => (
        <AccordionRow
          key={index}
          item={item}
          index={index}
          isActive={activeIndex === index}
          isLast={index === items.length - 1}
          onClick={() => onItemClick(index)}
        />
      ))}
    </div>
  );
}
