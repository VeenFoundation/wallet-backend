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

interface ERC223 {

    function totalSupply() external  constant returns (uint);
    function balanceOf(address who) external  constant returns (uint);
    function transfer(address to, uint value) external ;
    function transfer(address to, uint value, bytes data) external ;
    event Transfer(address indexed from, address indexed to, uint value, bytes data);

}
