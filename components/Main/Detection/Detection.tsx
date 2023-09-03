

import { Tensor, InferenceSession } from "onnxruntime-web";
import ndarray from "ndarray";
import ops from "ndarray-ops";
import { round } from "lodash";
import { useState, useEffect} from "react";
import { classes } from "./Class";
import Main from "../Main"

import * as func from "../../../function/function"

const modelName = "yolov8n.onnx";
const modelNms =  "nms-yolov8.onnx"
const modelResolution = [320, 320];

const Detection = () =>{

  
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    const getSession = async () => {

      const yolov8 = await InferenceSession.create('./_next/static/chunks/pages/'+ modelName, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });

      const nms = await InferenceSession.create('./_next/static/chunks/pages/'+ modelNms, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });

      const session = {
        model: yolov8,
        nms: nms
      }

      setSession(session);
    };
    getSession();
  }, [modelName]);


  const resizeCanvasCtx = (
      ctx: CanvasRenderingContext2D,
      targetWidth: number,
      targetHeight: number,
      inPlace = false
      ) => {
      let canvas: HTMLCanvasElement;

      if (inPlace) {
        // Get the canvas element that the context is associated with
        canvas = ctx.canvas;

        // Set the canvas dimensions to the target width and height
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        console.log(canvas.clientWidth, canvas.clientHeight)
        // Scale the context to the new dimensions
        ctx.scale(
          targetWidth / canvas.clientWidth,
          targetHeight / canvas.clientHeight
        );
      } else {
        // Create a new canvas element with the target dimensions
        canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw the source canvas into the target canvas
        canvas
          .getContext("2d")!
          .drawImage(ctx.canvas, 0, 0, targetWidth, targetHeight);

        // Get a new rendering context for the new canvas
        ctx = canvas.getContext("2d")!;
      }

      return ctx;
    };

    //Preprocessing
    const preprocessing = (ctx: CanvasRenderingContext2D) => {

        const resizedCtx = resizeCanvasCtx(
          ctx,
          modelResolution[0],
          modelResolution[1]
        );
    
        const imageData = resizedCtx.getImageData(
          0,
          0,
          modelResolution[0],
          modelResolution[1]
        );
        const { data, width, height } = imageData;
        
        
        // data processing
        const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
        const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
          1,
          3,
          width,
          height,
        ]);
    
        ops.assign(
          dataProcessedTensor.pick(0, 0, null, null),
          dataTensor.pick(null, null, 0)
        );
        ops.assign(
          dataProcessedTensor.pick(0, 1, null, null),
          dataTensor.pick(null, null, 1)
        );
        ops.assign(
          dataProcessedTensor.pick(0, 2, null, null),
          dataTensor.pick(null, null, 2)
        );
    
        ops.divseq(dataProcessedTensor, 255);
    
        const tensor = new Tensor("float32", new Float32Array(width * height * 3), [
          1,
          3,
          width,
          height,
        ]);
    
        (tensor.data as Float32Array).set(dataProcessedTensor.data);
        return tensor;
      };

      

      const postprocessing = (
        box: any[],
        ctx: CanvasRenderingContext2D
      ) => {
    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let i = 0; i < box.length; i++) {
          [box[i].probability] = [box[i].probability].map((x: any) => round(x * 100, 1));
          const label =
            classes[box[i].label].toString()[0].toUpperCase() +
            classes[box[i].label].toString().substring(1) +
            " " +
            box[i].probability.toString() +
            "%";
          const color = func.conf2color(box[i].label / 27);

          let [x1,y1,width,height] = [box[i].bounding[0],box[i].bounding[1],box[i].bounding[2],box[i].bounding[3]]
    
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.strokeRect(x1,y1,width,height);
          ctx.font = "18px Arial";
          ctx.fillStyle = color;
          ctx.fillText(label, x1 , y1 - 5);
    
          // fillrect with transparent color
          ctx.fillStyle = color.replace(")", ", 0.2)").replace("rgb", "rgba");
          ctx.fillRect(x1,y1,width,height);
        }
      };


      return (
        <Main
          session={session}
          postprocess={postprocessing}
          preprocess={preprocessing}
        />
      );
      
      
}
export default Detection;