import { Fragment, useRef, useState } from "react";
import { Button } from "../atoms/Button";
import { IconCopy, IconCopyCheck } from "@tabler/icons-react";

const CopyButton: React.FC<
  {
    children?: React.ReactNode;
    textToCopy: string;
  } & React.ComponentProps<typeof Button>
> = ({ children, textToCopy, ...ButtonProps }) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  return (
    <Button
      onPress={async () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        timeoutId.current = setTimeout(() => setIsCopied(false), 5000);
      }}
      {...ButtonProps}
    >
      {children || (
        <span className="text-sm flex items-center gap-1">
          {isCopied ? (
            <Fragment>
              <IconCopyCheck size={16} /> <span>Copied</span>
            </Fragment>
          ) : (
            <Fragment>
              <IconCopy size={16} /> <span>Copy</span>
            </Fragment>
          )}
        </span>
      )}
    </Button>
  );
};

export default CopyButton;
