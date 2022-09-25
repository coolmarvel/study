// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./SaleAnimalToken.sol";

contract MintAnimalToken is ERC721Enumerable {
    // ERC721에서 (name, sybol)이 필요
    constructor() ERC721("MintNFT", "MNT") {}

    // 배포된 SaleAnimalToken 컨트랙트를 담기 위한 녀석
    SaleAnimalToken public saleAnimalToken;

    // 토큰id로부터 동물타입을 담을 매핑
    mapping(uint256 => uint256) public animalTypes;
    // 동물토큰 정보
    struct AnimalTokenData {
        uint256 animalTokenId; // 토큰id(1,2,3...)
        uint256 animalType; // 동물타입(1~5)
        uint256 animalPrice; // 토큰 가격
    }

    // 동물토큰 민트(발행) 함수
    function mintAnimalToken() public {
        // totalSupply() : ERC721Enumerable.sol에서 제공. 지금까지 민팅 된 NFT양을 의미(각 NFT를 구별할 id값)
        uint256 animalTokenId = totalSupply() + 1;

        // 동물 타입
        uint256 animalType = (uint256(
            keccak256( // 변하는 값(현재시간, 사용자, 토큰아이디값)을 넣어 랜덤 수를 뽑아냄
                abi.encodePacked(block.timestamp, msg.sender, animalTokenId)
            ) // 랜덤 수를 5로 나눈 나머지로 1~5까지의 값을 추출(동물타입은 5가지가 됨)
        ) % 5) + 1;

        // 이번에 만들 토큰id 매핑에 동물타입(1~5)를 저장
        animalTypes[animalTokenId] = animalType;

        // 토큰 민팅하는 함수(사용자 본인address와 토큰id가 들어감)
        _mint(msg.sender, animalTokenId);
    }

    // 특정 사용자가 가진 토큰들의 정보를 가져오는 함수
    function getAnimalTokens(
        address _animalTokenOwner // 배열[]과 문자열string은 memory를 써줘야함
    ) public view returns (AnimalTokenData[] memory) {
        // 사용자의 토큰개수(balanceOf)를 변수에 담기
        uint256 balanceLength = balanceOf(_animalTokenOwner);
        // 사용자가 가진 토큰이 있으면 통과
        require(balanceLength != 0, "Owner did not have token.");
        // AnimalTokenData구조체를 담을 변수 생성
        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](
            balanceLength // 배열의 길이는 토큰의 개수만큼(balanceLength)
        ); // 토큰개수만큼 반복
        for (uint256 i = 0; i < balanceLength; i++) {
            // 사용자의 i번 인덱스의 토큰의 id 찾아와(tokenOfOwnerByIndex) 변수에 담기
            uint256 animalTokenId = tokenOfOwnerByIndex(_animalTokenOwner, i);
            // 매핑으로 토큰id로부터 동물타입을 찾아와 변수에 담기
            uint256 animalType = animalTypes[animalTokenId];
            // 토큰id로 동물가격 받아와 변수에 담기
            uint256 animalPrice = saleAnimalToken.getAnimalTokenPrice(
                animalTokenId
            ); // AnimalTokenData구조체에 id,타입,가격 담아 i번째 배열에 넣기
            animalTokenData[i] = AnimalTokenData(
                animalTokenId,
                animalType,
                animalPrice
            );
        } // 반복문으로 완성된 토큰개수(balanceLength)에 맞는 정보가 담긴 배열animalTokenData 반환
        return animalTokenData;
    }

    // 배포된 SaleAnimalToken와 연결해주는 함수
    function setSaleAnimalToken(address _saleAnimalToken) public {
        saleAnimalToken = SaleAnimalToken(_saleAnimalToken);
    }
}
