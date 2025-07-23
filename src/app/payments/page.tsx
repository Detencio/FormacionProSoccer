'use client'

import { Box, Heading, Text } from '@chakra-ui/react'

export default function PaymentsPage() {
  return (
    <Box p={8} textAlign="center">
      <Heading size="lg" color="brand.600">Pagos y Cuotas</Heading>
      <Text mt={4}>Aquí se gestionarán los pagos y cuotas del equipo.</Text>
    </Box>
  )
} 