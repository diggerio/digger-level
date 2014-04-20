var through = require('through2')
var from = require('from2')
var concat = require('concat-stream')
var utils = require('digger-utils')

module.exports = function(db, tree, opts){
	return {
		get:getFolders(db, tree, opts),
		through:throughFolders(db, tree, opts)
	}
}

function getFolders(db, tree, opts){
	return function(path, done){
		ensure(db, tree, path, done)
	}
}

function throughFolders(db, tree, opts){
	var get = getFolders(db, tree, opts)
	return function(path){
		var foldersEnsured = false;
		return through.obj(function(chunk, enc, cb){
			var self = this
			if(!foldersEnsured){
				get(path, function(err, folders){
					if(err) return cb(err)
					foldersEnsured = true
					self.push(chunk)
					cb()
				})
			}
			else{
				self.push(chunk)
				cb()
			}
		})
	}
}

function ensure(db, tree, path, done){
	var parts = path.split('/')

	var allfolders = []

	while(parts.length>0){
		var p = parts.join('/')
		var name = parts.pop()

		if(!p || !p.length){
			p = '/'
		}

		if(!name || !name.length){
			name = 'root'
		}

		allfolders.unshift({
			path:p,
			name:name
		})
	}

	from.obj(function(size, cb){
		if(allfolders.length<=0) return this.push(null)
		cb(null, allfolders.shift())
	}).pipe(through.obj(function(chunk, enc, cb){
		var self = this;

		db.get(chunk.path, function(err, folder){
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
