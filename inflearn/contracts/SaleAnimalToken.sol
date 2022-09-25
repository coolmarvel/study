// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "./MintAnimalToken.sol";

contract SaleAnimalToken {
    // MintAnimalToken 컨트랙트를 배포(deploy)해서 나온 주소값을 담기 위한 변수
    MintAnimalToken public mintAnimalTokenAddress;

    // 최초실행할 때 MintAnimalToken 컨트랙트의 주소값을 가져다가
    constructor(address _mintAnimalTokenAddress) {
        // 위에 담기 위해 만들어둔 변수에 담음
        mintAnimalTokenAddress = MintAnimalToken(_mintAnimalTokenAddress);
    } // 상속과는 다른것. 상속은 어떤 경우에도 상속한 컨트랙트를 사용할 수 있지만

    // 위와 같은것은 배포된 MintAnimalToken 컨트랙트 내에서만 작동하게끔 함
    // 그래서 이 컨트랙트는 배포될 때 인자로 MintAnimalToken의 address를 받아야만
    // 배포할 수 있음.

    // 토큰id로부터 토큰의 가격을 담을 매핑
    mapping(uint256 => uint256) public animalTokenPrices;

    // 판매중인 토큰id를 담기 위한 배열 (판매대)
    uint256[] public onSaleAnimalTokenArray;

    // 토큰 판매를 위한 세팅
    function setForSaleAnimalToken(uint256 _animalTokenId, uint256 _price)
        public
    {
        // 토큰id를 가지고 찾은 해당 토큰의 주인address를 변수에 담기
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(
            _animalTokenId
        );
        require( // 토큰의 주인과 현재 사용자가 같은지 확인
            animalTokenOwner == msg.sender,
            "Caller is not animal token owner."
        ); // 판매가는 0원 초과가 되도록
        require(_price > 0, "Price is zero or lower.");
        require( // uint의 기본값은 0이므로 토큰 발행(minting)시 0원임
            // 0원이면 아직 판매하기위해 올린게 아닌것을 의미하므로 0원이면 통과
            animalTokenPrices[_animalTokenId] == 0,
            "This animal token is already on sale."
        );
        // isApprovedForAll(주인address, 스마트컨트랙트address)
        // ERC721에서 제공하는것으로 해당 계약(스마트컨트랙트)의 판매권한을 넘겼는지 판단해줌
        // 잘못된 스마트컨트랙트로 인해 코인이 알수없는곳에 보내질 경우
        // 코인이 그 알수없는곳에 묶이는것을 방지하기 위함
        require(
            mintAnimalTokenAddress.isApprovedForAll(
                animalTokenOwner, // 토큰의 주인
                address(this) // 현재 이 컨트랙트의 주소를 의미
            ),
            "Animal token owner did not approve token."
        );
        // 해당 토큰 매핑에 가격 담아주기
        animalTokenPrices[_animalTokenId] = _price;
        // 판매대에 해당 토큰 등록
        onSaleAnimalTokenArray.push(_animalTokenId);
    }

    function purchaseAnimalToken(uint256 _animalTokenId) public payable {
        // 해당 토큰의 판매가 변수에 담기
        uint256 price = animalTokenPrices[_animalTokenId];
        // 해당 토큰의 주인address 변수에 담기
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(
            _animalTokenId
        );

        // 해당 토큰이 판매중인지 확인(0원은 토큰생성시 기본값임)
        require(price > 0, "Animal token not sale.");
        // 현 사용자가 판매가 이상의 금액을 보내는지 확인
        require(price <= msg.value, "Caller sent lower than price.");
        // 구매자가 해당 토큰의 주인이면 구매 못하도록 막기
        require(
            animalTokenOwner != msg.sender,
            "Caller is animal token owner."
        );

        // payable(받을 사용자address).transfer(msg.value) 솔리디티의 기능으로
        // 현 사용자가 보낸 금액을 받을 사용자address에 보내주는 함수
        payable(animalTokenOwner).transfer(msg.value);
        // safeTransferFrom(보내는이address, 받는이address, 토큰id)
        // 토큰을 해당 토큰 주인에게서 구매자(msg.sender)에게 준다
        mintAnimalTokenAddress.safeTransferFrom(
            animalTokenOwner, // 보내는 이
            msg.sender, // 받는 이
            _animalTokenId // 토큰
        );
        // 구매 완료됐으면 토큰 가격 0으로 바꿔서 판매중이 아니게끔 변경
        animalTokenPrices[_animalTokenId] = 0;
        // 판매대에서 제거(판매대의 토큰 개수만큼 반복)
        for (uint256 i = 0; i < onSaleAnimalTokenArray.length; i++) {
            // 판매대에 있는 토큰이 0원짜리이면
            if (animalTokenPrices[onSaleAnimalTokenArray[i]] == 0) {
                // 판매대에 있는 제일 마지막 토큰을 해당 토큰 자리에 복사해 넣기
                onSaleAnimalTokenArray[i] = onSaleAnimalTokenArray[
                    onSaleAnimalTokenArray.length - 1
                ]; // 판매대 제일 마지막 토큰 삭제
                onSaleAnimalTokenArray.pop();
            }
        }
    }

    // 판매대에 판매중인 토큰이 몇개인지 알아오는 함수
    function getOnsaleAnimalTokenArrayLength() public view returns (uint256) {
        return onSaleAnimalTokenArray.length;
    }

    // 토큰 아이디로 토큰 가격 불러오는 함수
    function getAnimalTokenPrice(uint256 _animalTokenId)
        public
        view
        returns (uint256)
    {
        return animalTokenPrices[_animalTokenId];
    }
}
