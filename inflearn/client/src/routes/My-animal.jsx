import React, { useEffect, useState } from "react";
import {
  mintAnimalTokenContract,
  saleAnimalTokenAddress,
  saleAnimalTokenContract,
} from "../store/web3Config";
import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import MyAnimalCard from "../components/MyAnimalCard";

const MyAnimal = (props) => {
  const accounts = props.accounts;

  // 동물카드들마다 각각 내려줄 토큰id, 동물타입, 토큰가격을 담을 배열useState
  const [animalCardArray, setAnimalCardArray] = useState([]);
  // 판매상태의 켜짐/꺼짐을 나타내는 용도의 useState
  const [saleStatus, setSaleStatus] = useState(false);

  // 사용자가 가진 토큰들 불러오기
  const getAnimalTokens = async () => {
    try {
      const balanceLength = await mintAnimalTokenContract.methods
        .balanceOf(accounts[0]) // 특정 계정이 가진 토큰이 몇개인지 반환하는 메서드
        .call();
      if (balanceLength === "0") return;

      let tempAnimalCardArray = []; // 사용자의 동물타입 받아서 담을 임시배열

      const response = await mintAnimalTokenContract.methods
        .getAnimalTokens(accounts[0])
        .call();
      response.map((v) => {
        tempAnimalCardArray.push({
          animalTokenId: v.animalTokenId,
          animalType: v.animalType,
          animalPrice: v.animalPrice,
        });
      });
      // 동물타입 담은 배열 useState로 담기
      setAnimalCardArray(tempAnimalCardArray);
    } catch (error) {
      console.log(error);
    }
  };
  // 판매상태를 불러오는 함수
  const getIsApprovedForAll = async () => {
    try {
      const response = await mintAnimalTokenContract.methods
        // 내 계정이 배포된 스마트컨트랙트(SaleAnimalToken)에게
        // 사용 허가를 받았는지 여부를 boolean으로 알려주는 메서드
        .isApprovedForAll(accounts[0], saleAnimalTokenAddress)
        .call();
      if (response) {
        // 허가를 받았으면 useState에 담아두기
        setSaleStatus(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 판매상태를 on/off 하는 함수
  const onClickApproveToggle = async () => {
    try {
      if (!accounts) return; // 계정 로그인 안했으면 아무것도 안함
      const response = await mintAnimalTokenContract.methods
        // 배포된 스마트컨트랙트(SaleAnimalToken)의 사용 허가 여부를
        // 지정하는 메서드(현재상태saleStatus에 따라 반대로 하여 on/off)
        .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
        .send({ from: accounts[0] });
      if (response.status) {
        // on/off에 성공했으면 그에 맞게 useState도 바꿔주기
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!accounts || !mintAnimalTokenContract || !saleAnimalTokenContract)
      return; // 계정이 없을 경우(로그인 안 됐을 경우) 실행되지 않게하기
    getIsApprovedForAll();
    getAnimalTokens(); // 해당 계정의 토큰들 불러오기
  }, [accounts]);

  useEffect(() => {
    console.log(animalCardArray);
  }, [animalCardArray]);

  return (
    <>
      <Flex alignItems={"center"}>
        <Text display="inline-block">
          판매상태 : {saleStatus ? "판매가능" : "판매 노가능"}
        </Text>
        <Button
          size="xs"
          ml={2}
          colorScheme={saleStatus ? "red" : "blue"}
          onClick={onClickApproveToggle}
        >
          {saleStatus ? "판매기능 끄기" : "판매기능 켜기"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4,1fr)" gap={8} mt={4}>
        {animalCardArray &&
          // 맵함수로 토큰id,동물타입,토큰가격이 담긴 배열의 요소개수만큼 돌려주기
          animalCardArray.map((v, index) => {
            return (
              <MyAnimalCard
                key={index}
                initialization={props.initialization}
                // 각 동물카드덩이마다 토큰id,동물타입,토큰가격 내려주기 위함
                animalTokenId={v.animalTokenId}
                animalType={v.animalType}
                animalPrice={v.animalPrice}
                saleStatus={saleStatus}
                accounts={accounts}
              />
            );
          })}
      </Grid>
    </>
  );
};

export default MyAnimal;
