let isArray = Array.isArray || function isArray (value) {
	return Object.prototype.toString.call(value) === '[object Array]'
}

export default isArray