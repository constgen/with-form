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
			let { onChange: contextOnChange, values } = this.context
			let { name, value, checked }              = this.props
			let hasOwnChecked                         = checked !== undefined
			let hasContextValue                       = values && (name in values)
			let hasNotContextValue                    = !hasContextValue
			let contextValue                          = hasContextValue ? values[name] : undefined

			if (!(name && contextOnChange)) return

			if (hasOwnChecked && hasContextValue) {
				contextOnChange({ [name]: checked ? contextValue : undefined })
			}
			else if (hasOwnChecked || hasNotContextValue) {
				contextOnChange({ [name]: checked ? value : undefined })
			}
		}

		componentDidUpdate (previousProps) {
			let { onChange: contextOnChange, values } = this.context
			let { name, value, checked }              = this.props
			let hasOwnChecked                         = checked !== undefined
			let newCheckPassed                        = checked !== previousProps.checked
			let hasNotContextValue                    = !(values && (name in values))

			// let contextValue = values && values[name]
			// let valueChanged = value !== contextValue
			value = checked ? value : undefined
			if (name && contextOnChange && hasOwnChecked && (newCheckPassed || hasNotContextValue)) {
				// console.info('updates', { name, value, newValuePassed, hasNotContextValue });
				contextOnChange({ [name]: value })
			}
		}

		componentWillUnmount () {
			let { onRemove: contextOnRemove } = this.context
			let { name }                      = this.props

			if (name && contextOnRemove) {
				contextOnRemove(name)
			}
		}

		handleChange = value => {
			let { name, onChange } = this.props
			let contextOnChange    = this.context.onChange

			if (name && contextOnChange) {
				contextOnChange({ [name]: value })
			}
			return onChange(value)
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