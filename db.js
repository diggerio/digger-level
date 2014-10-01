var getTree = require('./db/tree')
var folders = require('./db/folders')
var getSelect = require('./db/select')
var getAppend = require('./db/append')
var getSave = require('./db/save')
var getRemove = require('./db/remove')

module.exports = function(db, opts){
	opts = opts || {}
	
	// tree is a level-path-index object
	var tree = getTree(db, opts)

	var api = {
		select:getSelect(db, tree, opts),
		append:getAppend(db, tree, opts),
		save:getSave(db, tree, opts),
		remove:getRemove(db, tree, opts),
		folders:folders(db, tree, opts)
	}

	return api	
}