// app/page.tsx
'use client'
import {
    Box,
    Flex,
    Text,
    Stack,
    Image
  } from '@chakra-ui/react'

import { Julius_Sans_One } from 'next/font/google'

const jso = Julius_Sans_One({ weight: '400', subsets: ['latin'] })


export default function Home() {

    return (
        <>
            <Flex align="center" justify="center" paddingTop={20}>
            <Box
            width="500px"
            height="500px"
            borderRadius="50%" // Membuat elemen berbentuk lingkaran
            boxShadow="0px 1px 50px -5px rgb(66 153 225 / 100%), 0 10px 30px -5px rgb(66 153 225 / 100%)"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
            >
            <Image
                src="./shankara.png"
                width="105%"
                height="110%"
                objectFit="cover"
                borderRadius="50%" // Menambahkan borderRadius pada gambar agar sesuai dengan elemen
            />
           
            </Box>
            </Flex>

            <Stack align="center" paddingTop= {5}>
                <Text className={jso.className} fontSize={85}>
                    ShankaraVision
                </Text>
                <Text className={jso.className} fontSize={30}>
                    a sign language recognition app
                </Text>
            </Stack>
            
        </>
    )
  }