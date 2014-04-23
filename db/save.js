var through = require('through2')

module.exports = getSave

function getSave(db, tree, opts){
	return function(req){
		return through.obj(function(chunk, enc, cb){
			var self = this;
			if(chunk._digger.path + '/' + chunk._digger.inode != req.url){
				return cb('URL error ' + chunk._digger.path + '/' + chunk._digger.inode + ' vs ' + req.url)
			}
			var entry = {
				type:'put',
				key:req.url,
				value:chunk
			}
			tree.batch([entry], function(err){
				if(err) return cb(err)
				self.push(chunk)
				cb()
			})
		})
	}
}