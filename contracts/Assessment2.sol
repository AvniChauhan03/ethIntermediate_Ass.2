// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;
    uint256 public balance;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = msg.sender;
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    function deposit(uint256 _amount) public payable onlyOwner {
        uint256 _previousBalance = balance;

        // Perform the transaction
        balance += _amount;

        // Assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // Emit the event
        emit Deposit(msg.sender, _amount);
    }

    // Custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public onlyOwner {
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance(balance, _withdrawAmount);
        }

        // Withdraw the given amount
        balance -= _withdrawAmount;

        // Assert the balance is correct
        assert(balance == _previousBalance - _withdrawAmount);

        // Emit the event
        emit Withdraw(msg.sender, _withdrawAmount);
    }
}
