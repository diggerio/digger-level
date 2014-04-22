var through = require('through2')

module.exports = LoadDocuments

function LoadDocuments(tree, laststep){

	var filter = through.obj()
	
	if(!laststep){
		return filter
	}

	return through.obj(function(chunk, add, cb){
		var self = this;
		if(typeof(chunk)!=='string'){
			this.push(chunk)
			return cb()
		}
		tree._db.get(chunk, function(err, doc){
			if(doc){
				self.push(doc)
			}
			cb()
		})
	})

}