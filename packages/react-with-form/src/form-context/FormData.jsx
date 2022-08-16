import React from 'react'
import PropTypes from 'prop-types'

import DataContext from './DataContext'
import noop from '../utils/noop'

export default class FormData extends React.Component {
	static contextType = DataContext
	static propTypes = {
		values  : PropTypes.object,
		children: PropTypes.node.isRequired,
		onChange: PropTypes.func
	}
	static defaultProps = {
		values  : {},
		onChange: noop
	}
	static getDerivedStateFromProps (props, state) {
		let { values } = props

		if (values !== state.initialValues) {
			return {
				values       : { ...state.values, ...values },
				initialValues: values
			}
		}
		return null
	}
	constructor (props, context) {
		super(props, context)

		this.state = {
			values       : {},
			initialValues: {},
			onChange     : this.handleChange,
			onRemove     : this.handleRemove
		}
	}

	get values () {
		let { defaultProps }          = FormData
		let { context, state, props } = this
		let valuesAreUncontrolled     = props.values === defaultProps.values
		let contextValuesAreDefined   = context.values && context.values !== defaultProps.values

		if (contextValuesAreDefined && valuesAreUncontrolled) {
			return { ...state.values, ...context.values }
		}
		if (contextValuesAreDefined) {
			return { ...context.values, ...state.values }
		}
		return state.values
	}

	handleChange = newValues => {
		let { onChange }                         = this.props
		let { values }                           = this.state
		let { onChange: contextOnChange = noop } = this.context
		let state                                = { values: { ...values, ...newValues } }

		this.setState(state)
		onChange(state.values)
		contextOnChange(newValues)
	}

	handleRemove = obsoleteName => {
		let { onChange }                         = this.props
		let { onRemove: contextOnRemove = noop } = this.context
		let state                                = {}

		this.setState(function ({ values }) {
			let { [obsoleteName]: obsoleteValue, ...cleanedValues } = values // eslint-disable-line no-unused-vars

			state = { values: cleanedValues }

			return state
		}, function () {
			onChange(state.values)
			contextOnRemove(obsoleteName)
		})
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