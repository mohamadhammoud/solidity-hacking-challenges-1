import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const guessTheNewNumberChallengeFactory = await ethers.getContractFactory(
      'GuessTheNewNumberChallenge'
    );
    const guessTheNewNumberAttackerFactory = await ethers.getContractFactory(
      'GuessTheNewNumberAttacker'
    );

    const guessTheNewNumberChallengeContract =
      await guessTheNewNumberChallengeFactory.deploy({
        value: ethers.utils.parseEther('1'),
      });

    const guessTheNewNumberAttackerContract =
      await guessTheNewNumberAttackerFactory.deploy(
        guessTheNewNumberChallengeContract.address
      );

    return {
      guessTheNewNumberChallengeContract,
      guessTheNewNumberAttackerContract,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let guessTheNewNumberChallengeContract: any,
      guessTheNewNumberAttackerContract: any,
      attackerWallet;

    before(async function () {
      ({
        guessTheNewNumberChallengeContract,
        guessTheNewNumberAttackerContract,
        attackerWallet,
      } = await loadFixture(setup));
    });

    it('Should call the attack method', async function () {
      await guessTheNewNumberAttackerContract.attack({
        value: ethers.utils.parseEther('1'),
      });

      expect(await guessTheNewNumberChallengeContract.isComplete()).to.equal(
        true
      );
    });
  });
});
