function concatClass(a, b) {
	if (a && a.indexOf(b) > -1) return a;
	return a ? b ? (a + ' ' + b) : a : (b || '');
};

const ellipsis = {
	name: "ellipsis",
	install: (el, {arg = '90%',value}) => {
		if (!value) {
			value = ""
		}
		const title = value.replace(/<.*?>/ig, "");
		el.className = concatClass(el.className, "commom-overflow")
		el.innerHTML = value;
		el.style.maxWidth = arg.includes('%') ?  arg : `${arg}px`;
		el.title = title;
	}
}

export default ellipsis
