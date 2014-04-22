var through = require('through2')

module.exports = LoadDocuments

function LoadDocuments(tree, laststep){

	if(!laststep){
		return function(){
			return through.obj()
		}
	}

	function filter(chunk, enc, cb){
		var self = this;
		tree._db.get(chunk, function(err, doc){
			if(doc){
				self.push(doc)
			}
			cb()
		})
	}
	
	return function(){
		return through.obj(filter)	
	}
	
}