export type IncreaseAllowanceMsgParams = {
    sender: string;
    tokenAddress: string;
    spender: string;
    amount: string;
    expires?: { at_height?: number; at_time?: number; never?: {} };
  };
  
  export function buildIncreaseAllowanceMsg({
    sender,
    tokenAddress,
    spender,
    amount,
    expires,
  }: IncreaseAllowanceMsgParams) {
    const msg = {
      increase_allowance: {
        spender,
        amount,
        ...(expires ? { expires } : {}),
      },
    };
  
    const execMsg = {
      address: tokenAddress,
      message: msg,
      funds: [],
    };
  
    return { sender, execMsg };
  }
  