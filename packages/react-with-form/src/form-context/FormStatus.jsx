import React from 'react'
import PropTypes from 'prop-types'

import StatusContext, { STATUS } from './StatusContext'
import noop from '../utils/noop'

export default class FormStatus extends React.PureComponent {
	static contextType = StatusContext
	static propTypes = {
		children   : PropTypes.node.isRequired,
		onChange   : PropTypes.func,
		onSubmitted: PropTypes.func,
		onFail     : PropTypes.func
	}
	static defaultProps = {
		onChange   : noop,
		onSubmitted: noop,
		onFail     : undefined
	}
	static STATUS = STATUS
	constructor (props, context) {
		super(props, context)

		/* eslint-disable react/no-unused-state */
		this.state = {
			STATUS,
			status  : STATUS.DEFAULT,
			onSubmit: this.handleSubmit
		}
		/* eslint-enable */
		this.mounted = false
	}
	componentDidMount () {
		this.mounted = true
	}
	componentWillUnmount () {
		this.mounted = false
	}
	handleSubmitted = result => {
		let status                    = STATUS.SUBMITTED
		let { onChange, onSubmitted } = this.props

		if (this.mounted) {
			this.setState({ status }) // eslint-disable-line react/no-unused-state
		}
		onChange(status)
		onSubmitted(result)
	}
	handleError = error => {
		let status               = STATUS.FAILED
		let { onChange, onFail } = this.props

		if (this.mounted) {
			this.setState({ status }) // eslint-disable-line react/no-unused-state
		}
		onChange(status)
		if (onFail) {
			onFail(error)
		}
		else {
			throw error
		}
	}
	handleSubmit = promise => {
		let { onChange }        = this.props
		let { onSubmit = noop } = this.context
		let status              = STATUS.PENDING

		this.setState({ status }) // eslint-disable-line react/no-unused-state
		onChange(status)
		onSubmit(
			promise.then(this.handleSubmitted, this.handleError)
		)
	}

	render () {
		let { children } = this.props

		return (
			<StatusContext.Provider value={this.state}>
				{children}
			</StatusContext.Provider>
		)
	}
}