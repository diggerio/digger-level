module.exports = Query

function Query(tree, selector, laststep){

	selector = selector || {}

	var query = {}
	var streamMethod = selector.splitter=='>' ? 'childKeyStream' : 'descendentKeyStream'

	if(selector.tag && selector.tag!=='*'){
		query.tag = selector.tag
	}

	if(selector.id){
		query.id = selector.id
	}

	var classnames = Object.keys(selector.class || {})

	if(classnames.length){
		query.class = classnames
	}

	if(!Object.keys(query || {}).length){
		query = null
	}

	return function(path){
		return tree[streamMethod].apply(tree, [path, query])
	}
}