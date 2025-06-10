"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";

const ReferralCode: React.FC = () => {
  const searchParams = useSearchParams();

  const referralCode = searchParams.get("referralCode");

  const { showModal } = useModal();

  useEffect(() => {
    if (referralCode) {
      showModal(ModalTypes.referral_code, true, { referralCode });
    }
  }, [referralCode, showModal]);

  return <></>;
};

export default ReferralCode;
