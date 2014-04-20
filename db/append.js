var through = require('through2')
var from = require('from2')
var concat = require('concat-stream')
var utils = require('digger-utils')

module.exports = getAppend

function getAppend(db, tree, opts){
	return function(context, model, done){
		return done(null, {
			test:10
		})
		/*
		console.log('-------------------------------------------');
		console.log('-------------------------------------------');
		console.log('appending!');

		console.log('-------------------------------------------');

		var list = utils.flatten_tree(model)

		console.dir(list);
		process.exit();
		console.dir(context);
		console.dir(model);
		process.exit();*/
		
	}
}