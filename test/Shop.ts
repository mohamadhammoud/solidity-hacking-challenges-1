import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const ShopFactory = await ethers.getContractFactory('Shop');
    const ShopAttackerFactory = await ethers.getContractFactory('ShopAttacker');

    const shopContract = await ShopFactory.deploy();
    const shopAttackerContract = await ShopAttackerFactory.deploy(
      shopContract.address
    );

    return { shopContract, shopAttackerContract, attackerWallet };
  }

  describe('exploit', async function () {
    let shopContract: any, shopAttackerContract: any, attackerWallet;

    before(async function () {
      ({ shopContract, shopAttackerContract, attackerWallet } =
        await loadFixture(setup));
    });

    it('Should call the goTo method', async function () {
      await shopAttackerContract.attack();

      expect(await shopContract.isSold()).to.equal(true);
      expect(await shopContract.price()).to.equal(50);
    });
  });
});
