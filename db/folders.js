var through = require('through2')
var from = require('from2-array')
var concat = require('concat-stream')
var utils = require('digger-utils')

module.exports = function(db, tree, opts){
	return function(path, done){
		ensure(db, tree, path, done)
	}
}

function ensure(db, tree, path, done){

	var partBuffer = []
	var allfolders = 
		path
			.replace(/^\//, '')
			.replace(/\/$/, '')
			.split('/')
			.map(function(name){
				var part = {
					path:'/' + partBuffer.join('/'),
					name:name
				}
				partBuffer.push(name)
				return part
			})

	from
	.obj(allfolders)
	.pipe(through.obj(function(chunk, enc, cb){
		var self = this;

		db.get(chunk.path + '/' + chunk.name, function(err, folder){
			if(!folder) {
				chunk.folder = {
					name:chunk.name,
					_digger:{
						tag:'folder',
						path:chunk.path,
						inode:chunk.name,
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
				key:f.folder._digger.path + '/' + f.folder._digger.inode,
				value:f.folder
			}
		})

		tree.batch(batch, function(err){
			if(err) return done(err)

			done(null, folders)
		})

	}))
}
