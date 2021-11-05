import React from 'react';
import PropTypes from 'prop-types';

import { FormData, FormValidation } from '../form-context';

export default class IpValidation extends React.PureComponent {
	static propTypes = {
		children: PropTypes.node,
		onChange: (FormValidation.propTypes || {}).onChange,
		onValid: (FormValidation.propTypes || {}).onValid,
		onInvalid: (FormValidation.propTypes || {}).onInvalid,
		className: PropTypes.string
	};
	static defaultProps = {
		children: null,
		onChange: FormValidation.defaultProps.onChange,
		onValid: FormValidation.defaultProps.onValid,
		onInvalid: FormValidation.defaultProps.onInvalid,
		className: ''
	};
	static rules = {
		// '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
		// '^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\\.|$)){1,4}'
		'^(([0-9]{1,2}|[0-1][0-9]{2}|2[0-4][0-9]|25[0-5])(\\.|$)){1,4}$': 'Each octet of the address can be only between 0 and 255',
		'^((0|[^0][0-9]*)(\\.|$)){1,4}$': 'Octet can’t start with a leading zero',
		'^.{1,3}\\..{1,3}\\..{1,3}\\..{1,3}$': 'IPv4 must contain 4 octets separated by periods',
		'^[\\d.]+$': 'IPv4 can contain only numbers and periods'
	};
	state = {
		validation: {}
	};

	validateIp = value => {
		if (!value) return;
		let { className } = this.props;
		let violation = Object.entries(IpValidation.rules)
			.map(function toRegExp ([expression, message]) {
				return {
					expression: new RegExp(expression),
					message
				};
			})
			.find(function validate ({ expression }) {
				return !expression.test(value);
			});

		if (!violation) return;
		if (className) {
			return <div className={className}>{violation.message}</div>;
		}
		return violation.message;
	};
	handleValuesChange = values => {
		let { validateIp } = this;

		let validation = Object.keys(values)
			.reduce(function (rules, name) {
				rules[name] = validateIp;
				return rules;
			}, {});

		this.setState({ validation });
	};

	render () {
		let { children, onChange, onValid, onInvalid } = this.props;
		let { validation } = this.state;

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
		);
	}
}