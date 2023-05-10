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
		hint      : PropTypes.any,
		valid     : PropTypes.bool,
		onValidate: PropTypes.func,
		onValid   : PropTypes.func,
		onInvalid : PropTypes.func,
		children  : PropTypes.node
	}
	static defaultProps = {
		name      : undefined,
		value     : undefined,
		checked   : undefined,
		hint      : undefined,
		valid     : undefined,
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
		this.error       = undefined
		this.nestedError = undefined
		this.state       = {
			disabled  : context.disabled,
			validation: context.validation,
			/* eslint-disable react/no-unused-state */
			silent    : context.silent,
			onChange  : this.handleNestedChange
			/* eslint-enable */
		}
	}

	componentDidMount () {
		this.validate()
	}

	componentDidUpdate (previousProps, previousState) {
		let { disabled, validation } = this.context
		let {
			name, value, checked, hint, valid, onValidate
		} = this.props
		let validator                = validation && validation[name]
		let previousValidator        = previousState.validation && previousState.validation[name]
		let nameChanged              = name !== previousProps.name
		let valueChanged             = value !== previousProps.value
		let checkedChanged           = checked !== previousProps.checked
		let hintChanged              = hint !== previousProps.hint
		let validChanged             = valid !== previousProps.valid
		let validationChanged        = onValidate !== previousProps.onValidate
		let disabledChanged          = disabled !== previousState.disabled
		let validatorChanged         = validator !== previousValidator

		if (nameChanged
			|| valueChanged
			|| checkedChanged
			|| hintChanged
			|| validChanged
			|| disabledChanged
			|| validationChanged
			|| validatorChanged
		) {
			this.validate()
		}
	}

	componentWillUnmount () {
		this.error = this.nestedError
		this.handleChange()
	}

	validate () {
		let { disabled, silent, validation } = this.context
		let {
			value, valid, hint, onValidate, onValid, onInvalid
		} = this.props
		let hasOwnValid                      = valid !== undefined
		let validationNotDisabled            = !disabled

		if (hasOwnValid) {
			this.error = valid ? undefined : hint
		}
		else if (validationNotDisabled) {
			this.error = onValidate(value)
		}
		else {
			this.error = undefined
		}
		this.error = this.error || this.nestedError

		// console.log({ error: this.error, nestedError: this.nestedError })

		this.setState({
			disabled,
			silent, // eslint-disable-line react/no-unused-state
			validation
		})

		if (this.error) {
			onInvalid(this.error)
		}
		else {
			onValid()
		}

		return this.handleChange()
	}

	handleChange = () => {
		let { onChange } = this.context
		let { name }     = this.props

		if (name && onChange) {
			return onChange({ [name]: this.error })
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