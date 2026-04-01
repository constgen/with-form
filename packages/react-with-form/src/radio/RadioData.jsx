import React from 'react'
import PropTypes from 'prop-types'

import noop from '../utils/noop'
import RadioContext from './RadioContext'
import { withFormValue, withValidation } from '../form-context'

@withFormValue
@withValidation
export default class RadioData extends React.PureComponent {
	static propTypes = {
		disabled: PropTypes.bool,
		name    : PropTypes.string.isRequired,
		value   : PropTypes.any,
		required: PropTypes.bool,
		onChange: PropTypes.func,
		children: PropTypes.node.isRequired,
		innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
	}
	static defaultProps = {
		disabled: undefined,
		value   : undefined,
		required: undefined,
		onChange: noop,
		innerRef: undefined
	}

	static getDerivedStateFromProps (props, state) {
		let { value, disabled, name, required } = props

		let valueIsUpdated    =  value !== state.value
		let disabledIsUpdated =  disabled !== state.disabled
		let nameIsUpdated     =  name !== state.name
		let requiredIsUpdated =  required !== state.required

		if (valueIsUpdated || disabledIsUpdated || nameIsUpdated || requiredIsUpdated) {
			return {
				value,
				disabled,
				name,
				required
			}
		}

		return null
	}

	constructor (props, context) {
		super(props, context)

		let {
			value, disabled, name, required, innerRef
		} = this.props

		/* eslint-disable react/no-unused-state */
		this.state = {
			value,
			disabled,
			name,
			required,
			onChange: this.handleChange,
			field   : innerRef || React.createRef()
		}
		/* eslint-enable */
	}

	handleChange = value => {
		let { onChange }        = this.props
		let valueIsUncontrolled = this.props.value === undefined

		if (valueIsUncontrolled) {
			this.setState({ value })
		}

		onChange(value)
	}
	render () {
		let { children } = this.props

		return (
			<RadioContext.Provider value={this.state}>
				{children}
			</RadioContext.Provider>
		)
	}
}