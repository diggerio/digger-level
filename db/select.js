var Query = require('./query')

module.exports = getSelect

function getSelect(db, tree, opts){
	//return function(selector, laststep){
	return function(req){
		var selector = req.headers['x-digger-selector']
		var laststep = req.headers['x-digger-laststep']
		return Query(tree, selector, laststep)
	}
}