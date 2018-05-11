pragma solidity ^0.4.18;

/*

    Copyright 2018, All rights reserved.
     _      _
    \ \    / / ___   ___  _ __
     \ \  / / / _ \ / _ \| '_ \
      \ \/ / |  __/|  __/| | | |
       \__/   \___| \___||_| |_|

    @title Veen Token Contract.
    @author Dohyeon Lee
    @description ERC-20 Interface

*/

interface ERC20Token {
    function allowance(address tokenOwner, address spender) external constant returns (uint remaining);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);

    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}
