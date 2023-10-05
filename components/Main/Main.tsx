'use client'
import Webcam from "react-webcam";
import {
    Box,
    Flex,
    CircularProgress,
    HStack,
    Text,
    Button,
    Stack,
    Grid,
    GridItem,
    Image
  } from '@chakra-ui/react'
import { useState,
        useRef,
        useEffect
} from "react";
import { set } from "lodash";
import { useColorModeValue } from '@chakra-ui/color-mode';
import {loading} from "./utils/type"
import {detect} from "./utils/detect"
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';




const Main2 = (props:any) => {

    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    const [probability, setProbability] = useState<string>("");
    const [letter, setLetter] = useState<string>("");
    const [detectionTime, setDetectionTime] = useState<number>(0);
    const [facingMode, setFacingMode] = useState<string>("environment");
    const [fps, setFps] = useState<string>("");
    const [word, setWord] = useState<string>("");
    const [loading, setLoading] = useState<loading>({isLoading: true, progress: 0});
    const [model, setModel] = useState<any>(null);

    const videoCanvasRef = useRef<HTMLCanvasElement>(null);
    const liveDetection = useRef<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const letterRef = useRef<string>("");
    const wordRef = useRef<string>("");
    const letterTimeRef = useRef<number>(0);
    const isAddWord = useRef<boolean>(true);
    const originalSize = useRef<number[]>([0, 0]);
    const isFirstTime = useRef<boolean>(true);
    
    const modelName = "yolov8n";
    const modelPath = `../${modelName}/model.json`
          // model configs
  
 
    useEffect(() => {
        tf.setBackend('webgl').then(async () => {
            tf.ready().then(async () => {
                const yolov8  = await tf.loadGraphModel(
                    modelPath,
                    {
                    onProgress: (fractions) => {
                        setLoading({ isLoading: true, progress: fractions }); // set loading fractions
                    },
                    }
                ); // load model
        
                // warming up model
                let shape : any = yolov8.inputs[0].shape
                const dummyInput = tf.ones(shape);
                const warmupResults = yolov8.execute(dummyInput);
        
                setLoading({ isLoading: false, progress: 1 });
                setModel({
                    net: yolov8,
                    inputShape: shape,
                });
                
        
                tf.dispose([warmupResults, dummyInput]); // cleanup memory
                });
        })
        
    }, []);


    const handleWord = (chr: string, detectTime : number) => {
        if(chr !== ""){
            if(chr == letterRef.current){
                letterTimeRef.current += detectTime;
                if(letterTimeRef.current >= 800 && isAddWord.current){
                    wordRef.current += (chr == 'space') ? " " : chr;
                    setWord(wordRef.current);
                    isAddWord.current = false;
                }
            }
            else{
                letterTimeRef.current = 0;
                isAddWord.current = true;
            }
        }
        else{
            letterTimeRef.current = 0;
            isAddWord.current = true;
        }
        
    }
    
    const startDetection = async () => {    
        console.log("start")
        setIsCameraOn(true);
        liveDetection.current = true;
            while (liveDetection.current) {
                try{
                    let tic = Date.now();
                    let [label,prob] = await detect(webcamRef.current!.video!, model, videoCanvasRef.current!);
                    const fps:number = 1000 / (Date.now() - tic);
                    setDetectionTime(Date.now() - tic);
                    setFps(fps.toFixed(3));
                    setProbability((prob*100).toFixed(3));
                    setLetter(label);
                    if(isFirstTime.current){
                        letterRef.current = label;
                        isFirstTime.current = false;
                    }
                    else{
                        handleWord(label, Date.now() - tic);
                        letterRef.current = label;
                    }
                   
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
        setWord("");
        setLetter("");
        setProbability("");
        setDetectionTime(0);
        setFps("");
        letterRef.current = "";
        wordRef.current = "";
        letterTimeRef.current = 0; 
        isAddWord.current = true;
        isFirstTime.current = true;
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
        {
            loading.isLoading ? (
                <Flex
                justifyContent={'center'}
                alignItems={'center'}
                height={'100vh'}
                >
                <CircularProgress  value = {Math.round(loading.progress * 100)} color="blue.300" />
                <Stack spacing={3} textAlign={'center'}>
                    <Text fontWeight={600}>Loading Model...</Text>
                    <Text fontWeight={600}>{Math.round(loading.progress * 100)}%</Text>
                </Stack>
                </Flex>
            ) : (
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
                    Predicted Letter & Word
                    */}
                    <Flex marginTop={10} justifyContent={'center'}>
                        <Stack spacing={1} align={'center'} justify={'center'}>
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
                                width={200}
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
                            <Text ml={2} fontWeight="bold" fontSize="4xl" verticalAlign="middle" >
                            Predicted words: 
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
                                    {word}
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
    
                </GridItem>
            </Grid>
            )
        }
       
    </Box>
            
        
    )
  }

  export default Main2;