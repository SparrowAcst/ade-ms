// const cluster = require('cluster');
const v8 = require('v8');

const toMB = size => Math.round(size / 1024 / 1024 * 100) / 100;


const heapGuard = ({ heapSizeLimit, heapSizeFactor, interval = 1000, callback = (() => {}) }) => {
    
    const initialStats = v8.getHeapStatistics();
    
    Object.keys(initialStats).forEach(key => initialStats[key] = toMB(initialStats[key]));
    const totalHeapSizeThreshold = (heapSizeFactor) ? initialStats.heap_size_limit * heapSizeFactor : heapSizeLimit;
    
    console.log(`Create Heap Memory Guard: ${totalHeapSizeThreshold.toFixed(2)}MB`)    
    
    let detectHeapOverflow = message => {
        let stats = v8.getHeapStatistics();
        Object.keys(stats).forEach(key => stats[key] = toMB(stats[key]));

        // heap size allocated by V8. This can grow if usedHeap needs more.
        message = message || `Every ${interval} ms`
        console.log(`Heap Memory Guard - ${message}: ${stats.total_heap_size}MB (${ (100 * stats.total_heap_size / totalHeapSizeThreshold ).toFixed(1)}%)`);

        // total_heap_size: Number of bytes V8 has allocated for the heap. This can grow if used_heap_size needs more.
        // we'll detect when it's growing above some threshold and kill the worker in such case
        if ((stats.total_heap_size) > totalHeapSizeThreshold) {
            callback()
            // process.exit();
        }
    }

    return {
        interval: setInterval(detectHeapOverflow, interval),
        detectHeapOverflow
    }

} 

module.exports = heapGuard
