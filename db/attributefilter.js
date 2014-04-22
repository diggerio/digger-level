var Find = require('digger-find')
var through = require('through2')
var duplexer = require('reduplexer')

module.exports = AttributeFilter

function AttributeFilter(tree, selector){

	if(!selector.attr || selector.attr.length<=0){
		return through.obj()
	}

	var filterfn = Find.compile({
		attr:selector.attr
	})

	return through.obj(function(chunk, enc, cb){
		var self = this;
		tree._db.get(chunk, function(err, doc){
			if(err) return cb(err)
			if(filterfn(doc)){
				self.push(chunk)
			}
			cb()
		})
	})
}