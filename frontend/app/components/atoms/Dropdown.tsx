import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useState } from "react";
import { twMerge } from "~/utils/twMerge";
import { IconCheck, IconChevronDown, IconCircleCheck } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

type Label = string | React.ReactNode;
type Item = { value: string; label: Label };

interface Props {
  label?: Label;
  onChange?: (e: Item) => void;
  defaultValue: Item;
  options: Item[];
  checkMark?: boolean;
  classNames?: {
    container?: string;
    item?: string;
    dropdown?: string;
  };
}

const Dropdown: React.FC<Props> = ({
  label,
  classNames,
  defaultValue,
  onChange,
  options,
  checkMark = true,
}) => {
  const [state, setState] = useState<Item>(defaultValue);
  const _onChange = (e: Item) => {
    onChange?.(e);
    setState(e);
  };
  return (
    <Menu>
      {({ open }) => (
        <div className="relative">
          <MenuButton
            className={twMerge(
              "z-10 group subpixel-antialiased flex items-center gap-2 p-2 pr-3 bg-white/5 rounded-full w-fit transition-all",
              open ? "scale-[0.97] opacity-70" : "",
              classNames?.container,
            )}
          >
            {state.label}
            <IconChevronDown
              className={twMerge(
                "h-5 w-5 transition-transform duration-300",
                open ? "rotate-180" : "rotate-0",
              )}
            />
          </MenuButton>
          <AnimatePresence>
            {open && (
              <MenuItems
                static
                as={motion.div}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={twMerge(
                  "bg-tw-bg/70 backdrop-blur-lg border border-white/10 p-1 absolute left-0 mt-2 w-48 rounded-lg shadow-lg z-50 min-w-fit",
                  classNames?.dropdown,
                )}
              >
                {options.map((option) => (
                  <MenuItem key={option.value}>
                    <button
                      type="button"
                      className={twMerge(
                        "relative transition-all p-2 rounded-full w-full text-left hover:bg-tw-orange-400/20 flex items-center gap-2 whitespace-nowrap",
                        classNames?.item,
                      )}
                      onClick={() => _onChange(option)}
                    >
                      {option.label}
                      {checkMark && state.value === option.value && (
                        <IconCheck className="text-tw-orange-400 min-h-5 min-w-5" />
                      )}
                    </button>
                  </MenuItem>
                ))}
              </MenuItems>
            )}
          </AnimatePresence>
        </div>
      )}
    </Menu>
  );
};

export default Dropdown;
