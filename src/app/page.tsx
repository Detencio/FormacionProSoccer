'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaFutbol, FaUsers, FaCalendarAlt, FaCreditCard } from 'react-icons/fa'

const features = [
  {
    icon: FaFutbol,
    title: 'Organización de Partidos',
    description: 'Crea y gestiona partidos de manera sencilla e intuitiva',
  },
  {
    icon: FaUsers,
    title: 'Gestión de Equipos',
    description: 'Administra tu equipo, jugadores y estadísticas',
  },
  {
    icon: FaCalendarAlt,
    title: 'Calendario Inteligente',
    description: 'Mantén un calendario organizado de todos los eventos',
  },
  {
    icon: FaCreditCard,
    title: 'Gestión Financiera',
    description: 'Controla cuotas, gastos y presupuestos del equipo',
  },
]

export default function HomePage() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

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
      <Box py={20} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl" color="brand.600">
                Todo lo que necesitas para tu equipo
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Una plataforma completa diseñada específicamente para el fútbol amateur, 
                con todas las herramientas necesarias para organizar tu equipo.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                  textAlign="center"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <VStack spacing={4}>
                    <Box
                      p={4}
                      bg="brand.100"
                      borderRadius="full"
                      color="brand.600"
                    >
                      <Icon as={feature.icon} boxSize={6} />
                    </Box>
                    <Heading as="h3" size="md" color="gray.800">
                      {feature.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm">
                      {feature.description}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
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
            <Text fontSize="lg" color={textColor} maxW="2xl">
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