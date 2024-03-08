
export const emoji = {
	tree       : '\u{1f333}',
	basket     : '\u{1f9fa}',
	pie        : '\u{1f967}',
	apple      : '\u{1f34e}',
	cherry     : '\u{1f352}',
	strawberry : '\u{1f353}',
	bang       : '\u{1f4a5}',
	trophy     : '\u{1f3c6}',
	broom      : '\u{1f9f9}',
	thinking   : '\u{1f4ad}',
	x          : '\u2716',
	help       : '\u2754',
	ok         : '\u2705',
	cancel     : '\u274c',
	back       : '\u25c0'
}

export const emojiToName = e => {
	for ( let name of emoji ) if ( emoji[name] == e ) return name
}

export const fruit = [ 'apple', 'cherry', 'strawberry' ]
export const atoms = [ 'tree', 'basket', 'pie', ...fruit ]

export const stopIt = event => {
	event.stopPropagation()
	event.preventDefault()
}

export const openHelp = () => {
	helptext.style.display = 'block'
	controls.style.display = 'none'
}

export const closeHelp = () => {
	helptext.style.display = 'none'
	controls.style.display = 'block'
}
