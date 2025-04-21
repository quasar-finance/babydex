export const SATLAYER_ASSETS: Record<string, number> = {
    "bbn17y5zvse30629t7r37xsdj73xsqp7qsdr7gpnh966wf5aslpn66rq5ekwsz": 2.0, // uniBTC
    "bbn1j2nchmpuhkq0yj93g84txe33j5lhw2y7p3anhqjhvamqxsev6rmsneu85x": 2.5, //satuniBTC.e
  };


  export const getSatlayerMultiplier = () => {
    // TODO add logic to differentiate between 2x and 2.5x
    return 2.0
  }

  export const satlayerMultiplier = getSatlayerMultiplier();

  export const getSatLayerLogo = () => {
    if (satlayerMultiplier >= 2.5) return "/satlayer/2.5x.svg";
    if (satlayerMultiplier >= 2.0) return "/satlayer/2x.svg";
  };