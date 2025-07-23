'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { FaFutbol } from 'react-icons/fa'

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="linear-gradient(135deg, brand.500 0%, brand.600 100%)"
        color="white"
        py={20}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <FaFutbol size={64} />
            <Heading
              as="h1"
              size="2xl"
              fontWeight="bold"
              lineHeight="1.2"
            >
              Formación ProSoccer
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              La plataforma digital integral para el fútbol amateur. 
              Organiza partidos, gestiona equipos y fortalece la camaradería 
              deportiva de manera sencilla y profesional.
            </Text>
            <HStack spacing={4}>
              <Button size="lg" colorScheme="whiteAlpha" variant="solid">
                Comenzar Ahora
              </Button>
              <Button size="lg" variant="outline" color="white" _hover={{ bg: 'whiteAlpha.200' }}>
                Ver Demo
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg="white">
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl" color="brand.600">
                Todo lo que necesitas para tu equipo
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Una plataforma completa diseñada específicamente para el fútbol amateur, 
                con todas las herramientas necesarias para organizar tu equipo.
              </Text>
            </VStack>

            <VStack spacing={8}>
              <Box p={6} bg="white" borderRadius="lg" boxShadow="md" textAlign="center" w="full" maxW="md">
                <VStack spacing={4}>
                  <Box p={4} bg="brand.100" borderRadius="full" color="brand.600">
                    <FaFutbol size={24} />
                  </Box>
                  <Heading as="h3" size="md" color="gray.800">
                    Organización de Partidos
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Crea y gestiona partidos de manera sencilla e intuitiva
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="gray.50" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading as="h2" size="xl" color="brand.600">
              ¿Listo para transformar tu equipo?
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Únete a cientos de equipos que ya están usando Formación ProSoccer 
              para organizar sus partidos y fortalecer la camaradería.
            </Text>
            <Button size="lg" colorScheme="brand">
              Crear Mi Equipo
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
} 