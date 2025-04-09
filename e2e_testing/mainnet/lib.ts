import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {GasPrice} from "@cosmjs/stargate";
import {stringToPath} from "@cosmjs/crypto";

const rpcEndpoint = "https://babylon.nodes.guru:443/rpc";
const mnemonic = "noise upon meadow minute purse utility first verb surprise blood debate dentist refuse spoon load panic demise celery strong nerve again word possible human";
const gasPrice = GasPrice.fromString("0.0025ubbn");
const prefix = "bbn"
// const hdPaths = [stringToPath("m/44'/118'/0'/0/0")]

export const getClientAndAddress = async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix,
        // hdPaths,
    });
    const [account] = await wallet.getAccounts();

    console.log(Buffer.from(account.pubkey).toString('base64'));

    return SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, {
        gasPrice
    }).then((client) => {
        return {client, address: account.address};
    });
}