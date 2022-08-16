import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import DataContext from './DataContext'
import noop from '../utils/noop'

let emptyContext = {}

export default function withFormValue (Component) {
	class FormValueItem extends React.Component {
		static displayName = Component.displayName || Component.name
		static Origin = Component.Origin || Component
		static contextType = DataContext
		static propTypes = Component.propTypes
		static defaultProps = {
			...Component.defaultProps,
			name    : undefined,
			value   : undefined,
			onChange: noop
		}

		componentDidMount () {
			let { onChange: contextOnChange, values } = this.context
			let { name, value }                       = this.props
			let hasOwnValue                           = value !== undefined
			let hasContextValue                       = values && (name in values)

			if (name && contextOnChange) {
				if (hasOwnValue) {
					contextOnChange({ [name]: value })
				}
				else if (hasContextValue) {
					contextOnChange({ [name]: values[name] })
				}
			}
		}

		componentDidUpdate (previousProps) {
			let { onChange: contextOnChange, values } = this.context
			let { name, value }                       = this.props
			let hasOwnValue                           = value !== undefined
			let newValuePassed                        = value !== previousProps.value
			let hasNotContextValue                    = !(values && (name in values))
			// let contextValue = values && values[name]
			// let valueChanged = value !== contextValue

			if (name && contextOnChange && hasOwnValue && (newValuePassed || hasNotContextValue)) {
				// console.log('updates', { name, value, newValuePassed, hasNotContextValue });
				contextOnChange({ [name]: value })
			}
		}

		componentWillUnmount () {
			let { onChange: contextOnChange } = this.context
			let { name }                      = this.props

			if (name && contextOnChange) {
				contextOnChange({ [name]: undefined })
			}
		}

		handleChange = value => {
			let { name, onChange } = this.props
			let contextOnChange    = this.context.onChange

			if (name && contextOnChange) {
				contextOnChange({ [name]: value })
			}
			onChange(value)
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