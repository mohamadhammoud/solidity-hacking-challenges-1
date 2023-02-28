import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Start Point', async function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();
    const ElevatorFactory = await ethers.getContractFactory('Elevator');
    const ElevatorHackerFactory = await ethers.getContractFactory(
      'ElevatorHacker'
    );

    const elevatorContract = await ElevatorFactory.deploy();
    const elevatorHackerContract = await ElevatorHackerFactory.deploy(
      elevatorContract.address
    );

    return { elevatorContract, elevatorHackerContract, attackerWallet };
  }

  describe('exploit', async function () {
    let elevatorContract: any, elevatorHackerContract: any, attackerWallet;

    before(async function () {
      ({ elevatorContract, elevatorHackerContract, attackerWallet } =
        await loadFixture(setup));
    });

    it('Should call the goTo method', async function () {
      await elevatorHackerContract.goTo(1);

      await expect(elevatorHackerContract.goTo(2)).to.be.revertedWith(
        'Already on top'
      );

      expect(await elevatorContract.top()).to.equal(true);
    });
  });
});
