pragma solidity ^0.5.17;

contract Dev {

    event TestEvent(address contractAddress, uint numb);

    uint public foo = 3;

    function setFoo(uint _foo) public {
        foo = _foo;
    }

    function getFoo() public view returns(uint) {
        return foo;
    }

    function triggerEvent() public {
        emit TestEvent(address(this), foo);
    }

}
