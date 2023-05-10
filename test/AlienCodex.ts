import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Start Point', async function () {
  let AlienCodex: any;

  let deployer: any;
  let attacker: any;
  let attackerWallet: any;

  beforeEach('Deployments', async function () {
    [deployer, attackerWallet] = await ethers.getSigners();
    const AlienCodexFactory = await ethers.getContractFactory('AlienCodex');

    AlienCodex = await AlienCodexFactory.deploy();
  });

  describe('Hack Alien Codex', async function () {
    it('Should deploy attacker', async function () {
      expect(await AlienCodex.owner()).to.be.equal(deployer.address);

      const AlienCodexAttackerFactory = await ethers.getContractFactory(
        'AlienCodexAttacker',
        attackerWallet
      );

      attacker = await AlienCodexAttackerFactory.deploy(AlienCodex.address);

      expect(await AlienCodex.owner()).to.be.equal(attackerWallet.address);
    });
  });
});
