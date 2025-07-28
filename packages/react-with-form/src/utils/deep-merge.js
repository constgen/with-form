import isObject from './is-object'
import isArray from './is-array'

export default function deepMerge (to, from) {
	if (!isObject(from)) return from
	if (!isObject(to)) return from

	let result
	let propsFrom  = Object.keys(from)
	let { length } = propsFrom
	let index      = -1

	while (++index < length) {
		let prop               = propsFrom[index]
		let toValue            = to[prop]
		let fromValue          = from[prop]
		let mergedValue        = deepMerge(toValue, fromValue)
		let mergedValueUpdated = !(prop in to) || mergedValue !== toValue

		if (mergedValueUpdated) {
			if (result === undefined) {
				result = isArray(to) ? [].concat(to) : { ...to }
			}
			result[prop] = mergedValue
		}
	}

	return result || to
}


// console.log(deepMerge({}, {}))
// console.log(deepMerge({ a: 1 }, { b: 2 }))
// console.log(deepMerge({ a: 1 }, { a: 2 }))
// console.log(deepMerge(5, { b: 2 }))
// console.log(deepMerge({ a: 1 }, 5))
// console.log(deepMerge({ a: 1, b: 2, d: undefined }, { b: 3, c: 4, e: undefined }))
// console.log(deepMerge({ a: { b: undefined }, d: undefined }, { a: { c: undefined }, e: undefined }))
// console.log(deepMerge({ a: [1], b: 2 }, { b: [3], c: [4] }))
// console.log(deepMerge({ a: [1, 2], b: [2], c: { d: 5 }, e: [6] }, { a: 8, b: [3], c: [4], e: { f: 7 } 	}))
// console.log(deepMerge({ a: [1, 2, 3, 4, 5], b: [9, 8] }, { a: [5, 6], b: [1, 2, 3, 4, 5]	}))
// console.log(deepMerge({ a: [1, 2, 3, 4, 5] }, { a: { 5: 'a', 6: 'b' }	}))
// console.log(deepMerge({ a: [] }, { a: { 5: 'a', 6: 'b' }	}))
// console.log(deepMerge({ a: [,,, 'o'] }, { a: { 5: 'a', 6: 'b' }	}))