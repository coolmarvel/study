import React, { useState } from "react";
import { mintAnimalTokenContract } from "../store/web3Config";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import AnimalCard from "../components/AnimalCard";

const Main = (props) => {
  const accounts = props.accounts;
  const [newAnimalType, setNewAnimalType] = useState("");

  const onClickMint = async () => {
    console.log("account", accounts);
    try {
      // 계정이 없을 경우(로그인 안 됐을 경우) 실행되지 않게하기
      if (!accounts) return;

      // 동물카드NFT 발행(민트) 결과 담을 변수
      const response = await mintAnimalTokenContract.methods
        .mintAnimalToken() // 토큰 민트 함수
        .send({ from: accounts[0] })
        .then((res) => console.log(res));
      // 정상적으로 발행이 됐으면(status값이 true로 나옴)
      // 현 사용자가 발행한 토큰의 동물타입이 뭔지 찾아서 useState에 담을것임
      if (response) {
        const balanceLength = await mintAnimalTokenContract.methods
          .balanceOf(accounts[0]) // 특정 계정이 가진 토큰이 몇개인지 반환하는 메서드
          .call();

        const animalTokenId = await mintAnimalTokenContract.methods
          // 특정 계정의 몇번째(인덱스값) 토큰의 id값을 반환하는 메서드
          .tokenOfOwnerByIndex(
            accounts[0],
            parseInt(balanceLength.length, 10) - 1 // parseInt(숫자로 변환할녀석, 10진수)
          )
          .call();

        const animalType = await mintAnimalTokenContract.methods
          .animalTypes(animalTokenId) // 토큰id로 해당토큰의 동물타입을 반환하는 메서드
          .call();

        console.log("animalType", animalType);
        setNewAnimalType(animalType); // 동물타입 useState에 담기
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      w="full"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Box>
        {newAnimalType ? (
          <>
            <Text>새로운 동물이 등장했어요!</Text>
            <AnimalCard animalType={newAnimalType} />
          </>
        ) : (
          <Text>동물카드를 만들어봐요!</Text>
        )}
      </Box>
      <Box>
        <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>
          민트초코
        </Button>
      </Box>
    </Flex>
  );
};

export default Main;
