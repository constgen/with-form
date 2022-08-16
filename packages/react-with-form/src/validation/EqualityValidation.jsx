import React from 'react'
import PropTypes from 'prop-types'

import { FormData, FormValidation } from '../form-context'

export default class EqualityValidation extends React.PureComponent {
	static propTypes = {
		children : PropTypes.node,
		name     : PropTypes.string.isRequired,
		message  : PropTypes.string,
		onChange : (FormValidation.propTypes || {}).onChange,
		onValid  : (FormValidation.propTypes || {}).onValid,
		onInvalid: (FormValidation.propTypes || {}).onInvalid,
		className: PropTypes.string
	}
	static defaultProps = {
		children : null,
		message  : '',
		onChange : FormValidation.defaultProps.onChange,
		onValid  : FormValidation.defaultProps.onValid,
		onInvalid: FormValidation.defaultProps.onInvalid,
		className: ''
	}
	state = {
		validation: {}
	}

	handleValuesChange = values => {
		let { message, className, name: originName } = this.props
		let validityMessage                          = message || `This field must match with "${originName}".`
		let validation                               = {}

		if (className) {
			validityMessage = <div className={className}>{validityMessage}</div>
		}

		function validateEquality (value) {
			return value === values[originName] ? false : validityMessage
		}

		validation = Object.keys(values)
			.filter(function isNotOriginName (name) {
				return name !== originName
			})
			.reduce(function (rules, name) {
				rules[name] = validateEquality
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