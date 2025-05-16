import { bpsToFloat } from "~/utils/intl";
import { Button } from "../atoms/Button";
import { inviteBoostBps, pointsShareBps } from "~/utils/consts";
import { Overview } from "../organisms/points/Overview";
import { Leaderboard } from "../organisms/points/Leaderboard";
import Pill from "../atoms/Pill";

const Points: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 px-4 pb-20 max-w-[84.5rem] mx-auto w-full min-h-[65vh] lg:pt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">My Points</h1>
        <Button color="tertiary" className="lg:hidden">
          Learn How it Works
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[65%] p-4 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={"/tower/points.png"} alt="Tower Points" className="w-auto h-[24px]" />
              <h2 className="text-lg">BabyDex Points</h2>
            </div>
            <Button color="tertiary" className="hidden lg:inline-flex">
              Learn How it Works
            </Button>
          </div>
          <div className="mt-4 lg:mt-8">
            <Overview />
          </div>
        </div>

        <div className="w-full lg:w-[35%] p-4 border bg-origin-border border-white/10 rounded-2xl bg-gradient-to-r from-transparent via-transparent via-30% to-tw-orange-500/85">
          <h2 className="text-lg font-bold mb-2">
            Get {bpsToFloat(pointsShareBps, 2, 0)}% of frens points
          </h2>
          <p className="text-sm text-white/70 mb-4">
            Invite friends and earn 20% of what they earn. They also get a{" "}
            {bpsToFloat(inviteBoostBps, 2, 0)}%% boost on their points.
          </p>
          <Button size="sm">Create referral link</Button>
        </div>
      </div>
      <div className="flex flex-col my-4 gap-4 lg:px-4">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <h1 className="text-2xl">BabyDex Points Leaderboard</h1>
          <div
            className="flex items-center gap-2 text-yellow-500"
            style={{ textShadow: "rgba(238, 173, 33, 0.8) 0 0 20px" }}
          >
            <Pill color="yellow" className="border border-yellow-500 text-md">
              #57
            </Pill>
            <span>On the leaderboard</span>
          </div>
        </div>
        <p className="text-white/70">
          Earn BabyDex points through Referrals, Providing Liquidity and Swapping on Tower
        </p>
      </div>
      <div>
        <Leaderboard />
      </div>
    </div>
  );
};

export default Points;
