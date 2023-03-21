import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, beneficiary] = await ethers.getSigners();
    const retirementFundChallengeFactory = await ethers.getContractFactory(
      'RetirementFundChallenge'
    );

    const retirementFundAttackerFactory = await ethers.getContractFactory(
      'RetirementFundAttacker'
    );

    const forceContract = await retirementFundChallengeFactory.deploy(
      beneficiary.address,
      {
        value: ethers.utils.parseEther('1'),
      }
    );

    const forceAttackerContract = await retirementFundAttackerFactory.deploy(
      forceContract.address,
      {
        value: ethers.utils.parseEther('9'),
      }
    );

    return {
      forceContract,
      forceAttackerContract,
      owner,
      beneficiary,
    };
  }

  describe('exploit', async function () {
    let forceContract: Contract,
      forceAttackerContract: Contract,
      owner: SignerWithAddress,
      beneficiary: SignerWithAddress;

    before(async function () {
      ({ forceContract, forceAttackerContract, owner, beneficiary } =
        await loadFixture(setup));
    });

    it('Should Attack and force to have so much ether', async function () {
      await forceContract.connect(beneficiary).collectPenalty();

      expect(await forceContract.isComplete()).to.equal(true);
    });
  });
});
