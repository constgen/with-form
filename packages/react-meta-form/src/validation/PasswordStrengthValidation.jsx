import React from 'react'
import PropTypes from 'prop-types'

import { FormData, FormValidation } from '../form-context'

export default class PasswordStrengthValidation extends React.PureComponent {
	static propTypes = {
		children : PropTypes.node,
		onChange : (FormValidation.propTypes || {}).onChange,
		onValid  : (FormValidation.propTypes || {}).onValid,
		onInvalid: (FormValidation.propTypes || {}).onInvalid,
		className: PropTypes.string,
		strength : PropTypes.number
	}
	static defaultProps = {
		children : null,
		onChange : FormValidation.defaultProps.onChange,
		onValid  : FormValidation.defaultProps.onValid,
		onInvalid: FormValidation.defaultProps.onInvalid,
		className: '',
		strength : 3
	}
	static rules = {
		// '^[\\s\\S]{8,64}$': 'From 8 to 64 characters',

		// '[\\^$@!%*#?&]': 'Special characters',
		// '[A-Z]': 'Uppercase letters',
		// '[0-9]': 'Digits',
		// '[a-z]': 'Lowercase letters'

		'[\\^$@!%*#?&]': 'A special character',
		'[A-Z]'        : 'An uppercase letter',
		'[0-9]'        : 'At least one digit',
		'[a-z]'        : 'At least one lowercase letter'
	}
	static toViolationsFromValue (value) {
		let { rules } = PasswordStrengthValidation

		return Object.entries(rules)
			.filter(function ([expression]) {
				return !new RegExp(expression).test(value)
			})
			.map(function ([, message]) {
				return message
			})
	}
	static toStrengthFromViolations (violations) {
		let { rules } = PasswordStrengthValidation

		return Object.keys(rules).length - violations.length
	}
	state = {
		validation: {}
	}

	validateStrength = value => {
		if (!value) return
		let { className, strength: minimalStrength }            = this.props
		let { toViolationsFromValue, toStrengthFromViolations } = PasswordStrengthValidation
		let violations                                          = toViolationsFromValue(value)
		let strength                                            = toStrengthFromViolations(violations)

		if (strength >= minimalStrength) return

		// <React.Fragment>
		// 		The password is too weak. To increase its strength use:
		// 		<ul style={{ marginBottom: 0 }}>
		// 			{violations.map(function (message) {
		// 				return <li key={message}>{message}</li>;
		// 			})}
		// 		</ul>
		// 	</React.Fragment>
		let validityMessage = (
			<React.Fragment>
				<h5>Password should contain</h5>
				<ul style={{ marginBottom: 0 }}>
					{violations.map(function (message) {
						return <li key={message}>{message}</li>
					})}
				</ul>
			</React.Fragment>
		)

		if (className) {
			validityMessage = <div className={className}>{validityMessage}</div>
		}
		return validityMessage
	}
	handleValuesChange = values => {
		let { validateStrength } = this

		let validation = Object.keys(values)
			.reduce(function (rules, name) {
				rules[name] = validateStrength
				return rules
			}, {})

		this.setState({ validation })
	}

	render () {
		let { children, onChange, onValid, onInvalid } = this.props
		let { validation }                             = this.state

		return (
			<FormValidation
				validation={validation}
				onChange={onChange}
				onValid={onValid}
				onInvalid={onInvalid}
			>
				<FormData onChange={this.handleValuesChange}>
					{children}
				</FormData>
			</FormValidation>
		)
	}
}