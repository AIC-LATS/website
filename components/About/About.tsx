'use client'

import {
  Box,
  Flex,
  Text,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Icon,
  Image
} from '@chakra-ui/react'

import { Link } from '@chakra-ui/next-js'
import {
  FaExternalLinkAlt
} from 'react-icons/fa'


import { Julius_Sans_One, Roboto} from 'next/font/google'


const jso = Julius_Sans_One({ weight: '400', subsets: ['latin'] })
const rbt = Roboto({ weight: '400', subsets: ['latin'] })


export default function About() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
    return (
    <>
    
          
          <Stack spacing={25} alignItems={'center'} paddingTop={10}>
            
             

                <Text ml={2} fontWeight="bold" fontSize="4xl" verticalAlign="middle" className={rbt.className}>
                  About App:  
                </Text>
                
                <Text ml={2} fontWeight="bold" fontSize="xl" verticalAlign="middle">
                <span className={jso.className}>Shankara Vision</span> is an open-source application that helps the deaf and people who have trouble with hearing.
                </Text>
                <Flex>
                  <Image src = "https://i.pinimg.com/736x/95/8f/03/958f039609fffe0e4a1d2d979aa3a096.jpg"/>
                  &nbsp;
                  <Image src = "https://media.istockphoto.com/id/165792328/vector/sign-language-letter-a-b-c-d-e.jpg?s=612x612&w=0&k=20&c=KZFf9Vfaebt_Wqk89ddNYE9v2S-8Y3OuGexuSIVAqFc="/>

                </Flex>
               

                <Text ml={2} fontWeight="bold" fontSize="xl" verticalAlign="middle">
                  We use the one of the latest Convolutional Neural Network (CNN) model called Yolo-v8 to detect the hand gesture and translate it into text.
                </Text>
          </Stack>
          
        
  
   
      
            <Stack alignItems="center" bgColor={useColorModeValue('gray200', 'gray.800')} paddingTop={200}>
                <Text ml={2} fontWeight="bold" fontSize="xl" verticalAlign="middle">
                  Are you curious about how this application works?
                </Text>
                <Link href={'https://github.com/AIC-LATS'} display="flex" alignItems="center" style={{ textDecoration: 'none' }}>
                <Button
                  size='md'
                  height='48px'
                  width='300px'
                  border='2px'
                  bgColor={useColorModeValue('white', 'gray.800')}
                  borderColor='purple.400'
                  letterSpacing={1.1}
                >
                  <Icon as={FaExternalLinkAlt} boxSize={4} verticalAlign="middle" />
                  &nbsp;&nbsp;&nbsp;Check our repository!
                </Button>

                </Link>
                
             
            </Stack>
      
        
    </>
    )
  }