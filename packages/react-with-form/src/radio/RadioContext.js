import React from 'react'

import noop from '../utils/noop'

let RadioContext = React.createContext({
	value   : undefined,
	disabled: undefined,
	name    : undefined,
	onChange: noop
})

RadioContext.displayName = 'RadioContext'

export default RadioContext