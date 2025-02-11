import React from 'react'

import noop from '../utils/noop'

export const STATUS = Object.freeze({
	DEFAULT  : 'DEFAULT',
	PENDING  : 'PENDING',
	SUBMITTED: 'SUBMITTED',
	FAILED   : 'FAILED'
})

let StatusContext = React.createContext({
	STATUS,
	status  : undefined,
	onSubmit: noop
})

StatusContext.displayName = 'StatusContext'

export default StatusContext