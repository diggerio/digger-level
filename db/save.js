var through = require('through2')
var from = require('from2')
var concat = require('concat-stream')
var utils = require('digger-utils')

module.exports = getSave

function getSave(db, tree, opts){
	return function(context, model, done){
		console.log('-------------------------------------------');
		console.log('save');
		console.dir(context);
		console.dir(model);
		done(null, model)
	}
}