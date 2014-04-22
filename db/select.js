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
		var queryfactory = Query(tree, selector, laststep)

		var attr = AttrFilter(tree, selector)
		var docs = LoadDocuments(tree, laststep)
		var loadtree = TreeCascade(tree, selector, laststep)

		attr.pipe(docs).pipe(loadtree)

		var filter = duplexer(attr, loadtree, {
			objectMode:true
		})

		return {
			filter:filter,
			select:queryfactory
		}
	
	}
}