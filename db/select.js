var through = require('through2')
var from = require('from2')
var Find = require('digger-find')
var concat = require('concat-stream')
var utils = require('digger-utils')
var duplexer = require('reduplexer')

module.exports = getSelect

function getSelect(db, tree, opts){
	return function(selector, laststep){
		selector = selector || {}

		console.log('-------------------------------------------');
		console.log('make wasrehouse');
		console.dir(selector);
		process.exit();

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

		var filter = null;

		if(selector.args && selector.args.length>0){
			filter = Find.compile({
				args:selector.args
			})
		}

		var queriesOpen = 0

		var input = through.obj(function(path, enc, inputcb){

			console.log('-------------------------------------------');
			console.log('input');
			console.dir(path);
			queriesOpen++
			var results = tree[streamMethod].apply(tree, [path, query])

			results.pipe(through.obj(function(chunk, enc, childcb){
				pipeline.push(chunk)
				childcb()
			}, function(){
				queriesOpen--
				if(queriesOpen<=0){
					pipeline.push(null)
				}
			}))

			inputcb()
		})


		var output = through.obj()

		var treeQueriesOpen = 0

		var pipeline = through.obj(function(chunk, env, cb){
				var self = this;
				if(laststep || filter){
					db.get(chunk, function(err, doc){
						self.push(doc)
						cb()
					})
				}
				else{
					this.push('/warehouse' + chunk)
					return cb()
				}
			})
			// filter attributes
			.pipe(through.obj(function(chunk, env, cb){
				var self = this;

				if(filter){
					if(filter(chunk)){
						this.push(chunk)
					}
				}
				else{
					this.push(chunk)
				}
				cb()
			}))
			// load tree
			.pipe(through.obj(function(chunk, env, cb){
				var self = this;

				// we needed the data loaded but its not the last step
				// so we flatten it back into digger url
				if(filter && !laststep && typeof(chunk)!=='string'){
					output.push(chunk._digger.path + '/' + chunk._digger.inode)
				}
				else{
					output.push(chunk)
				}
				
				cb()
			}, function(){
				output.push(null)
			}))


		return duplexer(input, output, {
			objectMode:true
		})

	}
}