import React from 'react'

let ValidationContext = React.createContext({
	validation: undefined,
	disabled  : undefined,
	silent    : undefined,
	onChange  : undefined
})

export default ValidationContext