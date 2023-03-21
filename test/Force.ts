import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const forceFactory = await ethers.getContractFactory('Force');
    const forceAttackerFactory = await ethers.getContractFactory(
      'ForceAttacker'
    );

    const forceContract = await forceFactory.deploy();

    const forceAttackerContract = await forceAttackerFactory.deploy(
      forceContract.address
    );

    return {
      forceContract,
      forceAttackerContract,
      owner,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let forceContract: Contract,
      forceAttackerContract: Contract,
      owner: SignerWithAddress,
      attackerWallet: SignerWithAddress;

    before(async function () {
      ({ forceContract, forceAttackerContract, owner, attackerWallet } =
        await loadFixture(setup));
    });

    it('Should Attack and force', async function () {
      expect(await ethers.provider.getBalance(forceContract.address)).to.equal(
        0
      );

      await owner.sendTransaction({
        to: forceAttackerContract.address,
        value: ethers.utils.parseEther('1'), // Send 1 ether
      });

      //   await forceAttackerContract.attack();

      expect(await ethers.provider.getBalance(forceContract.address)).to.equal(
        ethers.utils.parseEther('1')
      );
    });
  });
});
