import { Suspense } from "react";
import ReferralCode from "~/app/components/organisms/points/ReferralCode";
import Points from "~/app/components/pages/Points";

export default function PointsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Suspense>
        <ReferralCode />
      </Suspense>
      <Points />
    </div>
  );
}
