import Webcam from "react-webcam";
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    Icon,
    Grid,
    GridItem,
    Image
  } from '@chakra-ui/react'
import { useState,
        useEffect,
    } from "react";


export default function Main() {

    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

    const startDetection = () => {
        setIsCameraOn(true);
    }

    const resetDetection = () => {
        setIsCameraOn(false);
    }



    return (
    <Box>
        <Grid
            templateAreas={`
                            "nav main"
                            `}
            gridTemplateRows={'auto'}
            gridTemplateColumns={'750px 1fr'}
            h='inherit'
            gap='1'
            fontWeight='bold'
            >
            <GridItem
                pl='10%'
                pr='5%'
                pt='20%'
                pb='10%'
                area={'nav'}
            >
                {
                    isCameraOn ?(
                        <Webcam
                    audio={false}
                    height={480}
                    screenshotFormat="image/jpeg"
                    width={640}
                     />
                    ):
                    (
                       <Image src="https://bit.ly/3L3dOHx" width={640} height={480}></Image>
                    )
                }
                

            </GridItem>
            <GridItem pl='2' area={'main'} padding={'10%'}>

                <HStack justifyContent={'center'} spacing = {7} style={{ transform: 'scale(1.2)' }}>
                    <Button colorScheme='teal' variant='outline' onClick={startDetection} isDisabled = {isCameraOn}>
                        Start Detection
                    </Button>
                    <Button colorScheme='teal' variant='outline' onClick={resetDetection}>
                        Reset
                    </Button>
                </HStack>


                {/* 
                Metrics
                */}
                <Flex justifyContent={'center'} marginTop={10}>
                    <Text ml={2} fontWeight="bold" fontSize="2xl" verticalAlign="middle" >
                     Using model: yolov8.onnx
                    </Text>
                </Flex>

                <Flex marginTop={5} justifyContent={'center'}>
                    <Stack spacing={3}>
                        <Text ml={2} fontWeight="bold" fontSize="lg" verticalAlign="middle" >
                        Detection Time: 0.00s
                        </Text>
                        <Text ml={2} fontWeight="bold" fontSize="lg" verticalAlign="middle" >
                        FPS: 0.00
                        </Text>
                        <Text ml={2} fontWeight="bold" fontSize="lg" verticalAlign="middle" >
                        Total Frames: 0
                        </Text>
                    </Stack>
                </Flex>

                {/* 
                Predicted Letter
                */}
                <Flex marginTop={10} justifyContent={'center'}>
                    <Stack spacing={1}>
                        <Text ml={2} fontWeight="bold" fontSize="4xl" verticalAlign="middle" >
                        Predicted Letter: 
                        </Text>
                            <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            borderRadius="10px"
                            position="relative"
                            >
                            <Text fontWeight="bold" fontSize="4xl">
                                A
                            </Text>
                            <Box
                                position="absolute"
                                top="-4px"
                                right="-4px"
                                bottom="-4px"
                                left="-4px"
                                borderRadius="14px"
                                boxShadow="0px 0px 10px rgba(72, 187, 120, 0.7)"
                                zIndex="-1"
                            />
                            </Box>
                    </Stack>
                </Flex>

                {/* 
                Predicted Words
                */}
                <Flex marginTop={20} justifyContent={'center'}>
                    <Stack spacing={1}>
                        <Text ml={2} fontWeight="bold" fontSize="4xl" verticalAlign="middle" >
                        Predicted Words: 
                        </Text>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            borderRadius="10px"
                            width={700}
                            position="relative"
                            backgroundColor={'gray.700'}
                            >
                            <Text fontWeight="bold" fontSize="4xl">
                                KENAPA BURUNG BISA TERBANG
                            </Text>
                        </Box>
                    </Stack>   
                </Flex>
            </GridItem>
        </Grid>
    </Box>
            
            
       
    
   


    )
  }