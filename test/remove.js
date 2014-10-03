var Server = require('digger-server')
var Client = require('digger-client')
var concat = require('concat-stream')
var Folders = require('../db/folders')
var diggerlevel = require('../')

var level    = require('level-test')()
var sub = require('level-sublevel')

var db = sub(level('level-digger--remove', {encoding: 'json'}))


describe('digger-level remove', function(){

  var digger = Server()
  var client = Client()
  
  digger.warehouse(diggerlevel(db))
  client.on('request', digger.reception.bind(digger))

  digger.on('request', function(type, req){
    
  })
  var mainstart = new Date().getTime()

  var warehouse = client.connect('/cities')

  before(function(done){
    this.timeout(1000)

    var data = client.create(require(__dirname + '/fixtures/cities.json'))

    warehouse.append(data).ship(function(data){

      db.createReadStream().pipe(concat(function(vs){
        vs.forEach(function(e){
          //console.dir(e.key);
        })
        done()
      }))
      
    })
  })

  describe('remove', function(){


    it('should remove with all descendents', function(done){

      warehouse('country[name^=U]').ship(function(country){

        country.remove().ship(function(){
          warehouse('city').ship(function(cities){
            cities.count().should.equal(2)
            done()
          })
        })

      })
      
    })

  })


})
