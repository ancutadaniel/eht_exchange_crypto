// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

import './Dacether.sol';

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    string public symbol = "ETH";

    uint public rate = 100;

    event DacetherPurchase(
        address account,
        address dacether,
        uint amount,
        uint rate
    );
    
    event DacetherSell(
        address account,
        address dacether,
        uint amount,
        uint rate
    );

    Dacether public dacether;

    constructor(Dacether _dacether) public {
        dacether = _dacether;
    }

    // function buy dacether, we sent EHT to function
    function buyDacether() public payable {
        // Redemtion rate = # of dacether they receive for 1 ehter
        // Calculate the number of dacether to buy
        // Amount of EHT * Redemtion rate
        uint dacetherAmount =  msg.value * rate;   

        // Check a specific condition to be true to execute 

        require(dacether.balanceOf(address(this)) >= dacetherAmount);

        dacether.transfer(msg.sender, dacetherAmount);

        // Event emit
        emit DacetherPurchase( msg.sender, address(dacether), dacetherAmount, rate);

    }


    function sellDacether(uint _amount) public {
        // User can't sell more dacether that they have
        require(dacether.balanceOf(msg.sender) >= _amount);

       // Calculate the amount of ETH to redeem    
        uint etherAmount = _amount / rate;

        // Require that EhtSwapp has enought Ether
       require(address(this).balance >= etherAmount); 

        dacether.transferFrom(msg.sender, address(this), _amount);

        // Perform sale - send ETH to msg.sender 
        msg.sender.transfer(etherAmount);

        // Event emit
        emit DacetherSell(msg.sender, address(dacether), _amount, rate);
    }
}