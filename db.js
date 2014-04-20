var through = require('through2')
var from = require('from2')
var concat = require('concat-stream')
var pathindex = require('level-path-index')
var utils = require('digger-utils')

module.exports = function(db, opts){
	opts = opts || {}
	
	var tree = pathindex(db, '_tree', function(key, value, emit){
		
		var digger = value._digger || {};

		(digger.class || []).forEach(function(c){
			emit(key, 'class', c)
		})

		if(digger.tag){
			emit(key, 'tag', digger.tag)
		}

		if(digger.id){
			emit(key, 'tag', digger.tag)
		}

		emit(key, 'name', value.name)
	})

	var api = {
		// load an array of folders based on the path
		folders:function(path, done){
			var parts = path.split('/')

			from.obj(function(size, cb){
				if(parts.length<=0) return this.push(null)

				var p = parts.join('/')
				var name = parts.pop()

				this.push({
					path:p,
					name:name
				})
				cb()
			}).pipe(through.obj(function(chunk, enc, cb){
				var self = this;
				db.get(chunk.path, function(err, folder){
					if(!folder) {
						chunk.folder = {
							name:chunk.name,
							_digger:{
								tag:'folder',
								path:chunk.path,
								inode:utils.littleid(),
								diggerid:utils.diggerid(),
								created:new Date().getTime()
							}
						}
						chunk.create = true;
					}
					else {
						chunk.folder = folder
					}
					self.push(chunk)
					cb()
				})
			})).pipe(concat(function(folders){

				var batch = folders.filter(function(f){
					return f.create
				}).map(function(f){

					return {
						type:'put',
						key:f.folder._digger.path,
						value:f.folder
					}
				})

				tree.batch(batch, function(err){
					if(err) return done(err)
					
					done(null, folders)
				})

			}))
			
		}
	}

	return api	
}