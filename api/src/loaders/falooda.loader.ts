import pkg from '@quasar-labs/fallback-falooda';

const { Fallback } = pkg;

const { ALL_NODES_ACCESS } = process.env;

export const falooda = new Fallback.Falooda({
  intervalInSecs: 60,
  urls: {
    cosmos: {
      'quasar-1': {
        lcdNodes: ['https://quasar-api.polkachu.com', 'https://node4.main-api.qsr.network', 'https://rest.cosmos.directory/quasar']
      },
      'osmosis-1': {
        lcdNodes: [`https://${ALL_NODES_ACCESS}@osmo37601.allnodes.me:1317`]
      },
      'osmo-test-5': {
        lcdNodes: ['https://lcd.testnet.osmosis.zone']
      }
    }
  }
});
