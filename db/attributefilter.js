var Find = require('digger-find')
var through = require('through2')
var duplexer = require('reduplexer')

module.exports = AttributeFilter

function AttributeFilter(tree, selector){

	if(!selector.attr || selector.attr.length<=0){
		return function(){
			return through.obj()
		}
	}

	var filterfn = Find.compile({
		attr:selector.attr
	})

	function filter(chunk, enc, cb){
		var self = this;
		console.log('attr');
		console.dir(chunk);
		tree._db.get(chunk, function(err, doc){
			if(err) return cb(err)
				console.dir(doc);
			if(filterfn(doc)){
				console.log('-------------------------------------------');
				console.log('pass');
				self.push(chunk)
			}
			cb()
		})
	}

	return function(){
		return through.obj(filter)	
	}
}