import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const tokenBankAttackerFactory = await ethers.getContractFactory(
      'TokenBankAttacker'
    );

    const tokenBankChallengeChallengeFactory = await ethers.getContractFactory(
      'TokenBankChallenge'
    );

    const tokenBankAttackerContract = await tokenBankAttackerFactory.deploy();

    const tokenBankChallengeContract =
      await tokenBankChallengeChallengeFactory.deploy(
        tokenBankAttackerContract.address
      );

    await tokenBankAttackerContract.setVictim(
      tokenBankChallengeContract.address
    );

    return {
      tokenBankChallengeContract,
      tokenBankAttackerContract,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let tokenBankChallengeContract: Contract,
      tokenBankAttackerContract: Contract,
      attackerWallet: SignerWithAddress;

    before(async function () {
      ({
        tokenBankChallengeContract,
        tokenBankAttackerContract,
        attackerWallet,
      } = await loadFixture(setup));
    });

    it('Should lock guess and settle', async function () {
      await tokenBankAttackerContract.attack();

      expect(await tokenBankChallengeContract.isComplete()).to.equal(true);
    });
  });
});
