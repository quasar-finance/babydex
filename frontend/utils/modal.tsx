import { ModalAddLiquidity } from "~/app/components/molecules/modals/ModalAddLiquidity";
import ModalConnectWallet from "~/app/components/molecules/modals/ModalConnectWallet";
import ModalDepositCL from "~/app/components/molecules/modals/ModalDepositCL";
import ModalDepositCompleted from "~/app/components/molecules/modals/ModalDepositComplete";
import ModalRemoveLiquidity from "~/app/components/molecules/modals/ModalRemoveLiquidity";
import ModalSelectAsset from "~/app/components/molecules/modals/ModalSelectAsset";
import { ModalStakeLiquidity } from "~/app/components/molecules/modals/ModalStakeLiquidity";
import ModalSwapSettings from "~/app/components/molecules/modals/ModalSwapSettings";
import { ModalTypes } from "~/types/modal";

export const modals = {
  [ModalTypes.connect_wallet]: ModalConnectWallet,
  [ModalTypes.swap_settings]: ModalSwapSettings,
  [ModalTypes.select_asset]: ModalSelectAsset,
  [ModalTypes.add_liquidity]: ModalAddLiquidity,
  [ModalTypes.deposit_cl]: ModalDepositCL,
  [ModalTypes.deposit_completed]: ModalDepositCompleted,
  [ModalTypes.remove_liquidity]: ModalRemoveLiquidity,
  [ModalTypes.stake_liquidity]: ModalStakeLiquidity,
  [ModalTypes.unstake_liquidity]: ModalStakeLiquidity,
};
