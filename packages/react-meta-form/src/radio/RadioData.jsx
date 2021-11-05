import React from 'react'
import PropTypes from 'prop-types'

import noop from '../utils/noop'
import RadioContext from './RadioContext'
import { withFormData } from '../form-context'

@withFormData
export default class RadioData extends React.PureComponent {
	static propTypes = {
		disabled: PropTypes.bool,
		name    : PropTypes.string.isRequired,
		value   : PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
			PropTypes.bool
		]),
		onChange: PropTypes.func,
		children: PropTypes.node.isRequired
	}
	static defaultProps = {
		disabled: undefined,
		value   : undefined,
		onChange: noop
	}

	static getDerivedStateFromProps (props, state) {
		let { value, disabled, name } = props
		let valueIsUpdated            = value !== undefined && value !== state.value
		let disabledIsUpdated         = disabled !== undefined && disabled !== state.disabled
		let nameIsUpdated             = name !== undefined && name !== state.name

		if (valueIsUpdated || disabledIsUpdated || nameIsUpdated) {
			return {
				value,
				disabled,
				name
			}
		}

		return null
	}

	constructor (props, context) {
		super(props, context)

		let { value, disabled, name } = this.props

		/* eslint-disable react/no-unused-state */
		this.state = {
			value,
			disabled,
			name,
			onChange: this.handleChange
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