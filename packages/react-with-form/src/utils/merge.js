function isObject (value) {
	return value !== null && typeof value === 'object'
}

let isArray = Array.isArray || function (value) {
	return Object.prototype.toString.call(value) === '[object Array]'
}

export default function merge (to, from) {
	if (isArray(from)) {
		return isArray(to) ? [...to, ...from] : from
	}

	if (isArray(to)) {
		return from
	}

	if (!isObject(from)) return to
	if (!isObject(to)) return from


	let result
	let propsFrom  = Object.keys(from)
	let { length } = propsFrom
	let index      = -1

	while (++index < length) {
		let prop      = propsFrom[index]
		let toValue   = to[prop]
		let fromValue = from[prop]
		let mergedValue


		if (isArray(fromValue) || isObject(fromValue)) {
			mergedValue = merge(toValue, fromValue)
		}
		else {
			mergedValue = fromValue
		}

		let mergedValueUpdated = !(prop in to) || mergedValue !== toValue

		if (mergedValueUpdated) {
			if (result === undefined) {
				result = { ...to }
			}
			result[prop] = mergedValue
		}
	}

	return result || to
}


// console.log(merge({}, {}))
// console.log(merge({ a: 1 }, { b: 2 }))
// console.log(merge({ a: 1 }, { a: 2 }))
// console.log(merge(undefined, { b: 2 }))
// console.log(merge({ a: 1 }))
// console.log(merge({ a: 1, b: 2, d: undefined }, { b: 3, c: 4, e: undefined }))
// console.log(merge({ a: { b: undefined }, d: undefined }, { a: { c: undefined }, e: undefined }))
// console.log(merge({ a: [1], b: 2 }, { b: [3], c: [4] }))
// console.log(merge({ a: [1, 2], b: [2], c: { d: 5 }, e: [6] }, { a: 8, b: [3], c: [4], e: { f: 7 } 	}))