import React from "react";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <Stack h="100vh">
      <Flex
        bg="purple.200"
        p={4}
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Box>
          <Text fontWeight="bold">주주클럽</Text>
        </Box>
        <Link to="/">
          <Button size="sm" colorScheme="blue">
            메인
          </Button>
        </Link>
        <Link to="my-animal">
          <Button size="sm" colorScheme="red">
            내 동물들
          </Button>
        </Link>
        <Link to="sale-animal">
          <Button size="sm" colorScheme="green">
            동물 거래소
          </Button>
        </Link>
      </Flex>
      <Flex
        direction="column"
        h="full"
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Flex>
    </Stack>
  );
};

export default Layout;
