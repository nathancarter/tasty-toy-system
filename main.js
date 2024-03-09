
import { emoji, fruit, atoms, stopIt, closeHelp } from './utils.js'

const uiSetup = () => {
	for ( let name of fruit ) {
		document.querySelector( `#add${name}` ).textContent = emoji[name]
		document.querySelector( `#forage${name}` ).textContent = emoji[name]
	}
	;[ ...document.querySelectorAll( 'span' ) ].forEach( span => {
		if ( span.getAttribute( 'id' )?.startsWith( 'help' ) )
			span.textContent = emoji.help
	} )
	;[ ...document.querySelectorAll( 'select' ) ].forEach( select => {
		select.innerHTML = `<option>${emoji.x}</option>`
		select.disabled = true
	} )
	harvest.textContent = emoji.basket
	bake.textContent = emoji.pie
	whoops.textContent = emoji.bang
	claim.textContent = emoji.trophy
	undo.textContent = emoji.broom
	whatif.textContent = emoji.thinking
	builderback.textContent = emoji.back
	builderok.textContent = emoji.ok
	buildercancel.textContent = emoji.cancel
	helpok.textContent = emoji.ok
	closeBuilder()
	closeHelp()
}

let gameState
let buildState

const gameSetup = () => {
	gameState = [ ]
	showGame()
}

const clearBoard = () => gameboard.innerHTML = ''

const formatExpr = array =>
	array.length == 0 ? emoji.help : array.join( ' &nbsp; ' )

const indent = ( amount, html ) =>
	`<span style="margin-left: ${amount*3}em;">${html}</span>`

const addMove = ( move, accessible ) => {
	if ( typeof( move ) == 'string' ) {
		move = `<span class="announcement">${move}</span>`
	} else {
		const reason = move.reason
		move = indent( move.indent, formatExpr( move.expression ) )
		move = `<span class="movespan">${move}</span>
				<span class="reasonspan">${reason}</span>`
	}
	const accessibleClass = accessible ? 'accessible' : 'inaccessible'
	gameboard.innerHTML += `<div class="move ${accessibleClass}">${move}</div>`
}

const showGame = () => {
	clearBoard()
	const accessibles = accessibleIndices()
	if ( gameState.length > 0 ) {
		gameState.forEach( ( move, index ) =>
			addMove( move, accessibles.includes( index ) ) )
	} else {
		addMove( 'To start a new Tasty Toy Game, use the buttons below.' )
	}
	updateHarvestOptions()
	updateWhoopsOptions()
	updateBakeOptions()
	updateClaimButton()
	updateUndoButton()
}

const enableBuilderButton = ( name, on ) => {
	const button = document.querySelector( 
		atoms.includes( name ) ? `#add${name}` : `#builder${name}` )
	button.textContent = on ? emoji[name] : emoji.x
	button.dataset.enabled = on
}

const showBuild = () => {
	expression.innerHTML = formatExpr( buildState )
	enableBuilderButton( 'tree', buildState.length == 0 )
	enableBuilderButton( 'basket', buildState.length == 0 )
	enableBuilderButton( 'pie', buildState.length == 0 )
	enableBuilderButton( 'back', buildState.length > 0 )
	const fruitEmoji = fruit.map( name => emoji[name] )
	enableBuilderButton( 'ok', buildState.length > 0
		&& !fruitEmoji.includes( buildState[0] )
		&& fruitEmoji.includes( buildState[buildState.length-1] ) )
}

const lastIndent = () =>
	gameState.length == 0 ? 0 : gameState[gameState.length-1].indent

const openBuilder = () => {
	builder.style.display = 'block'
	controls.style.display = 'none'
}

const closeBuilder = () => {
	builder.style.display = 'none'
	controls.style.display = 'block'
}

window.addEventListener( 'load', () => {
	uiSetup()
	gameSetup()
	handlerSetup()
} )

const accessibleIndices = () => {
	const result = [ ]
	let maxIndent = lastIndent()
	for ( let i = gameState.length - 1 ; i >= 0 ; i-- ) {
		const line = gameState[i]
		if ( line.indent > maxIndent ) continue
		maxIndent = line.indent
		result.unshift( i )
	}
	return result
}

const accessibleLines = () =>
	accessibleIndices().map( i => gameState[i].expression )

const updateHarvestOptions = () => {
	const available = [ ]
	accessibleLines().forEach( expression => {
		if ( expression.length == 2 && expression[0] == emoji.tree
		  && !available.includes( expression[1] ) )
			available.push( expression[1] )
	} )
	available.sort()
	for ( let i = 1 ; i <= 3 ; i++ ) {
		const select = document.querySelector( `#harvest${i}` )
		select.disabled = available.length == 0
		select.innerHTML = available.length > 0 ?
			available.map( e =>
				`<option value="${e}">${e}</option>` ).join( '' ) :
			`<option>${emoji.x}</option>`
	}
	harvest.dataset.enabled = available.length > 0
}

const updateWhoopsOptions = () => {
	const trees = [ ]
	const baskets = [ ]
	accessibleLines().forEach( expression => {
		const shortForm = formatExpr( expression )
		if ( expression.length == 2 && expression[0] == emoji.tree
		  && !trees.includes( shortForm ) )
		  	trees.push( shortForm )
		if ( expression.length == 4 && expression[0] == emoji.basket
		  && !baskets.includes( shortForm ) )
		  	baskets.push( shortForm )
	} )
	trees.sort()
	baskets.sort()
	whoops1.disabled = trees.length == 0
	whoops1.innerHTML = trees.length > 0 ?
		trees.map( sf => `<option value="${sf}">${sf}</option>` ).join( '' ) :
		`<option>${emoji.x}</option>`
	whoops2.disabled = baskets.length == 0
	whoops2.innerHTML = baskets.length > 0 ?
		baskets.map( sf => `<option value="${sf}">${sf}</option>` ).join( '' ) :
		`<option>${emoji.x}</option>`
	whoops.dataset.enabled = trees.length > 0 && baskets.length > 0
}

const updateBakeOptions = () => {
	const baskets = [ ]
	accessibleLines().forEach( expression => {
		const shortForm = formatExpr( expression )
		if ( expression.length == 4 && expression[0] == emoji.basket
		  && !baskets.includes( shortForm ) )
		  	baskets.push( shortForm )
	} )
	baskets.sort()
	bakechoice.disabled = baskets.length == 0
	bakechoice.innerHTML = baskets.length > 0 ?
		baskets.map( sf => `<option value="${sf}">${sf}</option>` ).join( '' ) :
		`<option>${emoji.x}</option>`
	bake.dataset.enabled = baskets.length > 0
}

const finalSubproof = () => {
	if ( gameState.length == 0 ) return
	const lastIndex = gameState.length - 1
	const lastLine = gameState[lastIndex]
	if ( lastLine.indent == 0 ) return
	for ( let i = lastIndex ; i >= 0 ; i-- )
		if ( gameState[i].indent < lastLine.indent )
			return [ i + 1, lastIndex ]
	if ( gameState[0].indent == 1 && lastLine.indent == 1 )
		return [ 0, lastIndex ]
}

const claimShouldBeEnabled = () => {
	const indices = finalSubproof()
	if ( !indices ) return false
	const assumption = gameState[indices[0]].expression
	const conclusion = gameState[indices[1]].expression
	return assumption.length == 2 && assumption[0] == emoji.pie
		&& conclusion.length == 2 && conclusion[0] == emoji.basket
		&& assumption[1] == conclusion[1]
}

const updateClaimButton = () => claim.dataset.enabled = claimShouldBeEnabled()

const updateUndoButton = () => undo.dataset.enabled = gameState.length > 0

const handlerSetup = () => {
	whatif.addEventListener( 'click', event => {
		stopIt( event )
		openBuilder()
		buildState = [ ]
		showBuild()
	} )
	builderback.addEventListener( 'click', event => {
		stopIt( event )
		buildState.pop()
		showBuild()
	} )
	builderok.addEventListener( 'click', event => {
		stopIt( event )
		gameState.push( {
			indent : lastIndent() + 1,
			expression : buildState.slice(),
			reason : 'What if...'
		} )
		closeBuilder()
		showGame()
	} )
	buildercancel.addEventListener( 'click', event => {
		stopIt( event )
		closeBuilder()
	} )
	atoms.forEach( name => {
		document.querySelector( `#add${name}` )
		.addEventListener( 'click', event => {
			stopIt( event )
			if ( !fruit.includes( name ) && buildState.length > 0 ) return
			buildState.push( emoji[name] )
			showBuild()
		} )
	} )
	fruit.forEach( name => {
		document.querySelector( `#forage${name}` )
		.addEventListener( 'click', event => {
			stopIt( event )
			gameState.push( {
				indent : lastIndent(),
				expression : [ emoji.tree, emoji[name] ],
				reason : 'Forage'
			} )
			showGame()
		} )
	} )
	harvest.addEventListener( 'click', event => {
		stopIt( event )
		if ( harvest.dataset.enabled == 'false' ) return
		const picked = [ harvest1.value, harvest2.value, harvest3.value ]
		gameState.push( {
			indent : lastIndent(),
			expression : [ emoji.basket, ...picked ],
			reason : 'Harvest'
		} )
		showGame()
	} )
	whoops.addEventListener( 'click', event => {
		stopIt( event )
		if ( whoops.dataset.enabled == 'false' ) return
		const fruitEmoji = fruit.map( f => emoji[f] )
		const allFruit = Array.from( whoops1.value + whoops2.value )
			.filter( character => fruitEmoji.includes( character ) )
		gameState.push( {
			indent : lastIndent(),
			expression : [ emoji.tree, ...allFruit ],
			reason : 'Whoops'
		} )
		showGame()
	} )
	bake.addEventListener( 'click', event => {
		stopIt( event )
		if ( bake.dataset.enabled == 'false' ) return
		const fruitEmoji = fruit.map( f => emoji[f] )
		const allFruit = Array.from( bakechoice.value )
			.filter( character => fruitEmoji.includes( character ) )
		gameState.push( {
			indent : lastIndent(),
			expression : [ emoji.pie, ...allFruit.slice( 0, 2 ) ],
			reason : 'Bake'
		} )
		showGame()
	} )
	claim.addEventListener( 'click', event => {
		stopIt( event )
		if ( claim.dataset.enabled == 'false' ) return
		const indices = finalSubproof()
		gameState.push( {
			indent : lastIndent() - 1,
			expression : gameState[indices[0]].slice(),
			reason : 'Claim'
		} )
		showGame()
	} )
	undo.addEventListener( 'click', event => {
		stopIt( event )
		if ( undo.dataset.enabled == 'false' ) return
		gameState.pop()
		showGame()
	} )
	helpok.addEventListener( 'click', event => {
		stopIt( event )
		closeHelp()
	} )
}

