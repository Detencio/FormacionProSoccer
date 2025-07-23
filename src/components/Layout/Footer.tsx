'use client'

import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { FaFutbol, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  const bg = useColorModeValue('gray.50', 'gray.900')
  const color = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box bg={bg} color={color} mt="auto">
      <Container maxW="container.xl" py={8}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={8} justify="space-between" align="center">
          {/* Logo and Description */}
          <VStack align="start" spacing={4}>
            <HStack>
              <FaFutbol size={20} color="#0073E6" />
              <Text fontWeight="bold" fontSize="lg" color="brand.600">
                Formación ProSoccer
              </Text>
            </HStack>
            <Text fontSize="sm" maxW="300px">
              La plataforma digital integral para el fútbol amateur. 
              Organiza partidos, gestiona equipos y fortalece la camaradería deportiva.
            </Text>
          </VStack>

          {/* Links */}
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={6}>
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold" fontSize="sm">
                Producto
              </Text>
              <Link href="/features" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Características
              </Link>
              <Link href="/pricing" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Precios
              </Link>
              <Link href="/demo" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Demo
              </Link>
            </VStack>

            <VStack align="start" spacing={2}>
              <Text fontWeight="bold" fontSize="sm">
                Soporte
              </Text>
              <Link href="/help" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Ayuda
              </Link>
              <Link href="/contact" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Contacto
              </Link>
              <Link href="/docs" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Documentación
              </Link>
            </VStack>

            <VStack align="start" spacing={2}>
              <Text fontWeight="bold" fontSize="sm">
                Legal
              </Text>
              <Link href="/privacy" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Privacidad
              </Link>
              <Link href="/terms" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Términos
              </Link>
              <Link href="/cookies" fontSize="sm" _hover={{ color: 'brand.500' }}>
                Cookies
              </Link>
            </VStack>
          </Stack>
        </Stack>

        {/* Bottom Section */}
        <Box borderTop={1} borderStyle="solid" borderColor={useColorModeValue('gray.200', 'gray.700')} pt={8} mt={8}>
          <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" spacing={4}>
            <Text fontSize="sm">
              © 2024 Formación ProSoccer. Todos los derechos reservados.
            </Text>
            
            <HStack spacing={4}>
              <Link href="https://github.com/Detencio" isExternal>
                <FaGithub size={18} />
              </Link>
              <Link href="https://twitter.com/formacionpro" isExternal>
                <FaTwitter size={18} />
              </Link>
              <Link href="https://linkedin.com/company/formacionpro" isExternal>
                <FaLinkedin size={18} />
              </Link>
            </HStack>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
} 