import BasicModal from "~/app/components/templates/BasicModal";
import { Button } from "../../atoms/Button";
import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";

interface ModalTransactionDetailsProps {
  transaction: any; // Replace with proper type
}

export const ModalTransactionDetails: React.FC<ModalTransactionDetailsProps> = ({ transaction }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(transaction, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BasicModal title="Transaction Details">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <pre className="bg-tw-bg p-4 rounded-lg overflow-auto max-h-[60vh] text-sm">
            {JSON.stringify(transaction, null, 2)}
          </pre>
          <Button
            className="absolute top-2 right-2"
            variant="ghost"
            size="sm"
            onPress={handleCopy}
          >
            <IconCopy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </BasicModal>
  );
}; 