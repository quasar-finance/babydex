import { ModalAddLiquidity } from "~/app/components/molecules/modals/ModalAddLiquidity";
import ModalConnectBridge from "~/app/components/molecules/modals/ModalConnectBridge";
import ModalConnectWallet from "~/app/components/molecules/modals/ModalConnectWallet";
import ModalDepositCL from "~/app/components/molecules/modals/ModalDepositCL";
import ModalDepositCompleted from "~/app/components/molecules/modals/ModalDepositComplete";
import ModalRemoveLiquidity from "~/app/components/molecules/modals/ModalRemoveLiquidity";
import ModalSelectAddress from "~/app/components/molecules/modals/ModalSelectAddress";
import ModalSelectAsset from "~/app/components/molecules/modals/ModalSelectAsset";
import ModalSelectBridgeAsset from "~/app/components/molecules/modals/ModalSelectBridgeAsset";
import { ModalStakeLiquidity } from "~/app/components/molecules/modals/ModalStakeLiquidity";
import ModalSwapSettings from "~/app/components/molecules/modals/ModalSwapSettings";
import { ModalUnstakeLiquidity } from "~/app/components/molecules/modals/ModalUnstakeLiquidity";
import { ModalTypes } from "~/types/modal";

export const modals = {
  [ModalTypes.connect_wallet]: ModalConnectWallet,
  [ModalTypes.connect_bridge]: ModalConnectBridge,
  [ModalTypes.swap_settings]: ModalSwapSettings,
  [ModalTypes.select_asset]: ModalSelectAsset,
  [ModalTypes.select_address]: ModalSelectAddress,
  [ModalTypes.select_bridge_asset]: ModalSelectBridgeAsset,
  [ModalTypes.add_liquidity]: ModalAddLiquidity,
  [ModalTypes.deposit_cl]: ModalDepositCL,
  [ModalTypes.deposit_completed]: ModalDepositCompleted,
  [ModalTypes.remove_liquidity]: ModalRemoveLiquidity,
  [ModalTypes.stake_liquidity]: ModalStakeLiquidity,
  [ModalTypes.unstake_liquidity]: ModalUnstakeLiquidity,
};
