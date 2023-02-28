import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Start Point", async function () {
  let telephone: any;
  let attacker: any;

  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach("Deployments", async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const telephoneFactory = await ethers.getContractFactory("Telephone");
    const attackerFactory = await ethers.getContractFactory("Attacker");

    telephone = await telephoneFactory.deploy();
    attacker = await attackerFactory.deploy(telephone.address);
  });

  describe("Hack Telephone", async function () {
    it("Should call the Attack method", async function () {
      expect(await telephone.owner()).to.equal(owner.address);

      await attacker.connect(user1).attack();

      expect(await telephone.owner()).to.equal(user1.address);
    });
  });
});
