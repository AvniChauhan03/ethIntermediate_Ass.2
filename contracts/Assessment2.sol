// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable private owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        // Make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // Perform transaction
        balance += _amount;

        // Emit the event
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");

        // Check for sufficient balance before withdrawing
        require(balance >= _withdrawAmount, "Insufficient balance for withdrawal");

        // Withdraw the given amount
        balance -= _withdrawAmount;

        // Emit the event
        emit Withdraw(_withdrawAmount);
    }
}
