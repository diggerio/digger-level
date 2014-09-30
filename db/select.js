var Query = require('./query')

module.exports = getSelect

function getSelect(db, tree, opts){
	return function(selector, laststep){
		return Query(tree, selector, laststep)
	}
}