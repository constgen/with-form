import React from 'react';
import PropTypes from 'prop-types';

import { FormData, FormValidation } from '../form-context';

export default class PhoneValidation extends React.PureComponent {
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
		'^\\+?[^+]+$': 'The "+" sign in a phone number can only occur at the beginning',
		'^[\\d\\s()+-]+$': 'Phone number can contain only numbers, dashes, spaces, +, and parentheses'
	};
	state = {
		validation: {}
	};

	validatePhone = value => {
		if (!value) return;
		let { className } = this.props;
		let violation = Object.entries(PhoneValidation.rules)
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
		let { validatePhone } = this;

		let validation = Object.keys(values)
			.reduce(function (rules, name) {
				rules[name] = validatePhone;
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