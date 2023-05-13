import React from 'react'
import PropTypes from 'prop-types'

import noop from '../utils/noop'
import ValidationContext from './ValidationContext'

export default class Validity extends React.PureComponent {
	static contextType = ValidationContext
	static propTypes = {
		name      : PropTypes.string,
		value     : PropTypes.any,
		checked   : PropTypes.bool,
		onValidate: PropTypes.func,
		onValid   : PropTypes.func,
		onInvalid : PropTypes.func,
		children  : PropTypes.node
	}
	static defaultProps = {
		name      : undefined,
		value     : undefined,
		checked   : undefined,
		onValidate: noop,
		onValid   : noop,
		onInvalid : noop,
		children  : null
	}

	static validateDomElement (element) {
		if (!element) return

		let valid                 = element.checkValidity()
		let { validationMessage } = element

		return valid ? undefined : validationMessage
	}

	constructor (props, context) {
		super(props, context)
		this.error         = undefined
		this.nestedError   = undefined
		this.prevValidator = this.validator
		this.state         = {
			disabled: context.disabled,
			/* eslint-disable react/no-unused-state */
			silent  : context.silent,
			onChange: this.handleNestedChange
			/* eslint-enable */
		}
	}

	componentDidMount () {
		this.validate()
	}

	componentDidUpdate (previousProps, previousState) {
		let { disabled, silent } = this.context
		let { validator }        = this
		let {
			name, value, checked, onValidate
		} = this.props
		let nameChanged          = name !== previousProps.name
		let valueChanged         = value !== previousProps.value
		let checkedChanged       = checked !== previousProps.checked
		let validationChanged    = onValidate !== previousProps.onValidate
		let disabledChanged      = disabled !== previousState.disabled
		let validatorChanged     = validator !== this.prevValidator
		let silentChanged        = silent !== previousState.silent

		if (nameChanged
			|| valueChanged
			|| checkedChanged
			|| disabledChanged
			|| validationChanged
			|| validatorChanged
		) {
			this.validate()
		}

		if (validatorChanged) {
			this.prevValidator = validator
		}

		if (disabledChanged || silentChanged) {
			this.setState({ disabled, silent })
		}
	}

	componentWillUnmount () {
		this.handleChange(this.nestedError)
	}

	get validator () {
		let { name }       = this.props
		let { validation } = this.context

		return validation && validation[name]
	}

	validate () {
		let { disabled }          = this.context
		let { value, onValidate } = this.props
		let validationNotDisabled = !disabled
		let error

		if (validationNotDisabled) {
			error = onValidate(value) || this.validateExternally(value)
		}

		error = error || this.nestedError
		this.handleValidity(error)
		return this.handleChange(error)
	}

	validateExternally (value) {
		let { validator }             = this
		let externalValidationMessage = validator && validator(value)

		return externalValidationMessage || undefined
	}

	handleValidity = error => {
		let { onValid, onInvalid } = this.props
		let errorNotChanged        = error === this.error

		if (errorNotChanged) return

		if (error) {
			onInvalid(error)
		}
		else {
			onValid()
		}
	}

	handleChange = error => {
		let { onChange }    = this.context
		let { name }        = this.props
		let errorNotChanged = error === this.error


		// console.log({ error, nestedError: this.nestedError, nested: !this.context.validation })
		if (errorNotChanged) return

		// console.warn({ error, nestedError: this.nestedError, nested: !this.context.validation })

		this.error = error
		if (name && onChange) {
			return onChange({ [name]: error })
		}
	}

	handleNestedChange = validity => {
		let { name } = this.props

		this.nestedError = validity[name]
	}


	render () {
		let { children } = this.props

		return (
			<ValidationContext.Provider value={this.state}>
				{children}
			</ValidationContext.Provider>
		)
	}
}