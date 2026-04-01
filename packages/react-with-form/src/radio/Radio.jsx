import React from 'react'
import PropTypes from 'prop-types'

import RadioContext from './RadioContext'
import noop from '../utils/noop'

export default class Radio extends React.PureComponent {
	static contextType = RadioContext
	static propTypes = {
		className: PropTypes.string,
		value    : PropTypes.any.isRequired,
		disabled : PropTypes.bool,
		onClick  : PropTypes.func
	}
	static defaultProps = {
		className: '',
		disabled : false,
		onClick  : noop
	}
	static index = -1
	constructor (props, context) {
		super(props, context)
		this.index = ++Radio.index
	}
	handleChange = () => {
		let { onChange } = this.context
		let { value }    = this.props

		if (onChange) {
			onChange(value)
		}
	}
	get htmlValue () {
		let { value } = this.props
		let valueType = typeof value

		if (valueType === 'number' || valueType === 'boolean' || valueType === 'string') {
			return value
		}

		return `[object_${this.index}]`
	}
	render () {
		let {
			value: contextValue, disabled: contextDisabled, name, required, field
		} = this.context

		let { className, disabled, onClick, value } = this.props
		let checked                                 = value === contextValue

		disabled = contextDisabled || disabled

		return (
			<input
				ref={field}
				type="radio"
				name={name}
				className={className}
				value={value}
				checked={checked}
				disabled={disabled}
				required={required}
				onChange={this.handleChange}
				onClick={onClick}
			/>
		)
	}
}