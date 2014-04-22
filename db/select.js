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
		var loadtree = through.obj()
		var docs = LoadDocuments(tree, laststep)

		attr.pipe(loadtree).pipe(docs)

		var filter = duplexer(attr, docs, {
			objectMode:true
		})

		return {
			filter:filter,
			select:queryfactory
		}
	
	}
}