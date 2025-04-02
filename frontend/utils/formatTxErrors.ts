export class TxError extends Error {
  constructor(msg: string) {
    super(msg);
    console.debug(msg);
  }

  pretty() {
    const parsedMsg = this.parser();

    const [msg] = parsedMsg;

    // Support new cases
    if (msg.includes("contract: ")) return this.formatContractErr(msg);
    if (msg.includes("0: ")) return this.formatExecuteMessage(msg);
    return parsedMsg[0];
  }
  parser() {
    const match = this.re.exec(this.message);

    if (this.message.includes("Unknown desc =")) {
      return this.message.split("Unknown desc =")[1]?.split("[CosmWasm");
    }
    if (this.message.includes("Request rejected")) {
      return this.message.split("Error: ")[1];
    }

    if (match != null) {
      return match[1];
    }

    return "Something went wrong.";
  }

  private formatContractErr(msg: string): string {
    this.cause = "contract";
    return msg.split("contract: ")[1];
  }
  private formatExecuteMessage(msg: string): string {
    this.cause = "contract";
    return msg.split("0: ")[1];
  }

  private re = /message index: [0-9]: (.+?):/;
}
