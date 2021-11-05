import React from 'react'
import PropTypes from 'prop-types'

import ValidationContext from './ValidationContext'
import noop from '../utils/noop'

export function mergeValidations (toValidation, fromValidation) {
	let combinedValidation = Object.entries(fromValidation)
		.filter(function ([name]) {
			return name in toValidation
		})
		.map(function ([name, validate]) {
			let originalValidate = toValidation[name]

			return [name, function mergedValidate (value) {
				return validate(value) || originalValidate(value)
			}]
		})
		.reduce(function (validation, [name, validate]) {
			validation[name] = validate
			return validation
		}, {})

	return { ...toValidation, ...fromValidation, ...combinedValidation }
}

export default class FormValidation extends React.PureComponent {
	static contextType = ValidationContext
	static propTypes = {
		validation: PropTypes.objectOf(PropTypes.func),
		disabled  : PropTypes.bool,
		silent    : PropTypes.bool,
		children  : PropTypes.node.isRequired,
		onChange  : PropTypes.func,
		onValid   : PropTypes.func,
		onInvalid : PropTypes.func
	}
	static defaultProps = {
		validation: {},
		disabled  : undefined,
		silent    : undefined,
		onChange  : noop,
		onValid   : noop,
		onInvalid : noop
	}
	static getDerivedStateFromProps (props) {
		let { disabled, validation, silent } = props

		return {	disabled, validation, silent }
	}
	validity = {}
	constructor (props, context) {
		super(props, context)

		this.state = {
			onChange: this.handleChange
		}
	}
	handleChange = newValidity => {
		let { onChange, onValid, onInvalid }     = this.props
		let { onChange: contextOnChange = noop } = this.context
		let validity                             = { ...this.validity, ...newValidity }
		let validationMessages                   = Object.values(validity)
		let invalid                              = validationMessages.some(Boolean)

		this.validity = validity
		onChange(validity)
		if (invalid) {
			let invalidity = Object.entries(validity)
				.filter(function hasMessage ([, message]) {
					return Boolean(message)
				})
				.reduce(function toObject (state, [name, message]) {
					state[name] = message
					return state
				}, {})

			onInvalid(invalidity)
		}
		else {
			onValid(validity)
		}
		contextOnChange(newValidity)
	}

	get combinedDisabled () {
		let { defaultProps }     = FormValidation
		let { context, props }   = this
		let ownDisabledIsDefined = props.disabled !== defaultProps.disabled

		return ownDisabledIsDefined ? props.disabled : context.disabled
	}
	get combinedSilent () {
		let { defaultProps }   = FormValidation
		let { context, props } = this
		let ownSilentIsDefined = props.silent !== defaultProps.silent

		return ownSilentIsDefined ? props.silent : context.silent
	}
	get combinedValidation () {
		let { defaultProps }           = FormValidation
		let { context, props }         = this
		let contextValidationIsDefined = context.validation && context.validation !== defaultProps.validation

		if (contextValidationIsDefined) {
			return mergeValidations(context.validation, props.validation)
		}
		return props.validation
	}
	get providerValue () {
		let providerValue                              = this.state
		let { validation, disabled, silent, onChange } = this.state
		let contextValidationIsUsed                    = validation !== this.combinedValidation
		let contextDisabledIsUsed                      = disabled !== this.combinedDisabled
		let contextSilentIsUsed                        = silent !== this.combinedSilent
		let contextPropIsUsed                          = contextValidationIsUsed || contextDisabledIsUsed || contextSilentIsUsed

		if (contextPropIsUsed) {
			providerValue = {
				validation: this.combinedValidation,
				silent    : this.combinedSilent,
				disabled  : this.combinedDisabled,
				onChange
			}
		}
		return providerValue
	}

	render () {
		let { children }      = this.props
		let { providerValue } = this

		return (
			<ValidationContext.Provider value={providerValue}>
				{children}
			</ValidationContext.Provider>
		)
	}
}