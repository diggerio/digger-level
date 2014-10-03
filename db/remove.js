var through = require('through2')

module.exports = getRemove

function getRemove(db, tree, opts){
	return function(req){

		return through.obj(function(chunk, enc, cb){
			var self = this;

			var parts = chunk.split('/')
			var inode = parts.pop()
			var path = parts.join('/')

			var ids = []
			tree.descendentKeyStream(chunk).pipe(through.obj(function(d, enc, dcb){
				ids.push(d)
				dcb()
			}, function(){
				var entries = ids.map(function(d){
					return {
						type:'del',
						key:d
					}
				})

				tree.batch(entries, function(err){
					if(err) return cb(err)
					
					self.push({
						_digger:{
							path:path,
							inode:inode
						}
					})
					cb()
				})

			}))
/*
				var entries = descendents.map(function(d){
					return {
						type:'del',
						key:d._digger.path + '/' + d._digger.inode
					}
				})

				console.log('-------------------------------------------');
				console.dir(entries);
				process.exit();

				tree.batch(entries, function(err){
					if(err) return cb(err)
					self.push(chunk)
					cb()
				})
			}))
*/

		})
	}
}