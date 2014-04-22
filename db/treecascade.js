var through = require('through2')
var duplexer = require('reduplexer')
var cascade = require('cascade-stream')

module.exports = TreeCascade

function TreeCascade(tree, selector, laststep){

	var filter = through.obj()
	
	if(!selector.modifier || !selector.modifier.tree || !laststep){
		return filter
	}

	return through.obj(function(chunk, enc, nextinput){
		var self = this;
		var loadFrom = chunk._digger.path + '/' + chunk._digger.inode
		tree.descendentStream(loadFrom).pipe(through.obj(function(chunk, enc, cb){
			self.push(chunk.value)
			cb()
		}, function(){
			nextinput()
		}))
	})
}