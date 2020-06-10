pragma solidity ^0.5.17;

contract Dev {

    uint public foo = 3;

    function setFoo(uint _foo) public {
        foo = _foo;
    }

    function getFoo() public view returns(uint) {
        return foo;
    }

}
