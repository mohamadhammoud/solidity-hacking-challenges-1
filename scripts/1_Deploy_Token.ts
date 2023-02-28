import { ethers } from "hardhat";

async function main() {
  const tokenFactory = await ethers.getContractFactory("Token");

  console.log(`Deploying Contracts`);
  console.log(
    `-------------------------------------------------------------------------`
  );

  const deployPolytrade = await tokenFactory.deploy("Polytrade", "PLT");
  const Polytrade = await deployPolytrade.deployed();

  console.log("Polytrade Token address", Polytrade.address);
  console.log();
  console.log(
    `-------------------------------------------------------------------------`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
