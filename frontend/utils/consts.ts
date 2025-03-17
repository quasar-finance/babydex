export const navLinks: { label: string; to: string; isDisabled?: boolean; isExternal?: boolean }[] =
  [
    {
      label: "Swap",
      to: "/swap",
    },
    {
      label: "Pools",
      to: "/pools",
    },
    {
      label: "Dashboard",
      to: "/dashboard",
    },
    /* {
    label: "Vote",
    to: "/vote",
    isDisabled: true,
  },
  {
    label: "Protocol",
    to: "/protocol",
    isDisabled: true,
  },
  {
    label: "Analytics",
    to: "/analytics",
    isDisabled: true,
  }, */
  ];

export const mockTokens = [
  {
    name: "Bitcoin",
    chainId: 0,
    address: "0x0000000000000000000000000000000000000000",
    decimals: 8,
    logoURI: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    symbol: "BTC",
  },
  {
    name: "Ethereum",
    chainId: 1,
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    symbol: "ETH",
  },
  {
    name: "USD Coin",
    chainId: 1,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 6,
    logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    symbol: "USDC",
  },
  {
    name: "Tether",
    chainId: 1,
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    symbol: "USDT",
  },
  {
    name: "Aave",
    chainId: 1,
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/aave-aave-logo.png",
    symbol: "AAVE",
  },
  {
    name: "Polygon",
    chainId: 137,
    address: "0x0000000000000000000000000000000000001010",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    symbol: "MATIC",
  },
  {
    name: "Chainlink",
    chainId: 1,
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    symbol: "LINK",
  },
  {
    name: "Uniswap",
    chainId: 1,
    address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
    symbol: "UNI",
  },
  {
    name: "Dai",
    chainId: 1,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
    symbol: "DAI",
  },
];

export const mockPools = [
  {
    id: 5,
    name: "AVAX/DAI Pool",
    pairs: [
      {
        symbol: "AVAX",
        name: "Avalanche",
        image:
          "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      },
      {
        symbol: "DAI",
        name: "Dai",
        image: "https://assets.coingecko.com/coins/images/9956/large/dai.png",
      },
    ],
    APR: "5.7%",
    TVL: "$4,900,000",
    Volume24h: "$620,000",
    Fees24h: "$6,200",
  },
  {
    id: 3,
    name: "BNB/USDT Pool",
    pairs: [
      {
        symbol: "BNB",
        name: "Binance Coin",
        image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
      },
      {
        symbol: "USDT",
        name: "Tether",
        image: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
      },
    ],
    APR: "6.1%",
    TVL: "$7,200,000",
    Volume24h: "$850,000",
    Fees24h: "$8,500",
  },
  {
    id: 1,
    name: "ETH/USDC Pool",
    pairs: [
      {
        symbol: "ETH",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
      },
    ],
    APR: "5.2%",
    TVL: "$12,500,000",
    Volume24h: "$1,200,000",
    Fees24h: "$12,000",
  },
  {
    id: 2,
    name: "BTC/ETH Pool",
    pairs: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      },
    ],
    APR: "4.8%",
    TVL: "$9,800,000",
    Volume24h: "$950,000",
    Fees24h: "$9,500",
  },

  {
    id: 4,
    name: "SOL/USDC Pool",
    pairs: [
      {
        symbol: "SOL",
        name: "Solana",
        image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
      },
    ],
    APR: "7.3%",
    TVL: "$5,600,000",
    Volume24h: "$750,000",
    Fees24h: "$7,200",
  },
];
