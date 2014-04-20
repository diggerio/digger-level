var through = require('through2')
var from = require('from2')
var concat = require('concat-stream')
var utils = require('digger-utils')

module.exports = getSelect

function getSelect(db, tree, opts){
	return function(path, selector, laststep){
		selector = selector || {}

		var query = {}
		var streamMethod = selector.splitter=='>' ? 'childKeyStream' : 'descendentKeyStream'

		if(selector.tag){
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

		var stream = tree[streamMethod].apply(tree, [path, query])

		return stream.pipe(through.obj(function(chunk, env, cb){
			var self = this;
			if(!laststep){
				this.push(chunk)
				return cb()
			}

			db.get(chunk, function(err, doc){
				console.log('-------------------------------------------');
				console.dir(doc);
				self.push(doc)
				cb()
			})
			
		}))

	}
}