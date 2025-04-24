// 61. ISO. ISO 266, Acoustics—Preferred frequencies for measurements. 1997.

// Preferred octave frequency bands according to the ISO standard [61].

let oneFreq =[
    [22, 31.5, 44],
    [44, 63, 88],
    [88, 125, 177],
    [177, 250, 355],
    [355, 500, 710],
    [710, 1000, 1420],
    [1420, 2000, 2840],
    [2840, 4000, 5680],
    [5680, 8000, 11360],
    [11360, 16000, 22720]
]


// [                                                                                                                           
//   [ 22, 31.11269837220809, 44 ],                                                                                            
//   [ 44, 62.22539674441618, 88 ],                                                                                            
//   [ 88, 124.45079348883236, 176 ],                                                                                          
//   [ 176, 248.90158697766472, 352 ],                                                                                         
//   [ 352, 497.80317395532944, 704 ],                                                                                         
//   [ 704, 995.6063479106589, 1408 ],                                                                                         
//   [ 1408, 1991.2126958213178, 2816 ],                                                                                       
//   [ 2816, 3982.4253916426355, 5632 ],                                                                                       
//   [ 5632, 7964.850783285271, 11264 ],                                                                                       
//   [ 11264, 15929.701566570542, 22528 ],                                                                                     
//   [ 22528, 31859.403133141084, 45056 ]                                                                                      
// ] 

// ISO standard for one-third octave frequency bands [61]. The center frequencies are highlighted
// with bold font.
let oneThirdFreq = [
    [22.4, 25, 28.2], 
    [28.2, 31.5, 35.5], 
    [35.5, 40, 44.7], 
    [44.7, 50, 56.2], 
    [56.2, 63, 70.8], 
    [70.8, 80, 89.1], 
    [89.1, 100, 112], 
    [112, 125, 141], 
    [141, 160, 178], 
    [178, 200, 224], 
    [224, 250, 282], 
    [282, 315, 355], 
    [355, 400, 447], 
    [447, 500, 562], 
    [562, 630, 708], 
    [708, 800, 891],
    [891, 1000, 1122],
    [1122, 1250, 1413],
    [1413, 1600, 1778],
    [1778, 2000, 2239],
    [2239, 2500, 2818],
    [2818, 3150, 3548],
    [3548, 4000, 4467],
    [4467, 5000, 5623],
    [5623, 6300, 7079],
    [7079, 8000, 8913],
    [8913, 10000, 11220],
    [11220, 12500, 14130],
    [14130, 16000, 17780],
    [17780, 20000, 22390]
]

const oneAliases = ["one", "1", "One", "ONE"]
const oneThirdAliases = ["one-thrid", "1/3", "one thrid", "ONE THRID"]

// const generateBands = (lowFrequency, highFrequency, bandsPetOctave) => {
//     let result = []
//     lowFrequency = lowFrequency || 20
//     highFrequency = highFrequency || 20000
//     bandsPetOctave = bandsPetOctave || 1
//     const step = Math.pow(2, 1/bandsPetOctave)
//     for(let l = lowFrequency; l < highFrequency; ){
//         let h = l * step
//         // result.push([l, Math.sqrt(l*h), h])
//         result.push([Math.round(l), Math.round((l+h)/2), Math.round(h)])
//         l = h
//     }
//     return result
// }

const generateBands = (lowFrequency, highFrequency, bandsPetOctave) => {
    let result = []
    lowFrequency = lowFrequency || 20
    highFrequency = highFrequency || 20000
    bandsPetOctave = bandsPetOctave || 1
    const step = bandsPetOctave //Math.pow(2, 1/bandsPetOctave)
    for(let l = lowFrequency; l < highFrequency; ){
        let h = l + step
        // result.push([l, Math.sqrt(l*h), h])
        result.push([Math.round(l), Math.round((l+h)/2), Math.round(h)])
        l = h
    }
    return result
}



let getFrequencyBands = (mode, lo, hi) => {
    mode = mode || "one" // one-thrid
    mode = (oneAliases.concat(oneThirdAliases).includes(mode)) ? mode : "one"
    lo = lo || 0
    hi = hi || Infinity

    let res = ((oneAliases.includes(mode)) ? oneFreq : oneThirdFreq)
                .filter( d => d[0] >= lo && d[2] <= hi)
                .map(d => ({
                    f: `${d[1]} Hz`,
                    lf: d[0],
                    mf: d[1],
                    hf: d[2]
                }))
    return res            
}


module.exports = generateBands

// const b12 = generateBands(20, 4000, 12)
// const b24 = generateBands(20, 4000, 24)

// console.log(b12)
// console.log(b24)

// console.log(b12.length, b24.length)

