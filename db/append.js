var through = require('through2')
var from = require('from2')
var concat = require('concat-stream')
var utils = require('digger-utils')


module.exports = getAppend

function getAppend(db, tree, opts){
	return function(context, model, done){

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
}