import React from 'react'

import noop from '../utils/noop'

let RadioContext = React.createContext({
	value   : undefined,
	disabled: undefined,
	name    : undefined,
	required: undefined,
	onChange: noop,
	field   : undefined
})

RadioContext.displayName = 'RadioContext'

export default RadioContext