import { Component } from 'react'
import PropTypes from 'prop-types'

import DataContext from './DataContext'
import noop from '../utils/noop'
import deepMerge from '../utils/deep-merge'
import merge from '../utils/merge'
import omit from '../utils/omit'

export let EMPTY = Symbol('EMPTY')

let EMPTY_VALUES = Object.freeze({})

export default class FormData extends Component {
	static contextType = DataContext
	static propTypes = {
		name    : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		values  : PropTypes.object,
		children: PropTypes.node.isRequired,
		onChange: PropTypes.func
	}
	static defaultProps = {
		name    : undefined,
		values  : EMPTY_VALUES,
		onChange: noop
	}
	static [EMPTY] = EMPTY_VALUES
	static getDerivedStateFromProps (props, state) {
		let { values } = props

		if (values !== state.initialValues) {
			return {
				values       : deepMerge(state.values, values),
				initialValues: values
			}
		}
		return null
	}
	constructor (props, context) {
		super(props, context)
		let empty = this.constructor[EMPTY]

		this.state   = {
			values       : empty,
			initialValues: empty,
			onUpdate     : this.handleUpdate,
			onReplace    : this.handleReplace,
			onRemove     : this.handleRemove
		}
		this.mounted = false
	}

	componentDidMount () {
		let { onChange } = this.props
		let component    = this

		this.mounted = true
		// eslint-disable-next-line react/no-did-mount-set-state
		this.setState(null, function () {
			let { values } = component.state

			onChange(values)
			component.contextUpdate(values)
		})
	}

	componentWillUnmount () {
		let { name } = this.props

		this.mounted = false

		if (name) {
			this.contextRemove(name)
		}
	}

	get collectionValues () {
		let empty                   = this.constructor[EMPTY]
		let { context, state }      = this
		let { name, values }        = this.props
		let valuesAreUncontrolled   = values === empty
		let contextValues           = name && context.values ? context.values[name] : context.values
		let contextValuesAreDefined = contextValues && contextValues !== empty

		// console.log(contextValues ? 'nested' : 'parent', {
		// 	stateValues  : JSON.stringify(state.values),
		// 	contextValues: JSON.stringify(contextValues)
		// })
		if (contextValuesAreDefined && valuesAreUncontrolled) {
			return deepMerge(state.values, contextValues)
		}
		if (contextValuesAreDefined) {
			return deepMerge(contextValues, state.values)
		}
		return state.values
	}

	handleUpdate = newValues => {
		let { onChange } = this.props
		let { mounted }  = this
		let component    = this
		let state        = { }

		// console.log('newValues', newValues, this.state.values)
		this.setState(function ({ values }) {
			// console.log('newValues2', newValues, values)
			state            = { values: deepMerge(values, newValues) }
			let stateChanged = state.values !== values

			return stateChanged ? state : null
		}, function () {
			// console.log('newValues3', newValues, state.values)
			if (mounted) {
				onChange(state.values)
			}
			component.contextUpdate(newValues)
		})
	}

	handleReplace = newValues => {
		let { onChange } = this.props
		let { mounted }  = this
		let component    = this
		let state        = { }

		// console.log('newValues', newValues, this.state.values)
		this.setState(function ({ values }) {
			state = { values: merge(values, newValues) }

			let stateChanged = state.values !== values

			return stateChanged ? state : null
		}, function () {
			// console.log('newValues3', newValues, state.values)
			if (mounted) {
				onChange(state.values)
			}
			component.contextReplace(newValues)
		})
	}

	handleRemove = obsoleteName => {
		let { onChange } = this.props
		let { mounted }  = this
		let component    = this
		let state        = {}


		this.setState(function ({ values }) {
			state            = { values: omit(values, obsoleteName) }
			let stateChanged = state.values !== values

			// console.log('remove', obsoleteName, values, state.values)
			return stateChanged ? state : null
		}, function () {
			if (mounted) {
				onChange(state.values)
			}
			component.contextRemove(obsoleteName)
		})
	}

	contextUpdate (newValues) {
		let { name }                      = this.props
		let { onUpdate: contextOnUpdate } = this.context

		if (!contextOnUpdate) return

		if (name) {
			let { values } = this.state

			contextOnUpdate({ [name]: values })
		}
		else {
			contextOnUpdate(newValues)
		}
	}

	contextReplace (newValues) {
		let { name }                        = this.props
		let { onReplace: contextOnReplace } = this.context

		if (!contextOnReplace) return

		if (name) {
			let { values } = this.state

			contextOnReplace({ [name]: values })
		}
		else {
			contextOnReplace(newValues)
		}
	}

	contextRemove (obsoleteName) {
		let { name }                                                   = this.props
		let { onRemove: contextOnRemove, onReplace: contextOnReplace } = this.context

		if (!contextOnRemove) return

		if (name) {
			let { values } = this.state

			contextOnReplace({ [name]: values })
		}
		else {
			contextOnRemove(obsoleteName)
		}
	}

	render () {
		let {
			values, onChange, onRemove, onReplace, onUpdate
		} = this.state
		let { collectionValues } = this
		let conextValuesIsUsed   = values !== collectionValues
		let providerValue        = this.state

		if (conextValuesIsUsed) {
			providerValue = {
				values: collectionValues,
				onChange,
				onUpdate,
				onReplace,
				onRemove
			}
		}

		return (
			<DataContext.Provider value={providerValue}>
				{this.props.children}
			</DataContext.Provider>
		)
	}
}