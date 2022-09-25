import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import AnimalCard from "./AnimalCard";
import { saleAnimalTokenContract, web3 } from "../store/web3Config";

const MyAnimalCard = (props) => {
  const accounts = props.accounts;

  const animalTokenId = props.animalTokenId;
  const animalType = props.animalType;
  const animalPrice = props.animalPrice;
  const saleStatus = props.saleStatus;
  const [sellPrice, setSellPrice] = useState("");
  const [myAnimalPrice, setMyAnimalPrice] = useState(animalPrice);

  const onChangeSellPrice = (e) => {
    setSellPrice(e.target.value);
  };
  const onClickSell = async () => {
    try {
      if (!accounts || !saleStatus) return;

      const response = await saleAnimalTokenContract.methods
        .setForSaleAnimalToken(
          animalTokenId,
          web3.utils.toWei(sellPrice, "ether")
        )
        .send({ from: accounts[0] });
      if (response.status) {
        setMyAnimalPrice(web3.utils.toWei(sellPrice, "ether"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box textAlign={"center"} w={150}>
      <AnimalCard animalType={animalType} />
      <Box mt={2}>
        {myAnimalPrice === "0" ? (
          <>
            <InputGroup>
              <Input
                type={"number"}
                value={sellPrice}
                onChange={onChangeSellPrice}
              />
              <InputRightAddon children="ETH" />
            </InputGroup>
            <Button
              size={"sm"}
              colorScheme={"green"}
              mt={2}
              disabled={!saleStatus}
              onClick={onClickSell}
            >
              판매
            </Button>
          </>
        ) : (
          <Text d="inline-block">{web3.utils.fromWei(myAnimalPrice)} ETH</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyAnimalCard;
