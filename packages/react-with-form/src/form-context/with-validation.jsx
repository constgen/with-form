import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import ValidationContext from './ValidationContext'
import Validity from './Validity'

export default function withValidation (Component) {
	class ValidationItem extends React.PureComponent {
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

		static getDerivedStateFromProps (props, state) {
			let { valid, hint } = props
			let { error }       = state
			let hasOwnValid     = valid !== undefined
			let invalid         = hasOwnValid && !valid

			if (hasOwnValid && invalid) {
				error = hint
			}
			valid = !error
			hint  = error || hint

			return { valid, hint }
		}

		constructor (props, context) {
			super(props, context)
			this.field = props.innerRef || React.createRef()
			this.state = {
				valid: undefined,
				hint : undefined,
				error: undefined
			}
		}

		handleInvalid = error => {
			this.setState({ error })

			return error
		}

		handleValid = () => {
			this.setState({ error: undefined })
		}

		validate = () => this.validateFromProps() || this.validateNative()

		validateNative () {
			let nativeElement = this.field.current

			// console.log(`native validate ${Component.displayName || Component.name}`)
			return Validity.validateDomElement(nativeElement)
		}

		validateFromProps () {
			let { validation }  = this.context
			let { valid, hint } = this.props
			let notNested       = Boolean(validation)
			let hasOwnValid     = valid !== undefined
			let invalid         = hasOwnValid && !valid

			if (notNested && invalid) {
				// console.log(`invalidate ${Component.displayName || Component.name}`)
				return hint
			}
		}

		render () {
			let { hint: hintProp, name, value, checked } = this.props
			let { valid, hint }                          = this.state
			let { silent }                               = this.context

			if (silent) {
				valid = true
				hint  = hintProp
			}

			// console.log(Component.displayName || Component.name, { valid, hint })
			return (
				<Validity
					name={name}
					value={value}
					checked={checked}
					onValidate={this.validate}
					onValid={this.handleValid}
					onInvalid={this.handleInvalid}
				>
					<Component
						{...this.props}
						innerRef={this.field}
						valid={valid}
						hint={hint}
					/>
				</Validity>
			)
		}
	}
	hoistNonReactStatics(ValidationItem, Component)

	return ValidationItem
}