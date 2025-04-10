const productionContracts = {
  coinRegistry: "bbn1hrpna9v7vs3stzyd4z3xf00676kf78zpe2u5ksvljswn2vnjp3ysx8e0sz",
  factory: "bbn1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrs3tkuvr",
  incentives: "bbn1xr3rq8yvd7qplsw5yx90ftsr2zdhg4e9z60h5duusgxpv72hud3swvshgw",
  router: "bbn1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqczkw9f",
};

const testnetContracts = {
  coinRegistry: "bbn1wy30zzknshqkzd9lmvrrhrxxq49t5qdsk69sw9nasxrkl52yvh2sm2mvzq",
  factory: "bbn1tmtqm5c8cv05nwgml0gnzwrugwwscs42qf2u9yl3lwuvnx95ctesgljvq7",
  incentives: "bbn1j27qdcfxpuccyp92exm8e0zqs220k3x9d4cdfjhwk57qs8lcx8esakd8m2",
  router: "bbn1p7fncg0xajvcssh4zzeejmmf2h573259qzqzyn44ylpxwru25laqwan6zr",
};

export const contracts =
  process.env.NODE_ENV === "production" ? productionContracts : testnetContracts;
