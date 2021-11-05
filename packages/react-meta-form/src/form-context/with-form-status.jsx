import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import StatusContext from './StatusContext'

const DEFAULT_STATUS = Object.freeze({})

export default function withFormStatus (Component) {
	class FormElement extends React.Component {
		static displayName = Component.displayName || Component.name
		static Origin = Component.Origin || Component
		static contextType = StatusContext
		static propTypes = Component.propTypes
		static defaultProps = Component.defaultProps
		render () {
			let { props, context } = this
			let { status, STATUS } = context
			let formStatus         = DEFAULT_STATUS

			if (status && STATUS) {
				formStatus = Object.freeze({
					pending  : status === STATUS.PENDING,
					submitted: status === STATUS.SUBMITTED,
					failed   : status === STATUS.FAILED
				})
			}
			return <Component {...props} status={formStatus} />
		}
	}
	hoistNonReactStatics(FormElement, Component)

	return FormElement
}