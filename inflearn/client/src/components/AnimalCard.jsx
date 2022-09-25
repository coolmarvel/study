import React from "react";
import { Image } from "@chakra-ui/react";

const AnimalCard = (props) => {
  const animalType = props.animalType;
  return (
    <Image
      m={"0 auto"}
      w={150}
      h={200}
      src={`images/${animalType}.png`}
      alt="AnimalCard"
    />
  );
};

export default AnimalCard;
