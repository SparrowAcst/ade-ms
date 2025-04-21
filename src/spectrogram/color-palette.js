
const colorMap = [
    { p: 0, r: 255, g: 255, b: 255 },
    { p: 0.1, r: 0, g: 99, b: 147 },
    { p: 0.2, r: 53, g: 167, b: 182 },
    { p: 0.3, r: 0, g: 213, b: 191 },
    { p: 0.35, r: 21, g: 255, b: 232 },
    { p: 0.4, r: 255, g: 255, b: 15 },
    { p: 0.55, r: 244, g: 57, b: 11 },
    { p: 0.8, r: 255, g: 100, b: 100 },
    { p: 0.9, r: 255, g: 150, b: 150 },
    { p: 1, r: 255, g: 255, b: 255 }
  ]

const PALETTE_SIZE = 512
const valueScale = 1

const prepareColors = () => {
   
    let colors = []
     for (let k = 0; k < (colorMap.length - 1); k++) {
         let from = (colorMap)[k];
         let to = (colorMap)[k + 1];
         // Fill linear gradients between the adjacent keys
         let start = Math.trunc(from.p * PALETTE_SIZE);
         let end = Math.trunc(to.p * PALETTE_SIZE);
         let width = end - start;
         if (width <= 0) {
             continue;
         }
         let deltaR = (to.r - from.r) / width;
         let deltaG = (to.g - from.g) / width;
         let deltaB = (to.b - from.b) / width;
         for (let i = 0; i < width; i++) {
             colors.push([
                 Math.round(from.r + deltaR * i),
                 Math.round(from.g + deltaG * i),
                 Math.round(from.b + deltaB * i)
             ])
         }
     }
     return colors
}

 module.exports = createPalette = () => {

     if (!colorMap) {
         return;
     }

     colorMap.sort((a, b) => a.p - b.p);
     
     colors = prepareColors()
     
     return value => ({
         rgb: () => {
             const index = Math.trunc((value * valueScale) * (PALETTE_SIZE - 1))
             return colors[index] || [0,0,0]   
         }
     })

 }