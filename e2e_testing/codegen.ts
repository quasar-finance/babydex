import codegen from '@cosmwasm/ts-codegen';

const SCHEMAS_PATH = "../schemas";

function main() {
    codegen({
        contracts: [
            {name: "astroport-factory", dir: `${SCHEMAS_PATH}/astroport-factory`},
            {name: "astroport-incentives", dir: `${SCHEMAS_PATH}/astroport-incentives`},
            {name: "astroport-native-coin-registry", dir: `${SCHEMAS_PATH}/astroport-native-coin-registry`},
            {name: "astroport-pair", dir: `${SCHEMAS_PATH}/astroport-pair`},
            {name: "astroport-pair-concentrated", dir: `${SCHEMAS_PATH}/astroport-pair-concentrated`},
            {name: "astroport-router", dir: `${SCHEMAS_PATH}/astroport-router`},
        ],
        outPath: "./sdk",
        options: {
            bundle: {
                bundleFile: "index.ts"
            },
            types: {
                enabled: true,
            },
            client: {
                enabled: true,
            },
            messageComposer: {
                enabled: true,
            },
        }
    }).then(() => {
        console.log('✨ all done!');
    });
}

main()