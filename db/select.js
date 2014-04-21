var through = require('through2')
var cascade = require('cascade-stream')
var duplexer = require('reduplexer')

var AttrFilter = require('./attrfilter')
var TreeCascade = require('./treecascade')
var LoadDocuments = require('./loaddocuments')

var Query = require('./query')

module.exports = getSelect

function getSelect(db, tree, opts){
	return function(selector, laststep){

		var query = Query(tree, selector, laststep)

		// the results will be piped through here
		var output = through.obj()

		// the source is a cascade stream of the original selector results
		// one stream trigger per input and multiple results per stream
		var input = cascade.obj(function(chunk, add, next){
			add(query(chunk))
			next()
		})
		// the merged results stream is sent through the pipeline which applies the filters
		.pipe(AttrFilter(tree, selector))
		// the pipeline is sent to the tree cascade which will load the tree results (if specified)
		.pipe(TreeCascade(tree, selector, laststep))
		// finally we get the ids of the matching models - transform them into documents if we are last step
		.pipe(LoadDocuments(tree, laststep))
		// send to output
		.pipe(output)

		return duplexer(input, output, {
			objectMode:true
		})
	}
}