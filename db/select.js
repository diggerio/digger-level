var through = require('through2')
var cascade = require('cascade-stream')
var duplexer = require('reduplexer')

var AttrFilter = require('./attributefilter')
var TreeCascade = require('./treecascade')
var LoadDocuments = require('./loaddocuments')

var Query = require('./query')

module.exports = getSelect

function getSelect(db, tree, opts){
	return function(selector, laststep){

		var query = Query(tree, selector, laststep)

		// the results will be piped through here
		var output = through.obj()

		console.log('-------------------------------------------');
		console.dir('make stream');
		console.dir(selector);

		// the source is a cascade stream of the original selector results
		// one stream trigger per input and multiple results per stream
		/*
		var input = cascade.obj(function(chunk, add, next){

			console.log('-------------------------------------------');
			console.log('input');
			console.dir(chunk);
			console.dir(selector);
			process.exit();
			add(query(chunk))
			next()
		})

		return input*/

		return through.obj(function(chunk, enc, cb){

			console.log('-------------------------------------------');
			console.log('-------------------------------------------');
			console.log('have data in the search streeam');
			console.dir(chunk);
			this.push({
				name:'test'
			})
			cb()
		}, function(){
			console.log('-------------------------------------------');
			console.log('search closed');

		})
		/*
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
		})*/
	}
}