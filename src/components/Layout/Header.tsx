'use client'

import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Container,
  Heading,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  Text,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { FaFutbol } from 'react-icons/fa'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onToggle } = useDisclosure()
  const { isAuthenticated, user, logout } = useAuthStore()

  const bg = useColorModeValue('white', 'gray.800')
  const color = useColorModeValue('gray.600', 'white')

  return (
    <Box bg={bg} px={4} shadow="sm">
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Link href="/" passHref>
            <Flex alignItems="center" cursor="pointer">
              <FaFutbol size={24} color="#0073E6" />
              <Heading size="md" ml={2} color="brand.600">
                Formación ProSoccer
              </Heading>
            </Flex>
          </Link>

          {/* Desktop Navigation */}
          <Flex alignItems="center" display={{ base: 'none', md: 'flex' }}>
            <Stack direction="row" spacing={4}>
              <Link href="/" passHref>
                <Button variant="ghost" color={color}>
                  Inicio
                </Button>
              </Link>
              <Link href="/teams" passHref>
                <Button variant="ghost" color={color}>
                  Equipos
                </Button>
              </Link>
              <Link href="/matches" passHref>
                <Button variant="ghost" color={color}>
                  Partidos
                </Button>
              </Link>
              <Link href="/payments" passHref>
                <Button variant="ghost" color={color}>
                  Pagos
                </Button>
              </Link>
            </Stack>

            <Stack direction="row" spacing={2} ml={4}>
              <IconButton
                size="md"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                aria-label="Toggle color mode"
                onClick={toggleColorMode}
                variant="ghost"
              />
              
              {isAuthenticated ? (
                <HStack spacing={2}>
                  <Text fontSize="sm" color={color}>
                    Hola, {user?.name}
                  </Text>
                  <Button size="sm" variant="outline" onClick={logout}>
                    Cerrar Sesión
                  </Button>
                </HStack>
              ) : (
                <HStack spacing={2}>
                  <Link href="/login" passHref>
                    <Button size="sm" variant="ghost">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" passHref>
                    <Button size="sm" colorScheme="brand">
                      Registrarse
                    </Button>
                  </Link>
                </HStack>
              )}
            </Stack>
          </Flex>

          {/* Mobile menu button */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={onToggle}
          />
        </Flex>

        {/* Mobile Navigation */}
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={4}>
              <Link href="/" passHref>
                <Button variant="ghost" color={color} w="full" justifyContent="start">
                  Inicio
                </Button>
              </Link>
              <Link href="/teams" passHref>
                <Button variant="ghost" color={color} w="full" justifyContent="start">
                  Equipos
                </Button>
              </Link>
              <Link href="/matches" passHref>
                <Button variant="ghost" color={color} w="full" justifyContent="start">
                  Partidos
                </Button>
              </Link>
              <Link href="/payments" passHref>
                <Button variant="ghost" color={color} w="full" justifyContent="start">
                  Pagos
                </Button>
              </Link>
              
              <VStack spacing={2} pt={4} borderTop={1} borderStyle="solid" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                {isAuthenticated ? (
                  <>
                    <Text fontSize="sm" color={color}>
                      Hola, {user?.name}
                    </Text>
                    <Button size="sm" variant="outline" w="full" onClick={logout}>
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" passHref>
                      <Button size="sm" variant="ghost" w="full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/register" passHref>
                      <Button size="sm" colorScheme="brand" w="full">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </VStack>
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  )
} 