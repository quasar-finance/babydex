const productionContracts = {
  coinRegistry: "bbn1wy30zzknshqkzd9lmvrrhrxxq49t5qdsk69sw9nasxrkl52yvh2sm2mvzq",
  factory: "bbn1tmtqm5c8cv05nwgml0gnzwrugwwscs42qf2u9yl3lwuvnx95ctesgljvq7",
  incentives: "bbn1j27qdcfxpuccyp92exm8e0zqs220k3x9d4cdfjhwk57qs8lcx8esakd8m2",
  router: "bbn1p7fncg0xajvcssh4zzeejmmf2h573259qzqzyn44ylpxwru25laqwan6zr",
};

const testnetContracts = {
  coinRegistry: "bbn1wy30zzknshqkzd9lmvrrhrxxq49t5qdsk69sw9nasxrkl52yvh2sm2mvzq",
  factory: "bbn1tmtqm5c8cv05nwgml0gnzwrugwwscs42qf2u9yl3lwuvnx95ctesgljvq7",
  incentives: "bbn1j27qdcfxpuccyp92exm8e0zqs220k3x9d4cdfjhwk57qs8lcx8esakd8m2",
  router: "bbn1p7fncg0xajvcssh4zzeejmmf2h573259qzqzyn44ylpxwru25laqwan6zr",
};

export const contracts =
  process.env.NODE_ENV === "production" ? productionContracts : testnetContracts;
