import React from 'react'
import PropTypes from 'prop-types'

import { FormData, FormValidation } from './form-context'
import StatusContext from './form-context/StatusContext'
import noop from './utils/noop'


export default class Form extends React.PureComponent {
	static contextType = StatusContext
	static propTypes = {
		onSubmit    : PropTypes.func.isRequired,
		onReset     : PropTypes.func,
		className   : PropTypes.string,
		autoComplete: PropTypes.oneOf(['on', 'off']),
		children    : PropTypes.node,
		values      : FormData.propTypes.values,
		onChange    : FormData.propTypes.onChange,
		onError     : PropTypes.func,
		validation  : FormValidation.propTypes.validation,
		onInvalid   : FormValidation.propTypes.onInvalid,
		onValid     : FormValidation.propTypes.onValid,
		role        : PropTypes.string
	}
	static defaultProps = {
		onReset     : noop,
		className   : '',
		autoComplete: 'on',
		children    : null,
		values      : FormData.defaultProps.values,
		onChange    : FormData.defaultProps.onChange,
		onError     : noop,
		validation  : FormValidation.defaultProps.validation,
		onInvalid   : FormValidation.defaultProps.onInvalid,
		onValid     : FormValidation.defaultProps.onValid,
		role        : undefined
	}

	state = {
		submitted: false,
		valid    : true
	}

	values = {}

	componentDidMount () {
		this.values = this.props.values
	}
	componentDidUpdate (previousProps) {
		let currentValues  = this.props.values
		let previousValues = previousProps.values

		if (currentValues !== previousValues) {
			this.values = { ...this.values, ...this.props.values }
		}
	}
	handleSubmit = event => {
		let { onSubmit, onError }         = this.props
		let { valid }                     = this.state
		let { onSubmit: contextOnSubmit } = this.context

		event.preventDefault()
		this.setState({ submitted: true })

		if (valid) {
			let whenSubmitted = Promise.resolve(this.values).then(onSubmit)

			contextOnSubmit(whenSubmitted)
		}
		else {
			onError(this.values)
		}
	}
	handleReset = event => {
		event.preventDefault()
		this.setState({ submitted: false })
		this.props.onReset()
	}
	handleChange = values => {
		this.values = values
		this.props.onChange(values)
	}
	handleValid = validity => {
		this.setState({ valid: true })
		this.props.onValid(validity)
	}
	handleInvalid = errors => {
		this.setState({ valid: false })
		this.props.onInvalid(errors)
	}

	render () {
		let {
			children, values, className, autoComplete, validation, role
		} = this.props
		let { submitted }   = this.state
		let validationMuted = !submitted

		return (
			<form
				onSubmit={this.handleSubmit}
				onReset={this.handleReset}
				className={className}
				autoComplete={autoComplete}
				noValidate
				role={role}
			>
				<FormData values={values} onChange={this.handleChange}>
					<FormValidation
						silent={validationMuted}
						validation={validation}
						onInvalid={this.handleInvalid}
						onValid={this.handleValid}
					>
						{children}
					</FormValidation>
				</FormData>
			</form>
		)
	}
}