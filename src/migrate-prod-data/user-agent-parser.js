const { uniqBy, sortBy, keys, find } = require("lodash")

const decodeModel = {
    "iPhone1,1": 		"iPhone",
    "iPhone1,2": 		"iPhone 3G",
    "iPhone2,1": 		"iPhone 3GS",
    "iPhone3,1": 		"iPhone 4",
    "iPhone3,2": 		"iPhone 4 GSM Rev A",
    "iPhone3,3": 		"iPhone 4 CDMA",
    "iPhone4,1": 		"iPhone 4S",
    "iPhone5,1": 		"iPhone 5 (GSM)",
    "iPhone5,2": 		"iPhone 5 (GSM+CDMA)",
    "iPhone5,3": 		"iPhone 5C (GSM)",
    "iPhone5,4": 		"iPhone 5C (Global)",
    "iPhone6,1": 		"iPhone 5S (GSM)",
    "iPhone6,2": 		"iPhone 5S (Global)",
    "iPhone7,1": 		"iPhone 6 Plus",
    "iPhone7,2": 		"iPhone 6",
    "iPhone8,1": 		"iPhone 6s",
    "iPhone8,2": 		"iPhone 6s Plus",
    "iPhone8,4": 		"iPhone SE (GSM)",
    "iPhone9,1": 		"iPhone 7",
    "iPhone9,2": 		"iPhone 7 Plus",
    "iPhone9,3": 		"iPhone 7",
    "iPhone9,4": 		"iPhone 7 Plus",
    "iPhone10,1": 		"iPhone 8",
    "iPhone10,2": 		"iPhone 8 Plus",
    "iPhone10,3": 		"iPhone X Global",
    "iPhone10,4": 		"iPhone 8",
    "iPhone10,5": 		"iPhone 8 Plus",
    "iPhone10,6": 		"iPhone X GSM",
    "iPhone11,2": 		"iPhone XS",
    "iPhone11,4": 		"iPhone XS Max",
    "iPhone11,6": 		"iPhone XS Max Global",
    "iPhone11,8": 		"iPhone XR",
    "iPhone12,1": 		"iPhone 11",
    "iPhone12,3": 		"iPhone 11 Pro",
    "iPhone12,5": 		"iPhone 11 Pro Max",
    "iPhone12,8": 		"iPhone SE 2nd Gen",
    "iPhone13,1": 		"iPhone 12 Mini",
    "iPhone13,2": 		"iPhone 12",
    "iPhone13,3": 		"iPhone 12 Pro",
    "iPhone13,4": 		"iPhone 12 Pro Max",
    "iPhone14,2": 		"iPhone 13 Pro",
    "iPhone14,3": 		"iPhone 13 Pro Max",
    "iPhone14,4": 		"iPhone 13 Mini",
    "iPhone14,5": 		"iPhone 13",
    "iPhone14,6": 		"iPhone SE 3rd Gen",
    "iPhone14,7": 		"iPhone 14",
    "iPhone14,8": 		"iPhone 14 Plus",
    "iPhone15,2": 		"iPhone 14 Pro",
    "iPhone15,3": 		"iPhone 14 Pro Max",
    "iPhone15,4": 		"iPhone 15",
    "iPhone15,5": 		"iPhone 15 Plus",
    "iPhone16,1": 		"iPhone 15 Pro",
    "iPhone16,2": 		"iPhone 15 Pro Max",
    "iPhone17,1": 		"iPhone 16 Pro",
    "iPhone17,2": 		"iPhone 16 Pro Max",
    "iPhone17,3": 		"iPhone 16",
    "iPhone17,4": 		"iPhone 16 Plus",
    "iPod5,1": 			"iPod touch (5th generation)",
    "iPod7,1": 			"iPod touch (6th generation)",
    "iPod9,1": 			"iPod touch (7th generation)",
    "iPad2,1": 			"iPad 2",
    "iPad2,2": 			"iPad 2",
    "iPad2,3": 			"iPad 2",
    "iPad2,4": 			"iPad 2",
    "iPad3,1": 			"iPad (3rd generation)",
    "iPad3,2": 			"iPad (3rd generation)",
    "iPad3,3": 			"iPad (3rd generation)",
    "iPad3,4": 			"iPad (4th generation)",
    "iPad3,5": 			"iPad (4th generation)",
    "iPad3,6": 			"iPad (4th generation)",
    "iPad6,11": 		"iPad (5th generation)",
    "iPad6,12": 		"iPad (5th generation)",
    "iPad7,5": 			"iPad (6th generation)",
    "iPad7,6":	 		"iPad (6th generation)",
    "iPad7,11": 		"iPad (7th generation)",
    "iPad7,12": 		"iPad (7th generation)",
    "iPad11,6": 	    "iPad (8th generation)",
    "iPad11,7": 		"iPad (8th generation)",
    "iPad12,1": 		"iPad (9th generation)",
    "iPad12,2": 		"iPad (9th generation)",
    "iPad13,18": 		"iPad (10th generation)",
    "iPad13,19": 		"iPad (10th generation)",
    "iPad4,1": 			"iPad Air",
    "iPad4,2": 			"iPad Air",
    "iPad4,3": 			"iPad Air",
    "iPad5,3": 			"iPad Air 2",
    "iPad5,4": 			"iPad Air 2",
    "iPad11,3": 		"iPad Air (3rd generation)",
    "iPad11,4": 		"iPad Air (3rd generation)",
    "iPad13,1": 	    "iPad Air (4th generation)",
    "iPad13,2": 		"iPad Air (4th generation)",
    "iPad13,16": 		"iPad Air (5th generation)",
    "iPad13,17": 		"iPad Air (5th generation)",
    "iPad14,8": 		"iPad Air (11-inch) (M2)",
    "iPad14,9": 		"iPad Air (11-inch) (M2)",
    "iPad14,10": 		"iPad Air (13-inch) (M2)",
    "iPad14,11": 		"iPad Air (13-inch) (M2)",
    "iPad2,5": 			"iPad mini",
    "iPad2,6": 			"iPad mini",
    "iPad2,7": 			"iPad mini",
    "iPad4,4": 			"iPad mini 2",
    "iPad4,5": 			"iPad mini 2",
    "iPad4,6": 			"iPad mini 2",
    "iPad4,7": 			"iPad mini 3",
    "iPad4,8": 			"iPad mini 3",
    "iPad4,9": 			"iPad mini 3",
    "iPad5,1": 			"iPad mini 4",
    "iPad5,2": 			"iPad mini 4",
    "iPad11,1": 		"iPad mini (5th generation)",
    "iPad11,2": 		"iPad mini (5th generation)",
    "iPad14,1": 		"iPad mini (6th generation)",
    "iPad14,2": 		"iPad mini (6th generation)",
    "iPad16,1": 		"iPad mini (A17 Pro)",
    "iPad16,2": 		"iPad mini (A17 Pro)",
    "iPad6,3": 			"iPad Pro (9.7-inch)",
    "iPad6,4": 			"iPad Pro (9.7-inch)",
    "iPad7,3": 			"iPad Pro (10.5-inch)",
    "iPad7,4": 			"iPad Pro (10.5-inch)",
    "iPad8,1": 			"iPad Pro (11-inch) (1st generation)",
    "iPad8,2": 			"iPad Pro (11-inch) (1st generation)",
    "iPad8,3": 			"iPad Pro (11-inch) (1st generation)",
    "iPad8,4": 			"iPad Pro (11-inch) (1st generation)",
    "iPad8,9": 			"iPad Pro (11-inch) (2nd generation)",
    "iPad8,10": 		"iPad Pro (11-inch) (2nd generation)",
    "iPad13,4": 		"iPad Pro (11-inch) (3rd generation)",
    "iPad13,5": 		"iPad Pro (11-inch) (3rd generation)",
    "iPad13,6": 		"iPad Pro (11-inch) (3rd generation)",
    "iPad13,7": 		"iPad Pro (11-inch) (3rd generation)",
    "iPad14,3": 		"iPad Pro (11-inch) (4th generation)",
    "iPad14,4": 		"iPad Pro (11-inch) (4th generation)",
    "iPad16,3":    		"iPad Pro (11-inch) (M4)",
    "iPad16,4": 		"iPad Pro (11-inch) (M4)",
    "iPad6,7": 			"iPad Pro (12.9-inch) (1st generation)",
    "iPad6,8": 			"iPad Pro (12.9-inch) (1st generation)",
    "iPad7,1": 			"iPad Pro (12.9-inch) (2nd generation)",
    "iPad7,2": 			"iPad Pro (12.9-inch) (2nd generation)",
    "iPad8,5": 			"iPad Pro (12.9-inch) (3rd generation)",
    "iPad8,6": 			"iPad Pro (12.9-inch) (3rd generation)",
    "iPad8,7": 			"iPad Pro (12.9-inch) (3rd generation)",
    "iPad8,8": 			"iPad Pro (12.9-inch) (3rd generation)",
    "iPad8,11": 		"iPad Pro (12.9-inch) (4th generation)",
    "iPad8,12": 		"iPad Pro (12.9-inch) (4th generation)",
    "iPad13,8": 		"iPad Pro (12.9-inch) (5th generation)",
    "iPad13,9": 		"iPad Pro (12.9-inch) (5th generation)",
    "iPad13,10": 		"iPad Pro (12.9-inch) (5th generation)",
    "iPad13,11": 		"iPad Pro (12.9-inch) (5th generation)",
    "iPad14,5": 		"iPad Pro (12.9-inch) (6th generation)",
    "iPad14,6": 		"iPad Pro (12.9-inch) (6th generation)",
    "iPad16,5": 		"iPad Pro (13-inch) (M4)",
    "iPad16,6": 		"iPad Pro (13-inch) (M4)",
    "AppleTV5,3": 		"Apple TV",
    "i386": 			"Simulator",
    "x86_64": 			"Simulator",
    "arm64": 			"Simulator"
}

const decodeRegion = version => {
    const encode = {
        USA: ["2.2.1(2.2.1)", "2.2.1(5943)", "2.2.1(5964)", "2.3.0(2.3.0)", "2.3.0(5994)", "2.3.0(6032)", "2.3.0(6064)", "2.3.0(6229)", "2.3.01(6751)", "2.5.0(9236)", "2.5.1(10186)", "3.4.0(10469)", "3.4.1(10655)"],
        Ukraine: ["2.0.0(2446)", "2.0.0(2700)", "2.0.0(2701)", "2.0.0(2801)", "2.2.0(2.2.0)", "2.2.0(3001)", "2.2.0(4198)", "2.2.0(4264)", "2.2.0(4889)", "2.2.0(5556)", "2.2.0(6274)", "2.2.0(6786)", "2.2.0(8083)", "2.2.0(8181)", "3.1.1(3.1.1)", "3.1.1(7890)", "3.1.1(7898)", "3.2.0(8329)", "3.2.0(8538)", "3.3.0(3.3.0)", "3.3.0(8956)", "3.4.0(10070)", "3.4.0(9819)"],
        Canada: ["3.3.0(3.3.0)", "3.3.0(9573)", "3.3.0(9584)", "3.3.0(9623)", "3.3.0(9944)", "3.4.0(3.4.0)", "3.4.0(9880)"]
    }

    return find(keys(encode), key => encode[key].includes(version))
}


const parse = userAgent => {
    try {

        let parts = userAgent.split(" ")

        if (parts.length < 4) return {
            id: "unrecognized",
            model: "unrecognized",
            osVersion: "unrecognized",
            stethophoneVersion: "unrecognized",
            appStoreRegion: "unrecognized"
        }

        const id = parts.shift()
        let stethParts = parts.pop()
        const osVersion = parts.pop()

        let model = parts.join(" ")
        model = decodeModel[model.split(" ")[0]] || model

        stethophoneVersion = stethParts
        appStoreRegion = decodeRegion(stethophoneVersion)

        return {
            id,
            model,
            osVersion,
            stethophoneVersion,
            appStoreRegion
        }

    } catch (e) {

        console.log("NO PARSED", userAgent)
        return {
            id: "unrecognized",
            model: "unrecognized",
            osVersion: "unrecognized",
            stethophoneVersion: "unrecognized",
            appStoreRegion: "unrecognized"
        }

    }
}


module.exports = parse
