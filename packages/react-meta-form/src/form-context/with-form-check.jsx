import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import DataContext from './DataContext'
import noop from '../utils/noop'

let emptyContext = {}

export default function withFormCheck (Component) {
	class FormCheckItem extends React.Component {
		static displayName = Component.displayName || Component.name
		static Origin = Component.Origin || Component
		static contextType = DataContext
		static propTypes = Component.propTypes
		static defaultProps = {
			...Component.defaultProps,
			name    : undefined,
			value   : true,
			checked : undefined,
			onChange: noop
		}

		componentDidMount () {
			let { onChange: contextOnchange } = this.context
			let { name, value, checked }      = this.props
			let hasOwnChecked                 = checked !== undefined

			value = checked ? value : undefined
			if (name && contextOnchange && hasOwnChecked) {
				contextOnchange({ [name]: value })
			}
		}

		componentDidUpdate (previousProps) {
			let { onChange: contextOnchange, values } = this.context
			let { name, value, checked }              = this.props
			let hasOwnChecked                         = checked !== undefined
			let newCheckPassed                        = checked !== previousProps.checked
			let hasNotContextValue                    = !(values && (name in values))

			// let contextValue = values && values[name]
			// let valueChanged = value !== contextValue
			value = checked ? value : undefined
			if (name && contextOnchange && hasOwnChecked && (newCheckPassed || hasNotContextValue)) {
				// console.log('updates', { name, value, newValuePassed, hasNotContextValue });
				contextOnchange({ [name]: value })
			}
		}

		handleChange = value => {
			let { name, onChange } = this.props
			let contextOnchange    = this.context.onChange

			if (name && contextOnchange) {
				contextOnchange({ [name]: value })
			}
			onChange(value)
		}
		render () {
			let { props, context, handleChange } = this
			let { name, checked }                = props
			let hasContextValue                  = context.values && (name in context.values)
			let contextValue                     = hasContextValue ? context.values[name] : undefined

			if (hasContextValue) {
				checked = Boolean(contextValue)
			}

			// console.info('render', { name, checked, contextValue });
			return (
				<DataContext.Provider value={emptyContext}>
					<Component {...props} checked={checked} onChange={handleChange} />
				</DataContext.Provider>
			)
		}
	}
	hoistNonReactStatics(FormCheckItem, Component)

	return FormCheckItem
}