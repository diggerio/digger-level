var pathindex = require('level-path-index')
var utils = require('digger-utils')

module.exports = getTree

function getTree(db, opts){
	var tree = pathindex(db, '_tree', function(key, value, emit){
		
		var digger = value._digger || {};

		(digger.class || []).forEach(function(c){
			emit(key, 'class', c)
		})

		if(digger.tag){
			emit(key, 'tag', digger.tag)
		}

		if(digger.id){
			emit(key, 'tag', digger.tag)
		}

		emit(key, 'name', value.name)
	})

	return tree
}