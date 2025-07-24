import { Component } from 'react'
import PropTypes from 'prop-types'

import DataContext from './DataContext'
import noop from '../utils/noop'
import merge from '../utils/merge'

let EMPTY_VALUES = Object.freeze({})

export default class FormData extends Component {
	static contextType = DataContext
	static propTypes = {
		name    : PropTypes.string,
		values  : PropTypes.object,
		children: PropTypes.node.isRequired,
		onChange: PropTypes.func
	}
	static defaultProps = {
		name    : undefined,
		values  : EMPTY_VALUES,
		onChange: noop
	}
	static getDerivedStateFromProps (props, state) {
		let { values } = props

		if (values !== state.initialValues) {
			return {
				values       : merge(state.values, values),
				initialValues: values
			}
		}
		return null
	}
	constructor (props, context) {
		super(props, context)

		this.state   = {
			values       : EMPTY_VALUES,
			initialValues: EMPTY_VALUES,
			onChange     : this.handleChange,
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
			let { values } = component

			onChange(values)
			component.handleContextChange(values)
		})
	}

	componentWillUnmount () {
		let { name } = this.props

		this.mounted = false

		if (name) {
			this.handleContextRemove(name)
		}
	}

	get values () {
		let { context, state }      = this
		let { name, values }        = this.props
		let valuesAreUncontrolled   = values === EMPTY_VALUES
		let contextValues           = name && context.values ? context.values[name] : context.values
		let contextValuesAreDefined = contextValues && contextValues !== EMPTY_VALUES

		// console.log(contextValues ? 'nested' : 'parent', {
		// 	stateValues  : JSON.stringify(state.values),
		// 	contextValues: JSON.stringify(contextValues)
		// })
		if (contextValuesAreDefined && valuesAreUncontrolled) {
			return merge(state.values, contextValues)
		}
		if (contextValuesAreDefined) {
			return merge(contextValues, state.values)
		}
		return state.values
	}

	handleChange = newValues => {
		let { onChange } = this.props
		let { mounted }  = this
		let component    = this
		let state        = { }

		this.setState(function ({ values }) {
			state = { values: merge(values, newValues) }
			return state
		}, function () {
			if (mounted) {
				onChange(state.values)
			}
			component.handleContextChange(newValues)
		})
	}

	handleRemove = obsoleteName => {
		let { onChange } = this.props
		let state        = {}
		let { mounted }  = this
		let component    = this

		this.setState(function ({ values }) {
			let { [obsoleteName]: obsoleteValue, ...cleanedValues } = values // eslint-disable-line no-unused-vars

			state = { values: cleanedValues }
			return state
		}, function () {
			if (mounted) {
				onChange(state.values)
			}
			component.handleContextRemove(obsoleteName)
		})
	}

	handleContextChange (obsoleteName) {
		let { name }                      = this.props
		let { onChange: contextOnChange } = this.context

		if (!contextOnChange) return

		if (name) {
			let { values } = this.state

			contextOnChange({ [name]: values })
		}
		else {
			contextOnChange(obsoleteName)
		}
	}

	handleContextRemove (obsoleteName) {
		let { name }                                                 = this.props
		let { onRemove: contextOnRemove, onChange: contextOnChange } = this.context

		if (!contextOnRemove) return

		if (name) {
			let { values } = this.state

			contextOnChange({ [name]: values })
		}
		else {
			contextOnRemove(obsoleteName)
		}
	}

	render () {
		let { children }                   = this.props
		let { values, onChange, onRemove } = this.state
		let combinatedValues               = this.values
		let conextValuesIsUsed             = values !== combinatedValues
		let providerValue                  = this.state

		if (conextValuesIsUsed) {
			providerValue = {
				values: combinatedValues,
				onChange,
				onRemove
			}
		}

		return (
			<DataContext.Provider value={providerValue}>
				{children}
			</DataContext.Provider>
		)
	}
}