import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const reentranceFactory = await ethers.getContractFactory('Reentrance');
    const reentranceAttackerFactory = await ethers.getContractFactory(
      'ReentranceAttacker'
    );

    const reentranceContract = await reentranceFactory.deploy();

    const reentranceAttackerContract = await reentranceAttackerFactory.deploy(
      reentranceContract.address
    );

    return {
      reentranceContract,
      reentranceAttackerContract,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let reentranceContract: Contract,
      reentranceAttackerContract: Contract,
      attackerWallet: SignerWithAddress;

    before(async function () {
      ({ reentranceContract, reentranceAttackerContract, attackerWallet } =
        await loadFixture(setup));
    });

    it('Should call the attack method', async function () {
      attackerWallet.sendTransaction({
        to: reentranceContract.address,
        value: ethers.utils.parseEther('10'),
      });

      expect(
        await ethers.provider.getBalance(reentranceAttackerContract.address)
      ).to.equal(0);

      await reentranceAttackerContract.attack({
        value: ethers.utils.parseEther('1'),
      });

      expect(
        await ethers.provider.getBalance(reentranceContract.address)
      ).to.equal(0);

      expect(
        await ethers.provider.getBalance(reentranceAttackerContract.address)
      ).to.equal(ethers.utils.parseEther('11'));
    });
  });
});
