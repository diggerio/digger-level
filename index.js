var through = require('through2')
var DB = require('./db')
var duplexer = require('reduplexer')

module.exports = function(leveldb, opts){
	opts = opts || {}

	var db = DB(leveldb, opts)

	var api = {
		db:db,

		// return a read-stream
		// output are the selector results
		get:function(req){
			var path = req.url
			var selector = req.headers['x-digger-selector']
			var laststep = req.headers['x-digger-laststep']
			return db.select(selector, laststep ? true : false)
		},
		// return a duplex-stream
		// input is data to append to context
		// output is the processed appended data
		post:function(req){

			// ensure folders means there are entries folder each folder up to '/'
			var foldersEnsured = false;
			function ensurefolders(cb){
				if(foldersEnsured) return cb()
				foldersEnsured = true
				db.folders(req.url, cb)
			}

			// each append model will go through here
			// we pause to make sure the folders are ensured
			var input = through.obj(function(chunk, enc, cb){
				var self = this;
				ensurefolders(function(){
					self.push(chunk)
					cb()
				})
			})

			// the actual append stream - proxy to the db
			var append = through.obj(function(chunk, enc, cb){
				var self = this;
				db.append(req.url, chunk, function(err, data){
					if(err) return cb(err)
					self.push(chunk)
					cb()
				})
			})

			// output filter
			var output = through.obj(function(chunk, enc, cb){
				this.push(chunk)
				cb()
			})

			input.pipe(append).pipe(output)

			var duplex = duplexer(input, output, {
		    objectMode: true
		  })

			return duplex
		},
		// return a duplex-stream
		// input is the data to be saved to the context
		// output is the processed saved data
		put:function(req){
			return through.obj(function(chunk, enc, cb){
				var self = this;
				db.save(req.url, chunk, function(err, data){
					if(err) return cb(err)
					self.push(chunk)
					cb()
				})
			})
		},
		// return a read-stream
		// output is the deleted data
		delete:function(req){
			return from.obj(function(c, next){
				var self = this;
				db.remove(req.url, function(err){
					self.push(null)
					next(err)
				})
			})
		}
	}

	return api;

	
}