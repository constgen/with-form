import React from 'react'
import PropTypes from 'prop-types'

import { FormData, FormValidation } from '../form-context'

export default class RegExpValidation extends React.PureComponent {
	static propTypes = {
		children: PropTypes.node,
		rules   : PropTypes.oneOfType([
			PropTypes.objectOf(PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.node,
				PropTypes.func
			]).isRequired),
			PropTypes.func
		]),
		onChange : (FormValidation.propTypes || {}).onChange,
		onValid  : (FormValidation.propTypes || {}).onValid,
		onInvalid: (FormValidation.propTypes || {}).onInvalid,
		className: PropTypes.string
	}
	static defaultProps = {
		children : null,
		rules    : {},
		onChange : FormValidation.defaultProps.onChange,
		onValid  : FormValidation.defaultProps.onValid,
		onInvalid: FormValidation.defaultProps.onInvalid,
		className: undefined
	}
	static getDerivedStateFromProps (props, state) {
		let { values } = state

		function validate (value) {
			if (!value) return
			let { className, rules } = props

			if (typeof rules === 'function') {
				rules = rules(value)
			}

			let violation = Object.entries(rules)
				.map(function toRegExp ([expression, message]) {
					return {
						expression: new RegExp(expression),
						message
					}
				})
				.find(function isInvalid ({ expression }) {
					return !expression.test(value)
				})

			if (!violation) return
			let violationMessage = typeof violation.message === 'function' ? violation.message(value) : violation.message

			if (!violationMessage) throw new TypeError('Rule message must be a not empty string or a function that returns a truethy value')

			if (className) {
				return <div className={className}>{violationMessage}</div>
			}
			return violationMessage
		}

		let validation = Object.keys(values)
			.reduce(function (validationRules, name) {
				validationRules[name] = validate
				return validationRules
			}, {})

		return { validation }
	}
	state = {
		validation: {},
		values    : {}
	}

	handleValuesChange = values => {
		this.setState({ values })
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