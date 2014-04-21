var through = require('through2')

module.exports = LoadDocuments

function LoadDocuments(tree, laststep){

	var filter = through.obj()
	
	if(!laststep){
		return filter
	}

	return through.obj(function(chunk, add, cb){
		var self = this;
		tree.get(chunk, function(err, doc){
			if(err) return cb(err)
			self.push(doc)
			cb()
		})
	})

}