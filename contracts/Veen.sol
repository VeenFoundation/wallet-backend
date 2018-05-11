pragma solidity ^0.4.18;

import "./ERC20Token.sol";
import "./SafeMath.sol";

/*
    Copyright 2018, All rights reserved.
     _      _
    \ \    / / ___   ___  _ __
     \ \  / / / _ \ / _ \| '_ \
      \ \/ / |  __/|  __/| | | |
       \__/   \___| \___||_| |_|

    @title Veen Token Contract.
    @author Dohyeon Lee
    @description Veen token is a ERC20-compliant token.

*/

contract Veen is ERC20Token {
    using SafeMath for uint;

    string public constant name = "Veen";
    string public constant symbol = "VEEN";
    uint8 public constant decimals = 18;
    uint private i;
    uint private _tokenSupply;
    uint private _totalSupply;
    uint public fee;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowed;

    constructor() public {
        _totalSupply = 15000000000 * (uint256(10) ** decimals);
        _balances[msg.sender] = 20000 * (uint256(10) ** decimals);
    }

    function totalSupply() public constant returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public constant returns (uint256 balance) {
        return _balances[tokenOwner];
    }

    function transfer(address to, uint tokens) public {
        require(tokens <= _balances[msg.sender]);
        
        _balances[msg.sender] = _balances[msg.sender].sub(tokens);
        _balances[to] = _balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens," ");
    }

    function approve(address spender, uint256 tokens) public returns (bool success) {
        if (tokens > 0 && balanceOf(msg.sender) >= tokens) {
            _allowed[msg.sender][spender] = tokens;
            emit Approval(msg.sender, spender, tokens);
            return true;
        }

        return false;
    }

    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return _allowed[tokenOwner][spender];
    }

    function transferFrom(address from, address to, uint256 tokens) public returns (bool success) {
        if (tokens > 0 && balanceOf(from) >= tokens && _allowed[from][msg.sender] >= tokens) {
            _balances[from] = _balances[from].sub(tokens);
            _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(tokens);
            _balances[to] = _balances[to].add(tokens);
            emit Transfer(msg.sender, to, tokens, " ");
            return true;
        }
        return false;
    }

    function () public payable {
        revert();
    }
}