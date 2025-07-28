import PropTypes from 'prop-types'

import noop from '../utils/noop'
import FormData, { EMPTY } from './FormData'

let EMPTY_VALUES = Object.freeze([])

export default class FormArrayData extends FormData {
	static propTypes = {
		...FormData.propTypes,
		values: PropTypes.array
	}
	static defaultProps = {
		name    : undefined,
		values  : EMPTY_VALUES,
		onChange: noop
	}
	static [EMPTY] = EMPTY_VALUES
}