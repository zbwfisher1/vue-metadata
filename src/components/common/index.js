import TableHeader from "./TableHeader/index"
import Loading from "./Loading/index"
import NoData from "./NoData/index"
import MoreLoading from './MoreLoading/index'

const components = [
	TableHeader,
	Loading,
	NoData,
  MoreLoading
]
const commonComponents = {
	install(Vue) {
		components.map((val) => val.install(Vue))
	}
}

export default commonComponents
