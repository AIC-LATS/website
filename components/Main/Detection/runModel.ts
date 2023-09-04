import { InferenceSession, Tensor } from "onnxruntime-web";
import _ from 'lodash';


export async function run_model(
  model: InferenceSession,
  nms: InferenceSession,
  preprocessedData: Tensor
): Promise<[any[], number, number, string]> {

  //create config file
  const config = new Tensor(
    "float32",
    new Float32Array([
      1, // topk per class
      0.40, // iou threshold
      0.6, // probability score threshold
    ])
  );
  
  try {

    const start = Date.now();
    const feeds: Record<string, Tensor> = {};
    feeds[model.inputNames[0]] = preprocessedData;
    const { output0 } = await model.run(feeds); // run session and get output layer
    const { selected } = await nms.run({ detection: output0, config: config }); // perform NMS and filter boxes
  
    const boxes = [];
    let prob = 0;
    let letter = ""
  
    // Looping pada output
    for (let idx = 0; idx < selected.dims[1]; idx++) {
      const data = selected.data.slice(idx * selected.dims[2], (idx + 1) * selected.dims[2]); // get rows
  
      // Definisikan tipe dari numericData
      const numericData: number[] = [];
  
      // Extract data as numbers and filter out non-numeric elements
      for (const item of data) {
        if (typeof item === 'string') {
          const parsed = parseFloat(item);
          if (!isNaN(parsed)) {
            numericData.push(parsed);
          }
        } else if (typeof item === 'number') {
          numericData.push(item);
        }
      }
  
      const box = numericData.slice(0, 4);
      const scores = numericData.slice(4); // class probability scores
  
      // Check if all elements in scores are numbers
      if (scores.some(item => typeof item !== 'number')) {
        throw new Error("Terdapat data non-numerik!");
      }
  
      const score = Math.max(...scores); // maximum probability score
      const label = scores.indexOf(score); // class id of maximum probability score
  
      const [x, y, w, h] = [
        (box[0] - 0.5 * box[2]) * 638/320, // upscale left
        (box[1] - 0.5 * box[3]) * 438/320, // upscale top
        box[2] * 638/320, // upscale width
        box[3] * 438/320, // upscale height
      ]; // keep boxes in maxSize range

      //add box to boxes
      boxes.push({
        label: label,
        probability: score,
        bounding: [x, y, w, h], // upscale box
      }); // update boxes to draw later

       // update probability to draw later
      prob = Math.round(score * 100)
      letter = (label < 26 ? String.fromCharCode(65 + label) : "space")
    }

    return [boxes, Date.now() - start, prob,letter];
  } 
    catch (e) {
    console.error(e);
    throw new Error();
  }
  
}

