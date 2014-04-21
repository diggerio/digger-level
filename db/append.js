var through = require('through2')
var utils = require('digger-utils')
var duplexer = require('reduplexer')
var Folders = require('./folders')

module.exports = getAppend

function getAppend(db, tree, opts){

	var folders = Folders(db, tree, opts)

	// append a single model
	function appendModel(url, model, done){
		var list = utils.flatten_tree(JSON.parse(JSON.stringify(model)))

		var errormodel = null

		list = list.filter(function(model){
			if(!model._digger.path || !model._digger.inode){
				errormodel = model;
				return false;
			}
			return true
		})

		if(errormodel){
			return done('no path or inode in level-append: ' + JSON.stringify(model))
		}

		var batch = list.map(function(model){
			return {
				type:'put',
				key:model._digger.path + '/' + model._digger.inode,
				value:model
			}
		})

		tree.batch(batch, function(err){
			if(err) return done(err)
			done(null, model)
		})
	}

	return function(req){

		var foldersEnsured = false
		function ensurefolders(cb){
			if(foldersEnsured) return cb()
			foldersEnsured = true
			folders(req.url, cb)
		}
	

		// each append model will go through here
		// we pause to make sure the folders are ensured
		var input = through.obj(function(chunk, enc, cb){
			var self = this;
			ensurefolders(function(){
				self.push(chunk)
				cb()
			})
		})

		// the actual append stream - proxy to the db
		var output = through.obj(function(chunk, enc, cb){
			var self = this;
			appendModel(req.url, chunk, function(err, data){
				if(err) return cb(err)
				self.push(chunk)
				cb()
			})
		})

		input.pipe(output)

		return duplexer(input, output, {
	    objectMode: true
	  })
	}
}