var through = require('through2')
var cascade = require('cascade-stream')
var duplexer = require('reduplexer')

var AttrFilter = require('./attributefilter')
var TreeCascade = require('./treecascade')
var LoadDocuments = require('./loaddocuments')

var from = require('from2-array')

var Query = require('./query')

module.exports = getSelect

function getSelect(db, tree, opts){
	return function(selector, laststep){

		var query = Query(tree, selector, laststep)

		var filter = AttrFilter(tree, selector)
			//.pipe(TreeCascade(tree, selector, laststep))
			.pipe(LoadDocuments(tree, laststep))

		return {
			filter:filter,
			select:query
		}
	
	}
}