// const { Jimp } = require('jimp');
// const { extend, mean, min, max } = require("lodash")
// const uuid = require('uuid');
// const fs = require("fs")
// const path = require('path');
// const wav = require("node-wav")
// const { ComplexArray, FFT } = require('./fft_js/fft.js');
// const chroma = require("chroma-js")
// const createPalette = require('./color-palette.js')
// const getOctaveBands = require("./octave-bands")
// // const bandsPerOctave = 48

// const DEFAULT_RATE = 4000
// const DATA_FORMAT = 'png' // jpeg is alternative if the size of packages will be bigger than we can afford, implies code changes as well!
// const JPEG_QUALITY = 95


// const filterWave = (buffer, rate) => {
//     const rateQuotient = Math.round(rate / DEFAULT_RATE);
//     return buffer.filter(
//         (value, index) => index % rateQuotient === 0
//     );
// }

// const FILTER = {
//     medium: value => Math.sqrt(value),
//     low: value => Math.pow(value, 2 / 3) 
// }


// const defaultOptions = {
//     filter: { name: '' },
//     amplifier: '',
//     cutOff: 0,
//     start: 0,
//     top: 5000, // frequency, hz
//     bottom: 20, // frequency, hz
//     fftWindowWidth: 512, // Should be an even integer.
//     fftExtendedWindowWidth: 4096, // Should be a power of 2. Also should be greater than or equal to fftWindowWidth.
//     fftWindowJump: 8,
//     imageFormat: DATA_FORMAT,
//     imageQuality: JPEG_QUALITY,
//     imageDir: ".",
//     imageSize: {
//         w: 1300,
//         h: 260
//     },
//     octave: false,
//     bandsPerOctave: 48,
//     colorPalette: createPalette(),
//     waveForm: {
//         period: 10, // 10px = 2*PI
//         chartTemplate: {
//             grid: {
//                 left: 0,
//                 right: 0,
//                 top: "20%",
//                 bottom: "20%"
//             },
//             xAxis: {
//                 type: 'category',
//                 axisLabel: {
//                     show: false
//                 }
//             },
//             yAxis: {
//                 type: 'value',
//                 axisLabel: {
//                     show: false
//                 }
//             },
//             series: [{
//                 data: [],
//                 type: 'line',
//                 color: "#90a4ae"
//             }]
//         }
//     }
// }


// const calculateBinInterval = (freqBottom, freqTop, windowWidth, sampleRate) => {

//     const freqBase = sampleRate / windowWidth;
//     let bottom = Math.ceil(freqBottom / freqBase);
//     const top = Math.floor(freqTop / freqBase);
//     bottom = bottom < 1 ? 1 : bottom;

//     return { bottom, top };

// }


// const getFFT = (audioData, windowPosition, windowWidth, extendedWindowWidth) => {

//     // Prepare the PCM segment to be passed to FFT
//     const segment = new ComplexArray(extendedWindowWidth);
//     const audioSegment = new Float32Array(extendedWindowWidth);


//     // Prepare the pcm segment to be passed to the FFT
//     const samplesPosition = (extendedWindowWidth - windowWidth) / 2; // All the involved variables should be even integers, so the result should be an integer. This is to avoid slight signal abberations on "half index" alignment.

//     // Take the values from original pcm signal.
//     let srcIndex = 0;
//     const maxSrcIndex = audioData.length;
//     for (let i = 0; i < windowWidth; i++) {
//         srcIndex = windowPosition + i;
//         if (srcIndex < 0 || srcIndex >= maxSrcIndex) {
//             // If the segment extends beyond the boundaries of the source pcm, which is possible when taking the transform near the edges, fill the missing values with zeroes.
//             audioSegment[samplesPosition + i] = 0;
//             continue;
//         }
//         audioSegment[samplesPosition + i] = audioData[srcIndex];
//     }

//     // Apply Hanning window if required
//     // Hanning width corresponds to the window width. That is hanning is applied only to the central part of the segment.
//     let hanningWindow = createHanningWindow(windowWidth);
//     // Apply it to the segment
//     for (let i = 0; i < windowWidth; i++) {
//         audioSegment[samplesPosition + i] *= hanningWindow[i];
//     }

//     segment.real = audioSegment;

//     // Apply the FFT
//     const complexResult = FFT(segment);
//     return complexResult.magnitude();

// }


// const createHanningWindow = size => {
//     const window = new Float32Array(size);
//     const phi = (Math.PI * 2) / (size - 1);
//     for (let i = 0; i < size; i++) {
//         window[i] = (1 - Math.cos(phi * i)) / 2;
//     }
//     return window;
// }


// const createMatrix = (width, height) => {
//     console.log("createMatrix", width, height)
//     const result = new Array(height)
//     for (let i = 0; i < height; i++) {
//         result[i] = new Array(width) // Uint8Array(A[0].length)
//     }
    
//     return result

// }

// const normalizeValues = (f32array2d, options) => {
 
//     // A short alias for the in/out array
//     const A = f32array2d;

//     const lowFiltered = createMatrix(A[0].length, A.length)

//     if(options.heapMemoryGuard) options.heapMemoryGuard.detectHeapOverflow("Allocate memory for lowFiltered data")

//     const mediumFiltered = createMatrix(A[0].length, A.length)
    
//     if(options.heapMemoryGuard) options.heapMemoryGuard.detectHeapOverflow("Allocate memory for mediumFiltered data")

 
//     // Find global maximum
//     let max = A[0][0];
//     for (let j = 0; j < A.length; j++) {
//         const row = A[j];
//         for (let i = 0; i < row.length; i++) {
//             if (max < row[i]) {
//                 max = row[i];
//             }
//         }
//     }
 
//     // Maximum is 0 - do nothing.
//     if (max === 0) {
//         return;
//     }
 
//     // const applyAmplify = value => Math.pow(value, 2 / 3)
//     const defaultCutOff = 0.00000000001
//     const applyCutoff = value => {
//         const res = (value - defaultCutOff)/(1 - defaultCutOff)
//         return (res < 0) ? 0 : res
//     }    
 
//     // Divide everyone by the maximum
//     const inverseMax = 1 / max;
//     for (let j = 0; j < A.length; j++) {
//         const row = A[j];
//         const lowFilteredRow = lowFiltered[j]
//         const mediumFilteredRow = mediumFiltered[j]
        
//         for (let i = 0; i < row.length; i++) {
//             let normalizedValue = Number.parseFloat(row[i]) * Number.parseFloat(inverseMax)
//             lowFilteredRow[i] = FILTER.low(normalizedValue)
//             mediumFilteredRow[i] = FILTER.medium(normalizedValue)
//         }
//     }
    

//     const bands = getOctaveBands(20, 2000, options.bandsPerOctave)
 
//     console.log(options.octave, bands.length)
    
//     const lowFilteredResult = createMatrix((options.octave) ? bands.length : A.length, A[0].length)
   
//     if(options.heapMemoryGuard) options.heapMemoryGuard.detectHeapOverflow("Allocate memory for lowFiltered result")

//     const mediumFilteredResult = createMatrix((options.octave) ? bands.length : A.length, A[0].length)
    
//     if(options.heapMemoryGuard) options.heapMemoryGuard.detectHeapOverflow("Allocate memory for mediumFiltered result")
    
//     if(options.octave){    
        
        
//         for(let t = 0; t < lowFiltered.length; t++){
//             for(let bandIndex = 0; bandIndex < bands.length; bandIndex++){
                
//                 lowFilteredResult[bandIndex,t] = mean(lowFiltered[t].slice(bands[bandIndex][0], bands[bandIndex][2]+1))
//                 mediumFilteredResult[bandIndex, t] = mean(mediumFiltered[t].slice(bands[bandIndex][0], bands[bandIndex][2]+1))
                
//             }
//         }

//     } else {
        
//         for(let t = 0; t < lowFiltered.length; t++){
//             for(let f = 0; f < lowFiltered[0].length; f++){
                
//                 lowFilteredResult[f, t] = lowFiltered[t, f]
//                 mediumFilteredResult[f, t] = mediumFiltered[f,t]
//             }
//         }
    
//     }        

//     console.log("width", lowFilteredResult[0].length,"height", lowFilteredResult.length)

//     return {
//         width: lowFilteredResult[0].length,
//         height: lowFilteredResult.length,
//         lowFiltered: lowFilteredResult,
//         mediumFiltered: mediumFilteredResult
//     }
// }

// const generate = (buffer, options) => new Promise((resolve, reject) => {
//     try {
        
//         let b = wav.decode(buffer)
//         let audioData = Array.prototype.slice.call(b.channelData[0])
//         audioData = filterWave(audioData, b.sampleRate)

//         options = extend({},
//             defaultOptions, {
//                 rate: b.sampleRate,
//                 end: audioData.length,
//             },
//             options
//         )

//         let {
//             //rate,
//             filter,
//             amplifier,
//             cutOff,
//             start,
//             end,
//             top,
//             bottom,
//             fftWindowWidth,
//             fftExtendedWindowWidth,
//             fftWindowJump
//         } = options

//         bottom = 20
//         top = 2000
//         const rate = 4096
//         // Validate frequency range exactly like frontend
//         // bottom = (bottom < 1) ? 1 : bottom
//         // bottom = (bottom > rate) ? rate : bottom
//         // top = (top < 1) ? 1 : top
//         // top = (top > rate) ? rate : top

//         const bins = calculateBinInterval(bottom, top, fftExtendedWindowWidth, rate)
//         const height = bins.top - bins.bottom + 1;
//         const jump = fftWindowJump;
//         const width = Math.trunc((end - start) / jump);

//         console.log(width, height)
//         // Create the empty spectrogram - 2-dimensional array of floats
//         // let spectrogram = new Array(height);
//         // for (let j = 0; j < height; j++) {
//         //     spectrogram[j] = new Float32Array(width);
//         // }

//         let spectrogram = new Array(width);
//         for (let j = 0; j < width; j++) {
//             spectrogram[j] = new Float32Array(height);
//         }

//         if(options.heapMemoryGuard) options.heapMemoryGuard.detectHeapOverflow("Allocate memory for spectrogram data")

//         // Fill the spectrogram by sliding FFT window
//         const align = -Math.trunc(fftWindowWidth / 2); // Center alignment of the FFT window.
//         for (let i = 0; i < width; i++) {
//             const windowPosition = start + i * jump + align;
//             const transform = getFFT(audioData, windowPosition, fftWindowWidth, fftExtendedWindowWidth);
//             spectrogram[i] = transform
//             // for (let j = 0; j < height; j++) {
//             //     spectrogram[height - j - 1][i] = transform[bins.bottom + j];
//             // }
//         }

//         spectrogram = normalizeValues(spectrogram, options);

//         resolve({
//             width: spectrogram.lowFiltered[0].length,
//             height: spectrogram.lowFiltered.length,
//             data: spectrogram,
//             rate: options.rate
//         })

//     } catch(e) {
//         reject(e)
//     }     
// })

// const generateImage = (spectrogram, rawData, options) => new Promise((resolve, reject) => {
//     try {
        
//         const width = spectrogram.data.width
//         const height = spectrogram.data.height
//         console.log("generateImage", width, height)
//         const data = Buffer.alloc(width * height * 4);
        
//         let offs = 0;
//         let amplitude = 0;
//         let color = 0;

//         for (let j = 0; j < height; j++) {
//             for (let i = 0; i < width; i++) {
//                 amplitude = rawData[j][i];
//                 if (options.colorPalette) {
//                     color = options.colorPalette(amplitude).rgb() //Math.trunc(amplitude * (0x200 - 1));

//                 } else {
//                     color = [amplitude, amplitude, amplitude]
//                 }

//                 data[offs] = color[0] // & 0xff;
//                 data[offs + 1] = color[1] //& 0xff
//                 data[offs + 2] = color[2] //& 0xff
//                 data[offs + 3] = 255
//                 offs += 4;
//             }
//         }

  
//         const rawImageData = {
//             data,
//             width,
//             height
//         };

//         const rawImage = Jimp.fromBitmap(rawImageData)
        
//         console.log(`Spectrogram size: ${rawImage.bitmap.width}, ${rawImage.bitmap.height}`)
//         resolve(rawImage)
    
//     } catch(e) {
//         reject(e)
//     } 

// })


// const generateWaveForm = (spectrogram, rawData, options) => new Promise((resolve, reject) => {

//     try {
//         const { width, height, rate } = spectrogram

//         let amplitude = []

//         for (let t = 0; t < width; t++) {

//             let currentSpectrum = []

//             for (let h = 0; h < height; h++) {
//                 currentSpectrum.push(rawData[h][t])
//             }

//             amplitude.push(mean(currentSpectrum))

//         }

//         const minValue = min(amplitude)
//         const maxValue = max(amplitude)

//         amplitude = amplitude.map(v => (v - minValue) / (maxValue - minValue))

//         // let values = amplitude.map((v, t) => v * Math.sin(t * 2 * Math.PI / options.waveForm.period))
//         // values = values.map(v => Number.parseFloat(v.toFixed(3)))
//         // let chart = JSON.parse(JSON.stringify(options.waveForm.chartTemplate))
//         // chart.series[0].data = values
//         resolve({
//             amplitude,
//             // chart,
//             rate
//         })

//     } catch(e) {
//         reject(e)
//     }    

// })

// const build = (buffer, options) => new Promise( async (resolve, reject) => {
//     try {
//         const newOptions = {
//           imageDir: ".",
//           imageFormat: "png",
//         };

//         options = extend({},
//             defaultOptions,
//             newOptions,
//             options,
//         )

//         let spectrogram = await generate(buffer, options)
//         spectrogram.image = {
//             lowFiltered: await generateImage(spectrogram, spectrogram.data.lowFiltered, options),
//             mediumFiltered: await generateImage(spectrogram, spectrogram.data.mediumFiltered, options),
//         }    
//         let wave = {
//             lowFiltered: await generateWaveForm(spectrogram, spectrogram.data.lowFiltered, options),
//             mediumFiltered: await generateWaveForm(spectrogram, spectrogram.data.mediumFiltered, options),
//         }    

//         resolve({
//             spectrogram,
//             wave
//         })
  
//     } catch(e) {
  
//         reject(e)
  
//     }    

// })


// module.exports = build

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const { Jimp } = require('jimp');
const { extend, mean, min, max } = require("lodash")
const uuid = require('uuid');
const fs = require("fs")
const path = require('path');
const wav = require("node-wav")
const { ComplexArray, FFT } = require('./fft_js/fft.js');
const chroma = require("chroma-js")
const createPalette = require('./color-palette.js')
const getOctaveBands = require("./octave-bands")

const DEFAULT_RATE = 4000
const DATA_FORMAT = 'png' // jpeg is alternative if the size of packages will be bigger than we can afford, implies code changes as well!
const JPEG_QUALITY = 95


const filterWave = (buffer, rate) => {
    const rateQuotient = Math.round(rate / DEFAULT_RATE);
    return buffer.filter(
        (value, index) => index % rateQuotient === 0
    );
}

const FILTER = {
    medium: value => Math.sqrt(value),
    low: value => Math.pow(value, 2 / 3) 
}


const defaultOptions = {
    filter: { name: '' },
    amplifier: '',
    cutOff: 0,
    start: 0,
    top: 5000, // frequency, hz
    bottom: 20, // frequency, hz
    fftWindowWidth: 512, // Should be an even integer.
    fftExtendedWindowWidth: 4096, // Should be a power of 2. Also should be greater than or equal to fftWindowWidth.
    fftWindowJump: 8,
    imageFormat: DATA_FORMAT,
    imageQuality: JPEG_QUALITY,
    imageDir: ".",
    imageSize: {
        w: 1300,
        h: 260
    },
    colorPalette: createPalette(),
    waveForm: {
        period: 10, // 10px = 2*PI
        chartTemplate: {
            grid: {
                left: 0,
                right: 0,
                top: "20%",
                bottom: "20%"
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: false
                }
            },
            series: [{
                data: [],
                type: 'line',
                color: "#90a4ae"
            }]
        }
    }
}


const calculateBinInterval = (freqBottom, freqTop, windowWidth, sampleRate) => {

    const freqBase = sampleRate / windowWidth;
    let bottom = Math.ceil(freqBottom / freqBase);
    const top = Math.floor(freqTop / freqBase);
    bottom = bottom < 1 ? 1 : bottom;

    return { bottom, top };

}


const getFFT = (audioData, windowPosition, windowWidth, extendedWindowWidth) => {

    // Prepare the PCM segment to be passed to FFT
    const segment = new ComplexArray(extendedWindowWidth);
    const audioSegment = new Float32Array(extendedWindowWidth);


    // Prepare the pcm segment to be passed to the FFT
    const samplesPosition = (extendedWindowWidth - windowWidth) / 2; // All the involved variables should be even integers, so the result should be an integer. This is to avoid slight signal abberations on "half index" alignment.

    // Take the values from original pcm signal.
    let srcIndex = 0;
    const maxSrcIndex = audioData.length;
    for (let i = 0; i < windowWidth; i++) {
        srcIndex = windowPosition + i;
        if (srcIndex < 0 || srcIndex >= maxSrcIndex) {
            // If the segment extends beyond the boundaries of the source pcm, which is possible when taking the transform near the edges, fill the missing values with zeroes.
            audioSegment[samplesPosition + i] = 0;
            continue;
        }
        audioSegment[samplesPosition + i] = audioData[srcIndex];
    }

    // Apply Hanning window if required
    // Hanning width corresponds to the window width. That is hanning is applied only to the central part of the segment.
    let hanningWindow = createHanningWindow(windowWidth);
    // Apply it to the segment
    for (let i = 0; i < windowWidth; i++) {
        audioSegment[samplesPosition + i] *= hanningWindow[i];
    }

    segment.real = audioSegment;

    // Apply the FFT
    const complexResult = FFT(segment);
    return complexResult.magnitude();

}


const createHanningWindow = size => {
    const window = new Float32Array(size);
    const phi = (Math.PI * 2) / (size - 1);
    for (let i = 0; i < size; i++) {
        window[i] = (1 - Math.cos(phi * i)) / 2;
    }
    return window;
}


const createMatrix = (width, height) => {
    
    const result = new Array(height)
    for (let i = 0; i < height; i++) {
        result[i] = new Array(width) // Uint8Array(A[0].length)
    }
    
    return result

}


const reduceWithBands = (data, options) => {

    const bands = getOctaveBands(20, 2000, options.bandsPerOctave || 48) 
    let result = createMatrix(bands.length, data.length)

    for( let t = 0; t < data.length; t++){
        result[t] = bands.map( band => {
            return mean(data[t].slice(band[0], band[2]+1))
        })
    }
 
    return result
}


const rotate = data => {
    result = createMatrix(data.length, data[0].length)
    for(let i = 0; i < data.length; i++)
        for (let j = 0; j < data[0].length; j++) {
            result[result.length - j - 1][i] = data[i,j];
        }
    return result        
}

const normalizeValues = (f32array2d, options) => {
 
    // A short alias for the in/out array
    const A = f32array2d;

    let lowFiltered = createMatrix(A[0].length, A.length)

    if(options.heapMemoryGuard) options.heapMemoryGuard.detectHeapOverflow("Allocate memory for lowFiltered data")

    let mediumFiltered = createMatrix(A[0].length, A.length)
    
    if(options.heapMemoryGuard) options.heapMemoryGuard.detectHeapOverflow("Allocate memory for mediumFiltered data")

 
    // Find global maximum
    let max = A[0][0];
    for (let j = 0; j < A.length; j++) {
        const row = A[j];
        for (let i = 0; i < row.length; i++) {
            if (max < row[i]) {
                max = row[i];
            }
        }
    }
 
    // Maximum is 0 - do nothing.
    if (max === 0) {
        return;
    }
 
    // const applyAmplify = value => Math.pow(value, 2 / 3)
    const defaultCutOff = 0.00000000001
    const applyCutoff = value => {
        const res = (value - defaultCutOff)/(1 - defaultCutOff)
        return (res < 0) ? 0 : res
    }    
 
    // Divide everyone by the maximum
    const inverseMax = 1 / max;
    for (let j = 0; j < A.length; j++) {
        const row = A[j];
        const lowFilteredRow = lowFiltered[j]
        const mediumFilteredRow = mediumFiltered[j]
        
        for (let i = 0; i < row.length; i++) {
            let normalizedValue = Number.parseFloat(row[i]) * Number.parseFloat(inverseMax)
            lowFilteredRow[i] = FILTER.low(normalizedValue)
            mediumFilteredRow[i] = FILTER.medium(normalizedValue)
        }
    }
 
    if(options.octave){
        lowFiltered = reduceWithBands(lowFiltered, options)
        mediumFiltered = reduceWithBands(mediumFiltered, options)
    }

    // lowFiltered = rotate(lowFiltered)
    // mediumFiltered = rotate(mediumFiltered)
    
    return {
        lowFiltered,
        mediumFiltered
    }
}

const WaveFile = require('wavefile').WaveFile;
const generate = (buffer, options) => new Promise((resolve, reject) => {
    try {
        console.log("!!!", buffer.length)
        let b = new WaveFile(buffer)
        console.log(b.fmt.sampleRate);
// console.log(b.data);
// console.log(b.fmt.chunkId);
        // return
        // let b = wav.decode(buffer)
        // console.log("b", b)

        let audioData = Array.prototype.slice.call(b.data.samples) //Array.prototype.slice.call(b.channelData[0])
        console.log(audioData)     
        audioData = filterWave(audioData, b.fmt.sampleRate)
        console.log(audioData)     


        options = extend({},
            defaultOptions, {
                rate: b.fmt.sampleRate,
                end: audioData.length,
            },
            options
        )

        let {
            //rate,
            filter,
            amplifier,
            cutOff,
            start,
            end,
            top,
            bottom,
            fftWindowWidth,
            fftExtendedWindowWidth,
            fftWindowJump
        } = options

        bottom = 20
        top = 2000
        const rate = 4096
        // Validate frequency range exactly like frontend
        // bottom = (bottom < 1) ? 1 : bottom
        // bottom = (bottom > rate) ? rate : bottom
        // top = (top < 1) ? 1 : top
        // top = (top > rate) ? rate : top

        const bins = calculateBinInterval(bottom, top, fftExtendedWindowWidth, rate)
        const height = bins.top - bins.bottom + 1;
        const jump = fftWindowJump;
        const width = Math.trunc((end - start) / jump);

        // Create the empty spectrogram - 2-dimensional array of floats
        let spectrogram = new Array(width);
        for (let j = 0; j < width; j++) {
            spectrogram[j] = new Float32Array(height);
        }

        if(options.heapMemoryGuard) options.heapMemoryGuard.detectHeapOverflow("Allocate memory for spectrogram data")

        // Fill the spectrogram by sliding FFT window
        const align = -Math.trunc(fftWindowWidth / 2); // Center alignment of the FFT window.
        for (let i = 0; i < width; i++) {
            const windowPosition = start + i * jump + align;
            const transform = getFFT(audioData, windowPosition, fftWindowWidth, fftExtendedWindowWidth);
            spectrogram[i] = transform
            // for (let j = 0; j < height; j++) {
            //     spectrogram[height - j - 1][i] = transform[bins.bottom + j];
            // }
        }

        spectrogram = normalizeValues(spectrogram, options);

        resolve({
            width: spectrogram.lowFiltered[0].length,
            height: spectrogram.lowFiltered.length,
            data: spectrogram,
            rate: options.rate
        })

    } catch(e) {
        reject(e)
    }     
})

const generateImage = (spectrogram, rawData, options) => new Promise((resolve, reject) => {
    try {
        
        const width =  rawData[0].length //spectrogram.width
        const height = rawData.length //spectrogram.height

        const data = Buffer.alloc(width * height * 4);
        
        let offs = 0;
        let amplitude = 0;
        let color = 0;

        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                amplitude = rawData[j][i];
                if (options.colorPalette) {
                    color = options.colorPalette(amplitude).rgb() //Math.trunc(amplitude * (0x200 - 1));

                } else {
                    color = [amplitude, amplitude, amplitude]
                }

                data[offs] = color[0] // & 0xff;
                data[offs + 1] = color[1] //& 0xff
                data[offs + 2] = color[2] //& 0xff
                data[offs + 3] = 255
                offs += 4;
            }
        }

  
        const rawImageData = {
            data,
            width,
            height
        };

        const rawImage = Jimp.fromBitmap(rawImageData)
        
        console.log(`Spectrogram size: ${rawImage.bitmap.width}, ${rawImage.bitmap.height}`)
        resolve(rawImage)
    
    } catch(e) {
        reject(e)
    } 

})


const generateWaveForm = (spectrogram, rawData, options) => new Promise((resolve, reject) => {

    try {
        const { width, height, rate } = spectrogram

        let amplitude = []

        for (let t = 0; t < width; t++) {

            let currentSpectrum = []

            for (let h = 0; h < height; h++) {
                currentSpectrum.push(rawData[h][t])
            }

            amplitude.push(mean(currentSpectrum))

        }

        const minValue = min(amplitude)
        const maxValue = max(amplitude)

        amplitude = amplitude.map(v => (v - minValue) / (maxValue - minValue))

        // let values = amplitude.map((v, t) => v * Math.sin(t * 2 * Math.PI / options.waveForm.period))
        // values = values.map(v => Number.parseFloat(v.toFixed(3)))
        // let chart = JSON.parse(JSON.stringify(options.waveForm.chartTemplate))
        // chart.series[0].data = values
        resolve({
            amplitude,
            // chart,
            rate
        })

    } catch(e) {
        reject(e)
    }    

})

const build = (buffer, options) => new Promise( async (resolve, reject) => {
    try {
        const newOptions = {
          imageDir: ".",
          imageFormat: "png",
        };

        options = extend({},
            defaultOptions,
            newOptions,
            options,
        )

        let spectrogram = await generate(buffer, options)
        spectrogram.image = {
            lowFiltered: await generateImage(spectrogram, spectrogram.data.lowFiltered, options),
            mediumFiltered: await generateImage(spectrogram, spectrogram.data.mediumFiltered, options),
        }    
        let wave = {
            lowFiltered: await generateWaveForm(spectrogram, spectrogram.data.lowFiltered, options),
            mediumFiltered: await generateWaveForm(spectrogram, spectrogram.data.mediumFiltered, options),
        }    

        resolve({
            spectrogram,
            wave
        })
  
    } catch(e) {
  
        reject(e)
  
    }    

})


module.exports = build

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

const s3 = require("../utils/s3-bucket")

const run = async () => {

    const id = "a5934a3c-a193-4a46-be82-3a348fd16aa3"
    const bandsPerOctave = null ///144


    console.log(id, bandsPerOctave)
    // heapMemoryGuard.detectHeapOverflow("Start")            
    const stream = await s3.getObjectStream(`ADE-RECORDS/${id}.wav`);
    console.log(1)
    // heapMemoryGuard.detectHeapOverflow("Allocate memory for stream")
    const buffer = await streamToBuffer(stream);
    // heapMemoryGuard.detectHeapOverflow("Allocate memory for buffer")
    console.log(2)
    
    // console.log(heapMemoryGuard.metrics())
    // console.log("buffer size:", (buffer.length/1024/1024).toFixed(2))

    // const visualisation = await build(buffer, { octave: true, bandsPerOctave })
    const visualisation = await build(buffer, { octave: false, bandsPerOctave })
    
    console.log("ok")
    await visualisation.spectrogram.image.lowFiltered.write(`${id}.low.${bandsPerOctave}.png`);
    await visualisation.spectrogram.image.mediumFiltered.write(`${id}.medium.${bandsPerOctave}.png`);        

}


run()
////////////////////////////////////////////////////////////////////////////////////////////////


// var wavFileInfo = require('wav-file-info');
 
// wavFileInfo.infoByFilename('./a5934a3c-a193-4a46-be82-3a348fd16aa3.wav', function(err, info){
//   if (err) throw err;
//   console.log(info);
// });