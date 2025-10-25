import React from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Flex justify="space-between" align="center" p={4} bg="gray.100">
      <Heading size="md">SocialPulse</Heading>
      <Button size="sm" colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </Flex>
  );
}
