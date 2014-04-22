var through = require('through2')
var cascade = require('cascade-stream')
var duplexer = require('reduplexer')



var from = require('from2-array')

var Query = require('./query')

module.exports = getSelect

function getSelect(db, tree, opts){
	return function(selector, laststep){
		return Query(tree, selector, laststep)
	}
}