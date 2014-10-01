var pathindex = require('level-path-index')

module.exports = getTree

function getTree(db, opts){
	var tree = pathindex(db, '_tree', function(key, value, emit){
		
		var digger = value._digger || {};

		(digger.class || []).forEach(function(c){
			emit(key, 'class', c)
		})

		if(digger.diggerid){
			emit(key, 'diggerid', digger.diggerid)
		}

		if(digger.tag){
			emit(key, 'tag', digger.tag)
		}

		if(digger.id){
			emit(key, 'id', digger.tag)
		}
	})

	return tree
}