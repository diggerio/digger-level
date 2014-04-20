var getTree = require('./db/tree')
var folders = require('./db/folders')
var getAppend = require('./db/append')

module.exports = function(db, opts){
	opts = opts || {}
	
	var tree = getTree(db, opts)

	var api = {
		append:getAppend(db, tree, opts),
		folders:folders(db, tree, opts)
	}

	return api	
}