var through = require('through2')

module.exports = LoadDocuments

function LoadDocuments(tree, selector, laststep){

	if(!laststep){
		return function(){
			return through.obj()
		}
	}

	function filter(chunk, enc, doccb){
		var self = this;
		tree._db.get(chunk, function(err, doc){
			if(doc){

				if(selector.modifier && selector.modifier.tree){
					var loadFrom = doc._digger.path + '/' + doc._digger.inode

					tree.descendentStream(loadFrom)
						.pipe(through.obj(function(descendent, enc, descb){
							self.push(descendent.value)
							descb()
						}, function(){
							doccb()
						}))

				}
				else{
					self.push(doc)
					doccb()
				}
			}
			else{
				doccb()
			}
		})
	}
	
	return function(){
		return through.obj(filter)	
	}
	
}