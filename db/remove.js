var through = require('through2')

module.exports = getRemove

function getRemove(db, tree, opts){
	return function(context, model, done){
		console.log('-------------------------------------------');
		console.log('remove');
		console.dir(context);
		console.dir(model);
		done(null, model)
	}
}