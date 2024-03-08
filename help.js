
import { emoji, stopIt, openHelp } from './utils.js'

const emojify = text =>
	Array.from(
		text.replaceAll( 't', emoji.tree )
			.replaceAll( 'b', emoji.basket )
			.replaceAll( 'p', emoji.pie )
			.replaceAll( 'a', emoji.apple )
			.replaceAll( 'c', emoji.cherry )
			.replaceAll( 's', emoji.strawberry )
	).join( ' &nbsp; ' )

const helpNames = {
	whatif  : 'what if',
	undo    : 'undo',
	forage  : 'forage',
	harvest : 'harvest',
	claim   : 'claim',
	whoops  : 'whoops',
	bake    : 'bake'
}

const helpTexts = {
	whatif : `
		<p>The "what if" action allows you to imagine any sequence of tasty
		tree, pie, and fruit emoji you like and add it to the game board.</p>
		<p>Well, okay, that's not exactly true.  The sequences of emoji have
		special meanings, and you can only insert a sequence that means
		something.  Here are some example sequences you can insert:</p>
		<table border=0>
		<tr><td>${emojify('ta')}</td><td>&nbsp;</td><td>a tree with apples on it</td></tr>
		<tr><td>${emojify('tacs')}</td><td>&nbsp;</td><td>a tree with several fruits on it</td></tr>
		<tr><td>${emojify('bcas')}</td><td>&nbsp;</td><td>a basket with several fruits in it</td></tr>
		<tr><td>${emojify('ps')}</td><td>&nbsp;</td><td>a pie with one fruit in it</td></tr>
		</table>
		<p><b>Short story: Every sequence of emoji has to start with
		${emojify('t')}, ${emojify('b')}, or ${emojify('p')}, so we know what
		is holding the fruit.</b>  After that, you can put as many fruit emoji as
		you like (but it has to be at least one).</p>
		<p>When you finish building your "what if" sequence, click the
		${emoji.ok} button to put it onto the game board, or the ${emoji.cancel}
		button to cancel.</p>
		<p>All new "what if" sequences act like a hypothetical (that is, an
		assumption or given) in a formal proof.  That is, adding a new "what if"
		indents the inserted line deeper than the line that came before.</p>
	`,
	forage : `
		<p>The "forage" action lets you go out into the woods and look for a
		fruit tree of a specific type.  Click the ${emojify('a')} button to look
		for an apple tree, the ${emojify('c')} button for a cherry tree, and
		the ${emojify('s')} button for a strawberry tree.</p>
		<p>Good news!  You're always guaranteed to find the kind of tree you're
		looking for when you go foraging.  The result will be a new line on your
		game board that looks like one of these:</p>
		<ul>
			<li>${emojify('ta')}</li>
			<li>${emojify('tc')}</li>
			<li>${emojify('ts')}</li>
		</ul>
	`,
	harvest : `
		<p>The "harvest" action lets you harvest exactly three pieces of fruit
		from any of the trees accessible to you.  The word "accessible" here
		means the same thing it does in formal proofs with indentation for
		subproofs: a subproof's lines are no longer accessible after the
		subproof is closed.</p>
		<p>The drop-down boxes in the "harvest" action let you choose which
		fruits you want to harvest (literally picking them! haha!).  Once you've
		made your selections, click the ${emoji.basket} button to harvest them.
		The result will be a new line on your game board that looks like the
		following one, except with whatever combination of fruits you selected:</p>
		<ul>
			<li>${emojify('bsca')}</li>
		</ul>
		<p>If the "harvest" action is not usable, that probably means you don't
		have any trees on your game board.  Try adding a tree first by using the
		"forage" action.</p>
	`,
	whoops : `
		<p>Sometimes walking in the forest with a load of fruit can be tricky.
		I'm sure you've bonked into a tree by accident when your basket was so
		full you couldn't walk straight!  It's okay; it happens to all of us.</p>
		<p>When that happens, all the fruit in our basket falls at the base of
		the tree.  For example, if your basket looked like this:</p>
		<ul>
			<li>${emojify('bcca')}</li>
		</ul>
		<p>and the tree you bonked into looked like this:</p>
		<ul>
			<li>${emojify('ts')}</li>
		</ul>
		<p>then after all the fruit fell down it would look like this:</p>
		<ul>
			<li>${emojify('tscca')}</li>
		</ul>
		<p>If you want to intentionally bonk into a tree, feel free to do so!
		Just choose the tree from the drop-down list, the basket from the
		drop-down list, and click the ${emoji.bang} button to bonk!</p>
		<p>As you might expect, you can only choose a tree or a basket that is
		accessible to you.  The word "accessible" here
		means the same thing it does in formal proofs with indentation for
		subproofs: a subproof's lines are no longer accessible after the
		subproof is closed.</p>
		<p>If the "whoops" action is not usable, that probably means you don't
		have any trees on your game board, or perhaps you don't have any baskets
		on your game board.  Try adding a tree first by using the
		"forage" action, then adding a basket using the "harvest" action.</p>
	`,
	bake : `
		<p>I'm sure all this fruit is making you think of the absolute best
		thing to do with freshly picked fruit...make a pie!  All you have to do
		is pick from the drop-down list a basket that's accessible to you, and
		click the ${emoji.pie} button to bake the pie.</p>
		<p>But a pie can have only two types of fruit in it.
		(They're small pies, sorry.)  So if your basket looked like this:</p>
		<ul>
			<li>${emojify('bcas')}</li>
		</ul>
		<p>and you clicked ${emoji.pie} to bake a pie, you would get only the
		first two fruits from the basket in the pie:</p>
		<ul>
			<li>${emojify('pca')}</li>
		</ul>
		<p>The word "accessible" above
		means the same thing it does in formal proofs with indentation for
		subproofs: a subproof's lines are no longer accessible after the
		subproof is closed.</p>
	`,
	claim : `
		<p>There is a legend that says it's possible to reverse the baking
		process, turning a pie <i>back into a fruit basket.</i>  The legend is
		very old, but no one has been able to actually do what the legend says
		is possible.  Perhaps it is just a legend?</p>
		<p>More specifically, the legend says that you should be able to take a
		piece of one-fruit pie, like this:</p>
		<ul>
			<li>${emojify('pa')}</li>
		</ul>
		<p>and from that, get a basket containing just the one fruit in the pie,
		like this:</p>
		<ul>
			<li>${emojify('ba')}</li>
		</ul>
		<p>That example uses an apple, but the legend says it should work for
		cherry pie and strawberry pie, too.  Well, except nobody has been able
		to actually do it for any of the fruits, apple or otherwise!</p>
		<p>But there is a reward offered for the first person who can do it.
		More specifically, if you begin the game with a "what if" and use it to
		hypothesize a one-fruit pie (any of the following)</p>
		<ul>
			<li>${emojify('pa')}</li>
			<li>${emojify('ps')}</li>
			<li>${emojify('pc')}</li>
		</ul>
		<p>then do whatever work you want and end up with the corresponding
		one-fruit basket as the conclusion of the subproof
		(that is, the corresponding basket from the following list)</p>
		<ul>
			<li>${emojify('ba')}</li>
			<li>${emojify('bs')}</li>
			<li>${emojify('bc')}</li>
		</ul>
		<p>then you can invoke the <i>claim</i> action to claim the reward!
		${emoji.trophy}</p>
		<p>Unfortunately, when I hover my mouse over the ${emoji.trophy}
		button, it's always been unusable, because I've never managed to start
		a subproof with a fruit pie and the turn it back into the right fruit
		basket.  Oh well.  Maybe you'll do it some day.</p>
	`,
	undo : `
		<p>Hey, we all make mistakes.  If you want to erase the last line on
		the game board, just hit the ${emoji.broom} button to sweep it away.</p>
	`
}

window.addEventListener( 'load', () => {
	for ( let action in helpTexts ) {
		const title = helpNames[action].charAt( 0 ).toUpperCase()
		            + helpNames[action].slice( 1 )
		document.querySelector( `#help${action}` )
		.addEventListener( 'click', event => {
			stopIt( event )
			helpcontent.innerHTML = `
				<h2>Help on: ${title}</h2>
				${helpTexts[action]}
			`
			openHelp()
		} )
	}
} )

