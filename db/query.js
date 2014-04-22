var through = require('through2');
var duplexer = require('reduplexer')
var AttrFilter = require('./attributefilter')
var TreeCascade = require('./treecascade')
var LoadDocuments = require('./loaddocuments')

module.exports = Query

function Query(tree, selector, laststep){

	selector = selector || {}

	var query = {}
	var streamMethod = selector.splitter=='>' ? 'childKeyStream' : 'descendentKeyStream'

	if(selector.tag && selector.tag!=='*'){
		query.tag = selector.tag
	}

	if(selector.id){
		query.id = selector.id
	}

	var classnames = Object.keys(selector.class || {})

	if(classnames.length){
		query.class = classnames
	}

	if(!Object.keys(query || {}).length){
		query = null
	}

	var attr = AttrFilter(tree, selector)
	var docs = LoadDocuments(tree, laststep)
	var loadtree = TreeCascade(tree, selector, laststep)

	return function(path){
		path = path.replace(/^\/warehouse/, '')		
		return tree[streamMethod].apply(tree, [path, query]).pipe(through.obj(function(chunk, enc, cb){
			console.log('-------------------------------------------');
			console.dir(chunk);
			this.push(chunk)
			cb()
		}))
		.pipe(attr())
		.pipe(docs())

		/*
			.pipe(attr())
			.pipe(docs())
			.pipe(loadtree())*/
	}
}