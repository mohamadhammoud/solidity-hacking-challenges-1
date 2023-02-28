import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Start Point', async function () {
  let coinFlip: any;
  let attacker: any;

  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach('Deployments', async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const coinFlipFactory = await ethers.getContractFactory('CoinFlip');
    const AttackerFactory = await ethers.getContractFactory('CoinFlipAttacker');

    coinFlip = await coinFlipFactory.deploy();
    attacker = await AttackerFactory.deploy(coinFlip.address);
  });

  describe('Hack CoinFlip', async function () {
    it('Should call the flip method', async function () {
      while (Number(await coinFlip.consecutiveWins()) < 10) {
        const x = Number(await coinFlip.consecutiveWins());
        console.log(x);
        await attacker.connect(user1).flip(true);
      }

      expect(await coinFlip.consecutiveWins()).to.equal(10);
    });
  });
});
