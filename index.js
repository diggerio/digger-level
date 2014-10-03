var getTree = require('./db/tree')
var folders = require('./db/folders')
var getSelect = require('./db/select')
var getAppend = require('./db/append')
var getSave = require('./db/save')
var getRemove = require('./db/remove')
var EventEmitter = require('events').EventEmitter

module.exports = function(db, opts){
	opts = opts || {}
	
	// tree is a level-path-index object
	var tree = getTree(db, opts)

	var api = new EventEmitter()

	api.select = getSelect(db, tree, opts)
	api.append = getAppend(db, tree, opts)
	api.save = getSave(db, tree, opts)
	api.remove = getRemove(db, tree, opts)
	api.folders = folders(db, tree, opts)
	
	return api	
}