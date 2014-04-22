var through = require('through2')
var cascade = require('cascade-stream')
var duplexer = require('reduplexer')

var AttrFilter = require('./attributefilter')
var TreeCascade = require('./treecascade')
var LoadDocuments = require('./loaddocuments')

var from = require('from2-array')

var Query = require('./query')

module.exports = getSelect

function getSelect(db, tree, opts){
	return function(selector, laststep){

		var query = Query(tree, selector, laststep)

		var filter = AttrFilter(tree, selector)
			//.pipe(TreeCascade(tree, selector, laststep))
			.pipe(LoadDocuments(tree, laststep))

		return function(path){
			return query(path)
				.pipe(AttrFilter(tree, laststep))
				.pipe(LoadDocuments(tree, laststep))
		}


/*
		return duplexer(input, output, {
			objectMode:true
		})*/


		/*




		var inputopen = true
		var warehousesopen = 0
		var warehouses = {}
		
		var output = through.obj()

		var input = through.obj(function(chunk, enc, nextid){

			console.log('-------------------------------------------');
			console.dir('input: ' + chunk);
			console.dir(selector.tag);
			var warehouseid = api.warehouse.resolve(chunk)

			var warehouse = warehouses[warehouseid]
			if(!warehouse){
				warehouse = warehouses[warehouseid] = warehouseQueryFactory(warehouseid, selector, laststep)
				warehousesopen++
			}

			var stream = warehouse(chunk)

			stream.pipe(output, {end:false})

			stream.on('end', function(){
				warehousesopen--
				if(!inputopen && warehousesopen<=0){
					console.log('-------------------------------------------');
					console.log('warehouse end');
					output.push()
				}
				
			})

			nextid()

		}, function(){
			inputopen = false
		})

		return duplexer(input, output, {
			objectMode:true
		})





		return cascade.obj(function(containerpath, add, next){
			console.log('-------------------------------------------');
			console.dir(containerpath);
			add(query(containerpath))
			next()
		}, function(){
			console.log('-------------------------------------------');
			console.log('-------------------------------------------');
			console.log('FINISH');
		})


		return through.obj(function(chunk, enc, cb){
			console.log('-------------------------------------------');
			console.log('input');
			console.dir(chunk);
			this.push({
				name:'test'
			})
			cb()
		})


		// the results will be piped through here
		var output = through.obj()
		// the source is a cascade stream of the original selector results
		// one stream trigger per input and multiple results per stream
		
		var input = cascade.obj(function(containerpath, add, next){
			console.log('-------------------------------------------');
			console.log('input the selector chain');
			console.dir(containerpath);
			add(query(containerpath))
			//next()
		})

		input.pipe(output)

		return duplexer(input, output, {
			objectMode:true
		})



		return through.obj(function(chunk, enc, cb){

			console.log('-------------------------------------------');
			console.log('-------------------------------------------');
			console.log('have data in the search streeam');
			console.dir(chunk);
			this.push({
				name:'test',
				_digger:{
					tag:'dfdf'
				}
			})
			cb()
		}, function(){
			console.log('-------------------------------------------');
			console.log('search closed');

		})
		/*
		// the merged results stream is sent through the pipeline which applies the filters
		.pipe(AttrFilter(tree, selector))
		// the pipeline is sent to the tree cascade which will load the tree results (if specified)
		.pipe(TreeCascade(tree, selector, laststep))
		// finally we get the ids of the matching models - transform them into documents if we are last step
		.pipe(LoadDocuments(tree, laststep))
		// send to output
		.pipe(output)

		return duplexer(input, output, {
			objectMode:true
		})*/
	}
}