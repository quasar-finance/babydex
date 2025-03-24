import React from "react";
import { createContext, type PropsWithChildren, useContext, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { twMerge } from "~/utils/twMerge";

interface TabsProps {
  defaultKey?: string;
  selectedKey?: string;
  onSelectionChange?: (index: string) => void;
  color?: "default" | "orange";
}

interface TabContextType {
  activeKey: string;
  setKey: (index: string) => void;
  color: "default" | "orange";
}

interface TabProps {
  tabKey: string;
  disabled?: boolean;
  className?: string;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const Tabs: React.FC<PropsWithChildren<TabsProps>> = ({
  color = "default",
  children,
  defaultKey = "",
  onSelectionChange,
}) => {
  const tabsArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const firstTabKey = tabsArray.length > 0 ? tabsArray[0].props.tabKey : "";

  const [activeKey, setActiveKey] = useState(defaultKey || firstTabKey);

  const setKey = (index: string) => {
    setActiveKey(index);
    onSelectionChange ? onSelectionChange(index) : null;
  };

  return (
    <TabContext.Provider value={{ activeKey, setKey, color }}>
      <div className="relative flex flex-col w-full gap-2">{children}</div>
    </TabContext.Provider>
  );
};

export const TabList: React.FC<PropsWithChildren> = ({ children }) => {
  const context = useContext(TabContext);
  if (!context) throw new Error("TabList must be used within a Tabs");

  return <div className="relative flex items-center gap-1 w-fit rounded-full">{children}</div>;
};

export const Tab: React.FC<PropsWithChildren<TabProps>> = ({
  tabKey,
  children,
  disabled,
  className,
}) => {
  const context = useContext(TabContext);
  if (!context) throw new Error("Tab must be used within a Tabs");

  const isActive = context.activeKey === tabKey;

  const colorVariants = {
    default: " text-white",
    orange: " text-tw-orange-400",
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && context.setKey(tabKey)}
      className={twMerge(
        "relative px-[14px] py-[10px] rounded-full text-sm flex items-center gap-2 transition-all z-10",
        isActive ? colorVariants[context.color] : "text-white",
        disabled ? "opacity-30 cursor-not-allowed" : "hover:text-white/50",
        className,
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          layoutDependency={false}
          className={"absolute inset-0 rounded-full bg-white/10 w-full h-full"}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
    </button>
  );
};

export const TabContent: React.FC<PropsWithChildren<{ tabKey: string }>> = ({
  tabKey,
  children,
}) => {
  const context = useContext(TabContext);
  if (!context) throw new Error("TabPanel must be used within a Tabs");

  return (
    <AnimatePresence mode="popLayout">
      {context.activeKey === tabKey && (
        <motion.div
          layout
          key={context.activeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
