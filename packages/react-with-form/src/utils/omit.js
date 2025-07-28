import isObject from './is-object'
import isArray from './is-array'

export default function omit (from, key) {
	if (!isObject(from)) return from
	if (typeof key !== 'string' && typeof key !== 'number') return from

	if (isArray(from)) {
		let result = [].concat(from)

		delete result[key]
		return result
	}

	let { [key]: omittedValue, ...result } = from // eslint-disable-line no-unused-vars

	return result
}

// console.log(omit(['test', 'default value',,, undefined], 0)) // [', 'default value',,, undefined]