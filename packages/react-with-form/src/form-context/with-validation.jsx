import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import ValidationContext from './ValidationContext'
import Validity from './Validity'

export default function withValidation (Component) {
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
				valid: true,
				error: undefined
			}
		}

		handleInvalid = error => {
			this.setState({ valid: false, error })

			return error
		}

		handleValid = () => {
			this.setState({ valid: true, error: undefined })
		}

		validate = value => {
			let nativeElement = this.field.current

			return Validity.validateDomElement(nativeElement) || this.validateExternally(value)
		}

		validateExternally (value) {
			let { name }                 = this.props
			let { validation }           = this.context
			let validator                = validation && validation[name]
			let contextValidationMessage = validator && validator(value)

			return contextValidationMessage || undefined
		}

		render () {
			let { hint, name, value, valid: validProp } = this.props
			let { valid, error }                        = this.state
			let { silent }                              = this.context
			let statusHint                              = error || hint

			if (silent) {
				valid      = true
				statusHint = hint
			}

			return (
				<Validity
					name={name}
					value={value}
					hint={hint}
					valid={validProp}
					onValidate={this.validate}
					onValid={this.handleValid}
					onInvalid={this.handleInvalid}
				>
					<Component
						{...this.props}
						innerRef={this.field}
						valid={valid}
						hint={statusHint}
					/>
				</Validity>
			)
		}
	}
	hoistNonReactStatics(ValidationItem, Component)

	return ValidationItem
}