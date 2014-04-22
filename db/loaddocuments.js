var through = require('through2')

module.exports = LoadDocuments

function LoadDocuments(tree, laststep){

	if(!laststep){
		return through.obj()
	}
	
	// mapper onto documents
	return through.obj(function(chunk, enc, cb){
		var self = this;
		tree._db.get(chunk, function(err, doc){
			if(doc){
				self.push(doc)
			}
			cb()
		})
	})
}