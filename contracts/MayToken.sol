// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MecToken {
    //ERC20 optionals
    string public name = "Mec Token";
    string public symbol = "mTok";

    // Extras
    string public standard = "Mec Token v1.0";

    //ERC20 required
    uint256 public totalSupply;
    
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );




    mapping( address => uint256 ) public balanceOf;
    mapping( address => mapping(address => uint256) ) public allowance;
      // spender address =>   all the addresses they are allowed to spend and how much


    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // this would let the address that calls the function to approve 'spender' to spend '_value' tokens on their behalf
    function approve(address _spender, uint256 _value) public returns(bool success) {
        //allowance

        emit Approval(msg.sender, _spender, _value);
        return true;
    }


}







