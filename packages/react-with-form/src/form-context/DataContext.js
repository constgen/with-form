import React from 'react'

let DataContext = React.createContext({
	values   : undefined,
	onUpdate : undefined,
	onReplace: undefined,
	onRemove : undefined
})

DataContext.displayName = 'DataContext'

export default DataContext