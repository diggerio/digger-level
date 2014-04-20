var through = require('through2')
var DB = require('./db')

function errorstream(st){
	return through.obj(function(chunk, enc, cb){
		cb(st)
	})
}

module.exports = function(leveldb, opts){
	opts = opts || {}

	var db = DB(leveldb, opts)

	var api = {
		// return a read-stream
		// output are the selector results
		get:function(req, selector){
			console.log('-------------------------------------------');
			console.log('-------------------------------------------');
			console.log('get');
			console.dir(context);
			console.dir(selector);
		},
		// return a duplex-stream
		// input is data to append to context
		// output is the processed appended data
		post:function(req){
			console.log('-------------------------------------------');
			console.log('-------------------------------------------');
			console.log('post');
			console.dir(req.url);
		
			var foldersEnsured = false;

			return through.obj(function(chunk, enc, cb){
				var self = this
				if(!foldersEnsured){
					db.folders(req.url, function(err, folders){
						if(err) return cb(err)
						console.log('-------------------------------------------');
						console.dir(folders);
						process.exit();
						foldersEnsured = true
						self.push(chunk)
						cb()
					})
				}
				else{
					this.push(chunk)
					cb()
				}

			})
		},
		// return a duplex-stream
		// input is the data to be saved to the context
		// output is the processed saved data
		put:function(req){
			console.log('-------------------------------------------');
			console.log('-------------------------------------------');
			console.log('put');
			console.dir(context);
		},
		// return a read-stream
		// output is the deleted data
		delete:function(req){
			console.log('-------------------------------------------');
			console.log('-------------------------------------------');
			console.log('delete');
			console.dir(context);
		}
	}

	return api;

	
}