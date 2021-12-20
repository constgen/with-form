import React from 'react'
import PropTypes from 'prop-types'

import { FormValidation } from '../form-context'

export default class PhoneValidation extends React.PureComponent {
	static propTypes = {
		children : PropTypes.node,
		onChange : (FormValidation.propTypes || {}).onChange,
		onValid  : (FormValidation.propTypes || {}).onValid,
		onInvalid: (FormValidation.propTypes || {}).onInvalid,
		className: PropTypes.string
	}
	static defaultProps = {
		children : null,
		onChange : FormValidation.defaultProps.onChange,
		onValid  : FormValidation.defaultProps.onValid,
		onInvalid: FormValidation.defaultProps.onInvalid,
		className: ''
	}
	static rules = {
		'^\\+?[^+]+$'    : 'The "+" sign in a phone number can only occur at the beginning',
		'^[\\d\\s()+-]+$': 'Phone number can contain only numbers, dashes, spaces, +, and parentheses'
	}

	render () {
		let {
			children, onChange, onValid, onInvalid, className
		} = this.props
		let { rules } = this.constructor

		return (
			<RegExpValidation
				rules={rules}
				className={className}
				onChange={onChange}
				onValid={onValid}
				onInvalid={onInvalid}
			>
				{children}
			</RegExpValidation>
		)
	}
}