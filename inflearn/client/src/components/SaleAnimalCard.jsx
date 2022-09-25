import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import {
  web3,
  mintAnimalTokenContract,
  saleAnimalTokenContract,
} from "../store/web3Config";
import AnimalCard from "./AnimalCard";

const SaleAnimalCard = (props) => {
  const animalTokenId = props.animalTokenId;
  const animalTokenPrice = props.animalTokenPrice;
  const animalType = props.animalType;
  const accounts = props.accounts;
  const getOnSaleAnimalTokens = props.getOnSaleAnimalTokens;

  const [isBuyable, setIsBuyable] = useState(false);

  const getAnimalTokenOwner = async () => {
    try {
      const response = await mintAnimalTokenContract.methods
        .ownerOf(animalTokenId)
        .call();
      setIsBuyable(
        response.toLocaleLowerCase() === accounts[0].toLocaleLowerCase()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onClickBuy = async () => {
    try {
      if (!accounts) return;
      const response = await saleAnimalTokenContract.methods
        .purchaseAnimalToken(animalTokenId)
        .send({ from: accounts[0], value: animalTokenPrice });

      if (response.status) {
        getOnSaleAnimalTokens();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAnimalTokenOwner();
  }, []);
  return (
    <Box textAlign={"center"} w={150}>
      <AnimalCard animalType={animalType} />
      <Box>
        <Text d={"inline-block"}>
          {web3.utils.fromWei(animalTokenPrice)} ETH
          <Button
            size={"sm"}
            m={2}
            colorScheme="green"
            disabled={isBuyable}
            onClick={onClickBuy}
          >
            구매
          </Button>
        </Text>
      </Box>
    </Box>
  );
};

export default SaleAnimalCard;
