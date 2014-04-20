var through = require('through2')
var DB = require('./db')

module.exports = function(leveldb, opts){
	opts = opts || {}

	var db = DB(leveldb, opts)

	var api = {
		db:db,
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

			// ensure the folders that we are appending to
			return db.folders.through(req.url).pipe(through.obj(function(chunk, enc, cb){
				var self = this;
				// the folders have been ensured
				// we are adding one model at a time now
				db.append(req.url, chunk, function(err, data){
					if(err) return cb(err)
					self.push(chunk)
					cb()
				})

			}))
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