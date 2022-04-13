pragma solidity >= 0.7.0 < 0.9.0;

contract HelloSolidity {
    string private s;

    constructor() public {
        s = "Hello World!";
    }

    // function Hello World!
    function getHelloWorld() public view returns(string memory){
        return s;
    }
}
