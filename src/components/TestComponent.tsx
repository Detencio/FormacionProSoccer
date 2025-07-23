'use client'

import { Box, Text, Button, VStack } from '@chakra-ui/react'

export default function TestComponent() {
  return (
    <Box p={8} textAlign="center">
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" color="brand.600">
          ¡Formación ProSoccer está funcionando!
        </Text>
        <Text color="gray.600">
          El proyecto se ha inicializado correctamente con Next.js 14 y Chakra UI.
        </Text>
        <Button colorScheme="brand" size="lg">
          Comenzar Desarrollo
        </Button>
      </VStack>
    </Box>
  )
} 