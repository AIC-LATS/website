'use client'

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Icon,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link } from '@chakra-ui/next-js'
import {
  FaAmericanSignLanguageInterpreting,
  FaQuestionCircle
} from 'react-icons/fa'
import {
  MdLinkedCamera
} from 'react-icons/md'

interface Props {
  children: React.ReactNode
}

const NavLink = (props: Props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleButtonClick = () => {
    

    // Menambahkan delay selama 1 detik sebelum mengarahkan pengguna ke halaman "/main"
    setTimeout(() => {
      window.location.href = '/main'
    }, 1000);
  };
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          
          <HStack spacing={200} alignItems={'center'}>
            <Box display="flex" alignItems="center">
              <Link href={'/'} display="flex" alignItems="center" style={{ textDecoration: 'none' }}>
                <Icon as={FaAmericanSignLanguageInterpreting} boxSize={8} verticalAlign="middle" />
                <Text ml={2} fontWeight="bold" fontSize="xl" verticalAlign="middle">
                  Shankara Vision
                </Text>
              </Link>
            </Box>
            
          </HStack>

          <Flex alignItems={'center'}>
            
            <Stack direction={'row'} spacing={7}>
            <Box display="flex" alignItems="center">
              <Link href={'/about'}> <Icon as={FaQuestionCircle} boxSize={6} verticalAlign="middle" /></Link>
            </Box>         
                <Button
                  px={10}
                  fontSize={'sm'}
                  rounded={'full'}
                  bg={'blue.400'}
                  color={'white'}
                  onClick={handleButtonClick}
                  boxShadow={
                    '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                  }
                  _hover={{
                    bg: 'blue.500',
                  }}
                  _focus={{
                    bg: 'blue.500',
                  }}
                  >
                    <Icon as ={MdLinkedCamera} boxSize={6} marginRight={5}/> 
                    Detect
                </Button>
              
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>

      </Box>
    </>
  )
}
