var through = require('through2');
var duplexer = require('reduplexer')
var AttrFilter = require('./attributefilter')
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

	var diggerpath = null

	if(selector.diggerid){
		if(selector.diggerid.indexOf('/')==0){
			diggerpath = selector.diggerid
		}
		else{
			query.diggerid = selector.diggerid	
		}
	}

	var classnames = Object.keys(selector.class || {})

	if(classnames.length){
		query.class = classnames
	}

	if(!Object.keys(query || {}).length){
		query = null
	}

	var attr = AttrFilter(tree, selector)
	var docs = LoadDocuments(tree, selector, laststep)

	return function(path){
		if(typeof(path)!=='string'){
			return 'path is not a string'
		}

		// this is load a single thing based on the path
		if(diggerpath){
			var stream = through.obj()
			tree._db.get(path + diggerpath, function(err, doc){
				if(err){
					stream.emit('error', err)
				}
				else{
					stream.write(doc)	
				}
				stream.end()
			})
			return stream
		}
		else{
			return tree[streamMethod].apply(tree, [path, query])
				.pipe(attr())
				.pipe(docs())
		}
	}
}
