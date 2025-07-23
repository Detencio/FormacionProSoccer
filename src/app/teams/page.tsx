'use client'

import { Box, Heading, Text } from '@chakra-ui/react'

export default function TeamsPage() {
  return (
    <Box p={8} textAlign="center">
      <Heading size="lg" color="brand.600">Equipos</Heading>
      <Text mt={4}>Aquí se mostrarán los equipos y la gestión de los mismos.</Text>
    </Box>
  )
} 