import ModalConnectWallet from "~/app/components/molecules/modals/ModalConnectWallet";
import ModalDepositCL from "~/app/components/molecules/modals/ModalDepositCL";
import ModalDepositCompleted from "~/app/components/molecules/modals/ModalDepositComplete";
import ModalDepositLP from "~/app/components/molecules/modals/ModalDepositLP";
import ModalSelectAsset from "~/app/components/molecules/modals/ModalSelectAsset";
import ModalSwapSettings from "~/app/components/molecules/modals/ModalSwapSettings";
import { ModalTypes } from "~/types/modal";

export const modals = {
  [ModalTypes.connect_wallet]: ModalConnectWallet,
  [ModalTypes.swap_settings]: ModalSwapSettings,
  [ModalTypes.select_asset]: ModalSelectAsset,
  [ModalTypes.deposit_lp]: ModalDepositLP,
  [ModalTypes.deposit_cl]: ModalDepositCL,
  [ModalTypes.deposit_completed]: ModalDepositCompleted,
};
