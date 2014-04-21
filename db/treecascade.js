var through = require('through2')
var cascade = require('cascade-stream')

module.exports = TreeCascade

function TreeCascade(tree, selector, laststep){

	var filter = through.obj()
	
	if(!selector.modifier || !selector.modifier.tree || !laststep){
		return filter
	}

	return cascade.obj(function(chunk, add, cb){

		add(tree.descendentKeyStream(chunk))
		cb()

	})

}