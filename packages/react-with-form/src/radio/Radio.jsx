import React from 'react'
import PropTypes from 'prop-types'

import RadioContext from './RadioContext'
import noop from '../utils/noop'

export default class Radio extends React.PureComponent {
	static contextType = RadioContext
	static propTypes = {
		className: PropTypes.string,
		value    : PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
			PropTypes.bool
		]).isRequired,
		disabled: PropTypes.bool,
		onClick : PropTypes.func
	}
	static defaultProps = {
		className: '',
		disabled : false,
		onClick  : noop
	}
	handleChange = () => {
		let { onChange } = this.context
		let { value }    = this.props

		if (onChange) {
			onChange(value)
		}
	}
	render () {
		let { context, handleChange }                                = this
		let { value: contextValue, disabled: contextDisabled, name } = context
		let { className, disabled, onClick, value }                  = this.props
		let checked                                                  = value === contextValue

		disabled = contextDisabled || disabled

		return (
			<input
				type="radio"
				name={name}
				className={className}
				value={value}
				checked={checked}
				disabled={disabled}
				onChange={handleChange}
				onClick={onClick}
			/>
		)
	}
}