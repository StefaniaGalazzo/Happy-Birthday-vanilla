// gain-processor.js

class GainProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: "gain", defaultValue: 1 }];
  }

  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const gain = parameters.gain;

    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; ++i) {
        outputChannel[i] = inputChannel[i] * gain[i];
      }
    }

    return true;
  }
}

registerProcessor("gain-processor", GainProcessor);

// import { AudioWorkletProcessor } from "standardized-audio-context"; // Import the AudioWorkletProcessor

// class BlowProcessor extends AudioWorkletProcessor {
//   process(inputs, outputs, parameters) {
//     // Process the audio data
//     const input = inputs[0];
//     let sum = 0;

//     for (let i = 0; i < input[0].length; i++) {
//       sum += Math.abs(input[0][i]);
//     }

//     const averageVolume = sum / input[0].length;

//     // Define the loudness threshold
//     const loudnessThreshold = 50; // This value can be adjusted

//     // Check if the average volume exceeds the loudness threshold
//     if (averageVolume > loudnessThreshold) {
//       // Candle is "blown out" - you can perform actions here
//       console.log("Candle blown out!");
//     }

//     return true;
//   }
// }

// // Register the processor
// registerProcessor("blow-processor", BlowProcessor);
