var Find = require('digger-find')
var through = require('through2')

module.exports = AttributeFilter

function AttributeFilter(tree, selector){

	var filter = through.obj()
	
	if(!selector.attr || selector.attr.length<=0){
		return filter
	}

	var filterfn = Find.compile({
		attr:selector.attr
	})

	filter = filter
		// map onto documents ready for the filter
		.pipe(through.obj(function(chunk, enc, cb){
			var self = this;
			tree.db.get(chunk, function(err, doc){
				if(err) return cb(err)
				self.push({
					doc:doc,
					path:chunk
				})
				cb()
			})
		}))

		// apply the filter
		.pipe(through.obj(function(chunk, enc, cb){
			if(filterfn(chunk.doc)){
				this.push(chunk.path + '/')
			}
			cb()
		}))


}