import React, { useEffect, useState } from "react";
import { Grid } from "@chakra-ui/react";
import SaleAnimalCard from "../components/SaleAnimalCard";
import {
  mintAnimalTokenContract,
  saleAnimalTokenContract,
} from "../store/web3Config";

const SaleAnimal = (props) => {
  const accounts = props.accounts;
  // 판매중인 동물카드들 담아둘 State
  const [saleAnimalCardArray, setSaleAnimalCardArray] = useState([]);

  // 판매대에 올라가 있는 토큰들 불러오기
  const getOnSaleAnimalTokens = async () => {
    try {
      const getOnsaleAnimalTokenArrayLength =
        await saleAnimalTokenContract.methods
          .getOnsaleAnimalTokenArrayLength()
          .call(); // 판매중인 토큰이 몇개인지 불러오는 메서드
      // 판매중인 토큰이 없으면 아무것도 안하기
      if (getOnsaleAnimalTokenArrayLength == 0) return;
      const tempOnSaleArray = []; // 판매중인 토큰정보 담을 임시배열

      // 판매중인 토큰 개수만큼 반복
      for (let i = 0; i < parseInt(getOnsaleAnimalTokenArrayLength, 10); i++) {
        const animalTokenId = await saleAnimalTokenContract.methods
          .onSaleAnimalTokenArray(i)
          .call(); // 판매대에서 i번째의 토큰id를 가져옴
        const animalType = await mintAnimalTokenContract.methods
          .animalTypes(animalTokenId)
          .call(); // i번째 토큰id로부터 매핑된 동물타입 가져옴
        const animalTokenPrice = await saleAnimalTokenContract.methods
          .animalTokenPrices(animalTokenId)
          .call(); // i번째 토큰id로부터 매핑된 토큰 가격을 가져옴
        // 판매중인 토큰 임시배열에 토큰정보 담기
        tempOnSaleArray.push({
          animalTokenId: animalTokenId,
          animalType: animalType,
          animalTokenPrice: animalTokenPrice,
        });
      }
      // 판매중인 토큰정보들 담긴 임시 배열을 useState에 담기
      setSaleAnimalCardArray(tempOnSaleArray);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOnSaleAnimalTokens();
  }, []);

  return (
    <>
      <Grid templateColumns="repeat(4,1fr)" gap={8} mt={4}>
        {saleAnimalCardArray &&
          saleAnimalCardArray.map((v, index) => {
            return (
              <SaleAnimalCard
                key={index}
                animalTokenId={v.animalTokenId}
                animalType={v.animalType}
                animalTokenPrice={v.animalTokenPrice}
                accounts={accounts}
                getOnSaleAnimalTokens={getOnSaleAnimalTokens}
              />
            );
          })}
      </Grid>
    </>
  );
};

export default SaleAnimal;
