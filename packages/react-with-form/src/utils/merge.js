import isObject from './is-object'
import isArray from './is-array'

export default function merge (to, from) {
	if (!isObject(from)) return from
	if (!isObject(to)) return from

	let result
	let propsFrom  = Object.keys(from)
	let { length } = propsFrom
	let index      = -1

	while (++index < length) {
		let prop         = propsFrom[index]
		let toValue      = to[prop]
		let fromValue    = from[prop]
		let valueUpdated = !(prop in to) || fromValue !== toValue

		if (valueUpdated) {
			if (result === undefined) {
				result = isArray(to) ? [].concat(to) : { ...to }
			}
			result[prop] = fromValue
		}
	}

	return result || to
}

// console.log(merge({}, {}))
// console.log(merge({ a: 1 }, { b: 2 }))
// console.log(merge({ a: 1 }, { a: 2 }))
// console.log(merge(5, { b: 2 }))
// console.log(merge({ a: 1 }, 5))
// console.log(merge({ a: 1, b: 2, d: undefined }, { b: 3, c: 4, e: undefined }))
// console.log(merge({ a: { b: undefined }, d: undefined }, { a: { c: undefined }, e: undefined }))
// console.log(merge({ a: [1], b: 2 }, { b: [3], c: [4] }))
// console.log(merge({ a: [1, 2], b: [,, 2], c: { d: 5 }, e: [6] }, { a: 8, b: [3], c: [4], e: { f: 7 } 	}))
// console.log(merge([1, 2, 3, 4, 5], [5, 6]))
// console.log(merge([1, 2, 3, 4, 5, 6], { 5: 'a', 6: 'b' }))
// console.log(merge([], { 5: 'a', 6: 'b' }))
// console.log(merge([,,, 'o'], { 5: 'a', 6: 'b' }))