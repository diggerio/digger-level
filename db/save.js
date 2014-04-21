var through = require('through2')

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