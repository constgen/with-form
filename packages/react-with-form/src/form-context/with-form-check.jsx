import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import PropTypes from 'prop-types'

import DataContext from './DataContext'
import noop from '../utils/noop'
import isDefined from '../utils/is-defined'

let emptyContext = {}

export default function withFormCheck (Component) {
	class FormCheckItem extends React.Component {
		static displayName = Component.displayName || Component.name
		static Origin = Component.Origin || Component
		static contextType = DataContext
		static propTypes = {
			name    : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			value   : PropTypes.any,
			checked : PropTypes.bool,
			onChange: PropTypes.func
		}
		static defaultProps = {
			...Component.defaultProps,
			name    : undefined,
			value   : true,
			checked : undefined,
			onChange: noop
		}

		componentDidMount () {
			let { onUpdate: contextOnUpdate, values } = this.context
			let { name, value, checked }              = this.props
			let hasOwnChecked                         = checked !== undefined
			let hasContextValue                       = values && (name in values)
			let hasNotContextValue                    = !hasContextValue

			if (!(isDefined(name) && contextOnUpdate)) return

			if (hasOwnChecked && hasContextValue) {
				contextOnUpdate({ [name]: checked ? values[name] : undefined })
			}
			else if (hasOwnChecked || hasNotContextValue) {
				contextOnUpdate({ [name]: checked ? value : undefined })
			}
			else {
				contextOnUpdate({ [name]: undefined })
			}
		}

		componentDidUpdate (previousProps) {
			let { onUpdate: contextOnUpdate, values } = this.context
			let { name, value, checked }              = this.props
			let hasOwnChecked                         = checked !== undefined
			let newCheckPassed                        = checked !== previousProps.checked
			let hasNotContextValue                    = !(values && (name in values))

			// let contextValue = values && values[name]
			// let valueChanged = value !== contextValue
			value = checked ? value : undefined
			if (isDefined(name) && contextOnUpdate && hasOwnChecked && (newCheckPassed || hasNotContextValue)) {
				// console.info('updates', { name, value, newValuePassed, hasNotContextValue });
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