import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import ValidationContext from './ValidationContext'

export default function withNativeValidation (Component) {
	class ValidationItem extends React.Component {
		static displayName = Component.displayName || Component.name
		static Origin = Component.Origin || Component
		static contextType = ValidationContext
		static propTypes = Component.propTypes
		static defaultProps = {
			...Component.defaultProps,
			name   : undefined,
			value  : undefined,
			checked: undefined,
			hint   : undefined,
			valid  : undefined
		}

		constructor (props, context) {
			super(props, context)
			this.field = props.innerRef || React.createRef()
			this.state = {
				valid    : true,
				error    : undefined,
				validator: this.validator,
				disabled : this.disabled,
				silent   : this.silent
			}
		}

		componentDidMount () {
			let { validator, disabled, silent } = this
			let { value, valid, hint }          = this.props
			let hasOwnValid                     = valid !== undefined
			// eslint-disable-next-line init-declarations
			let error

			if (disabled) return

			if (hasOwnValid) {
				error = valid ? undefined : hint
			}
			else {
				let nativeValidationMessage = this.validateNatively()
				let nativelyInvalid         = Boolean(nativeValidationMessage)

				if (nativelyInvalid) {
					valid = false
					error = nativeValidationMessage
				}
				else {
					let contextValidationMessage = this.validateContextually(value)

					valid = !contextValidationMessage
					error = contextValidationMessage
				}
			}

			// eslint-disable-next-line react/no-did-mount-set-state
			this.setState({
				valid,
				error,
				validator,
				disabled,
				silent
			}, this.handleChange)
		}

		componentDidUpdate (previousProps, previousState) {
			let { disabled, silent, validator } = this
			let { value, checked, hint, valid } = this.props
			let valueHasChanged                 = value !== previousProps.value
			let checkedHasChanged               = checked !== previousProps.checked
			let childrenHasChanged              = hint !== previousProps.hint
			let validHasChanged                 = valid !== previousProps.valid
			let disabledHasChanged              = disabled !== previousState.disabled
			let silentHasChanged                = silent !== previousState.silent
			let validatorHasChanged             = validator !== previousState.validator

			if (valueHasChanged
				|| checkedHasChanged
				|| childrenHasChanged
				|| validHasChanged
				|| disabledHasChanged
				|| silentHasChanged
				|| validatorHasChanged
			) {
				this.componentDidMount()
			}
		}

		get validator () {
			let { name }       = this.props
			let { validation } = this.context

			return validation && validation[name]
		}

		get disabled () {
			return this.context.disabled
		}
		get silent () {
			return this.context.silent
		}

		validateNatively () {
			let nativeElement         = this.field.current
			let valid                 = nativeElement.checkValidity()
			let { validationMessage } = nativeElement

			return valid ? null : validationMessage
		}

		validateContextually (value) {
			let { validator }            = this
			let contextValidationMessage = validator && validator(value)

			return contextValidationMessage || null
		}

		handleChange = () => {
			let { onChange } = this.context
			let { name }     = this.props
			let { error }    = this.state

			if (name && onChange) {
				onChange({ [name]: error })
			}
		}

		render () {
			let { hint }                 = this.props
			let { valid, error, silent } = this.state
			let statusHint               = error || hint

			if (silent) {
				valid      = true
				statusHint = hint
			}

			return (
				<Component
					{...this.props}
					innerRef={this.field}
					valid={valid}
					hint={statusHint}
				/>
			)
		}
	}
	hoistNonReactStatics(ValidationItem, Component)

	return ValidationItem
}