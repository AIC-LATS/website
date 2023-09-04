'use client'
import Webcam from "react-webcam";
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Text,
    Button,
    Stack,
    Grid,
    GridItem,
    Image
  } from '@chakra-ui/react'
import { useState,
        useRef
} from "react";
import {run_model} from "./Detection/runModel"
import { set } from "lodash";



const Main = (props:any) => {

    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    const [probability, setProbability] = useState<number>(0);
    const [letter, setLetter] = useState<string>("");
    const [detectionTime, setDetectionTime] = useState<number>(0);
    const [facingMode, setFacingMode] = useState<string>("environment");
    const [fps, setFps] = useState<string>("");
    const videoCanvasRef = useRef<HTMLCanvasElement>(null);
    const liveDetection = useRef<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const originalSize = useRef<number[]>([0, 0]);
 
    const capture = () => {
        const canvas = videoCanvasRef.current!;
        if (!canvas) {
            // Tambahkan penanganan kesalahan jika elemen canvas tidak ditemukan
            throw new Error("Canvas element not found!");
        }
        const context = canvas.getContext("2d", {
          willReadFrequently: true,
        })!;
    
        if (facingMode === "user") {
          context.setTransform(-1, 0, 0, 1, canvas.width, 0);
        }
    
        context.drawImage(
          webcamRef.current!.video!,
          0,
          0,
          canvas.width,
          canvas.height
        );
       
        if (facingMode === "user") {
          context.setTransform(1, 0, 0, 1, 0, 0);
        }
        return context;
      };

    const runModel = async (ctx: CanvasRenderingContext2D) => {
        const data = props.preprocess(ctx);
        let boxes: any[];
        let detectTime: number;
        let prob: number;
        let str : string;
        [boxes, detectTime, prob, str] = await run_model(
            props.session.model,
            props.session.nms,
            data
        )
       
        props.postprocess(boxes, ctx);
        setDetectionTime(detectTime);
        setProbability(prob);
        setLetter(str);
    };
    
    const startDetection = async () => {    
        console.log("start")
        setIsCameraOn(true);
        liveDetection.current = true;
            while (liveDetection.current) {
                try{
                    let tic = Date.now();
                    const ctx = capture();
                    if (!ctx) return;
                    await runModel(ctx);
                    const fps:number = 1000 / (Date.now() - tic);
                    
                    setFps(fps.toFixed(3));
                }
                catch(err){
                    console.log(err)
                }
                finally{
                    // So can move to next frame
                    await new Promise<void>((resolve) =>
                    requestAnimationFrame(() => resolve())
                    );
                }
          
        }
        
    }

    const resetDetection = async () => {
        setIsCameraOn(false);
        liveDetection.current = false;
    }

    const setWebcamCanvasOverlaySize = () => {
        const element = webcamRef.current!.video!;
        if (!element) return;
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        var cv = videoCanvasRef.current;
        if (!cv) return;
        cv.width = width;
        cv.height = height;
      };
    



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
                        <Flex justifyContent={'center'}>
                        <Webcam
                        audio={false}
                        height={480}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={640}
                        videoConstraints={{
                            facingMode: facingMode,
                            // width: props.width,
                            // height: props.height,
                          }}
                          onLoadedMetadata={() => {
                            setWebcamCanvasOverlaySize();
                            originalSize.current = [
                              webcamRef.current!.video!.offsetWidth,
                              webcamRef.current!.video!.offsetHeight,
                            ] as number[];
                          }}
                          forceScreenshotSourceSize={true}
                        />
                        <canvas
                        id="cv1"
                        ref={videoCanvasRef}
                        style={{
                            position: "absolute",
                            zIndex: 10,
                            backgroundColor: "rgba(0,0,0,0)",
                            
                        }}
                        width={640}
                        height={480}
                        ></canvas>
                        </Flex>
                        
                     
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
                     Using model: yolov8n.onnx
                    </Text>
                </Flex>

                <Flex marginTop={5} justifyContent={'center'}>
                    <Stack spacing={3}>
                        <Text ml={2} fontWeight="bold" fontSize="lg" verticalAlign="middle" >
                        Detection Time: {isCameraOn ? detectionTime + " ms" : "-"}
                        </Text>
                        <Text ml={2} fontWeight="bold" fontSize="lg" verticalAlign="middle" >
                        FPS: {isCameraOn ? fps + " fps" : "-"}
                        </Text>
                        <Text ml={2} fontWeight="bold" fontSize="lg" verticalAlign="middle" >
                        Probability: {isCameraOn ? probability + "%" : "-"}
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
                            height={50}
                            >
                            <Text fontWeight="bold" fontSize="4xl">
                                {letter}
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
                Predicted Words, to be developed soon...
                */}
                {/* <Flex marginTop={20} justifyContent={'center'}>
                    <Text ml={2} fontWeight="bold" fontSize="4xl" verticalAlign="middle" >
                        Predicted Words: 
                    </Text>
                </Flex>
                <Flex marginTop={1} justifyContent={'center'}>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            borderRadius="10px"
                            width={700}
                            position="relative"
                            bg = {useColorModeValue('gray.100', 'gray.700')}
                            >
                            <Text fontWeight="bold" fontSize="4xl">
                                KENAPA BURUNG BISA TERBANG
                            </Text>
                        </Box>
                        
                     
                </Flex> */}
            </GridItem>
        </Grid>
    </Box>
            
        
    )
  }

  export default Main;