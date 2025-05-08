import Pool from "~/app/components/pages/Pool";

export default async function PoolPage({
  params,
}: {
  params: Promise<{ poolAddress: string }>
}) {
  const { poolAddress } = await params;

  return (
    <div className="flex flex-col gap-8">
      <Pool address={poolAddress} />
    </div>
  );
};
