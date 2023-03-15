import { HardhatUserConfig } from 'hardhat/config';
require('dotenv').config();
import '@nomicfoundation/hardhat-toolbox';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';

const { PRIVATE_KEY, PUBLIC_KEY, ALCHEMY_KEY, ETHERSCAN_API_KEY } = process.env;

// const config: HardhatUserConfig = {
const config = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {},
      },
      {
        version: '0.6.0',
        settings: {},
      },
      {
        version: '0.4.21',
        settings: {},
      },
    ],
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/4Wyho29rDaYnNPbEAUR-5GY2ekvRsrAh`,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
  etherscan: { apiKey: `${ETHERSCAN_API_KEY}` },
};

export default config;
