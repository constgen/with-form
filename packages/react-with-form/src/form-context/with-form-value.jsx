import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import PropTypes from 'prop-types'

import DataContext from './DataContext'
import noop from '../utils/noop'
import isDefined from '../utils/is-defined'

let emptyContext = {}

export default function withFormValue (Component) {
	class FormValueItem extends React.Component {
		static displayName = Component.displayName || Component.name
		static Origin = Component.Origin || Component
		static contextType = DataContext
		static propTypes = {
			name    : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			value   : PropTypes.any,
			onChange: PropTypes.func
		}
		static defaultProps = {
			name    : undefined,
			value   : undefined,
			onChange: noop
		}

		componentDidMount () {
			let { onUpdate: contextOnUpdate, values } = this.context
			let { name, value }                       = this.props
			let hasOwnValue                           = value !== undefined
			let hasContextValue                       = (values && (name in values))

			if (isDefined(name) && contextOnUpdate) {
				// console.info('mount', { name, value, hasOwnValue, hasContextValue })
				if (hasOwnValue) {
					contextOnUpdate({ [name]: value })
				}
				else if (hasContextValue) {
					contextOnUpdate({ [name]: values[name] })
				}
				else {
					contextOnUpdate({ [name]: undefined })
				}
			}
		}

		componentDidUpdate (previousProps) {
			let { onUpdate: contextOnUpdate, values } = this.context
			let { name, value }                       = this.props
			let hasOwnValue                           = value !== undefined
			let newValuePassed                        = value !== previousProps.value
			let hasNotContextValue                    = !(values && (name in values))
			// let contextValue = values && values[name]
			// let valueChanged = value !== contextValue

			if (isDefined(name) && contextOnUpdate && hasOwnValue && (newValuePassed || hasNotContextValue)) {
				// console.info('updates', { name, value, newValuePassed, hasNotContextValue })
				contextOnUpdate({ [name]: value })
			}
		}

		componentWillUnmount () {
			let { onRemove: contextOnRemove } = this.context
			let { name }                      = this.props

			if (isDefined(name) && contextOnRemove) {
				contextOnRemove(name)
			}
		}

		handleChange = value => {
			let { name, onChange } = this.props
			let contextOnUpdate    = this.context.onUpdate

			if (isDefined(name) && contextOnUpdate) {
				contextOnUpdate({ [name]: value })
			}
			return onChange(value)
		}
		render () {
			let { props, context, handleChange } = this
			let { name, value }                  = props
			let hasContextValue                  = context.values && (name in context.values)
			let contextValue                     = hasContextValue ? context.values[name] : undefined

			if (hasContextValue) {
				value = contextValue
			}

			// console.info('render', { name, value, contextValue });
			return (
				<DataContext.Provider value={emptyContext}>
					<Component {...props} value={value} onChange={handleChange} />
				</DataContext.Provider>
			)
		}
	}
	hoistNonReactStatics(FormValueItem, Component)

	return FormValueItem
}