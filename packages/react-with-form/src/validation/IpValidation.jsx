import React from 'react'
import PropTypes from 'prop-types'

import { FormValidation } from '../form-context'
import RegExpValidation from './RegExpValidation'

export default class IpValidation extends React.PureComponent {
	static propTypes = {
		children : PropTypes.node,
		onChange : (FormValidation.propTypes || {}).onChange,
		onValid  : (FormValidation.propTypes || {}).onValid,
		onInvalid: (FormValidation.propTypes || {}).onInvalid,
		className: PropTypes.string
	}
	static defaultProps = {
		children : null,
		onChange : FormValidation.defaultProps.onChange,
		onValid  : FormValidation.defaultProps.onValid,
		onInvalid: FormValidation.defaultProps.onInvalid,
		className: ''
	}
	static rules = {
		// '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
		// '^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\\.|$)){1,4}'
		'^(([0-9]{1,2}|[0-1][0-9]{2}|2[0-4][0-9]|25[0-5])(\\.|$)){1,4}$': 'Each octet of the address can be only between 0 and 255',
		'^((0|[^0][0-9]*)(\\.|$)){1,4}$'                                : 'Octet can’t start with a leading zero',
		'^.{1,3}\\..{1,3}\\..{1,3}\\..{1,3}$'                           : 'IPv4 must contain 4 octets separated by periods',
		'^[\\d.]+$'                                                     : 'IPv4 can contain only numbers and periods'
	}

	render () {
		let {
			children, onChange, onValid, onInvalid, className
		} = this.props
		let { rules } = this.constructor

		return (
			<RegExpValidation
				rules={rules}
				className={className}
				onChange={onChange}
				onValid={onValid}
				onInvalid={onInvalid}
			>
				{children}
			</RegExpValidation>
		)
	}
}