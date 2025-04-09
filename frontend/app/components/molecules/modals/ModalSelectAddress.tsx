import BasicModal from "~/app/components/templates/BasicModal";

import type React from "react";
import Input from "../../atoms/Input";
import { useState } from "react";
import { Button } from "../../atoms/Button";
import { useModal } from "~/app/providers/ModalProvider";

type ModalSelectAddressProps = {
  address: string;
  onChangeAddress: (address: string) => void;
};

const ModalSelectAddress: React.FC<ModalSelectAddressProps> = ({
  address: defaultAddress,
  onChangeAddress,
}) => {
  const { hideModal } = useModal();
  const [address, setDestinationAddress] = useState(defaultAddress);

  const handleChangeAddress = () => {
    onChangeAddress(address);
    hideModal();
  };
  return (
    <BasicModal
      title="Change Destination Address"
      classNames={{ container: "gap-4 flex flex-col" }}
    >
      <Input
        label="Address"
        name="destinationAddress"
        placeholder="0x..."
        value={address}
        onChange={(e) => setDestinationAddress(e.target.value)}
        required
        fullWidth
      />
      <Button onClick={handleChangeAddress}>Change Address</Button>
    </BasicModal>
  );
};

export default ModalSelectAddress;
