var Server = require('digger-server')
var Client = require('digger-client')
var concat = require('concat-stream')
var Folders = require('../db/folders')
var diggerlevel = require('../')

var level    = require('level-test')()
var sub = require('level-sublevel')

var db = sub(level('level-digger--save', {encoding: 'json'}))


describe('digger-level save', function(){

  var digger = Server()
  var client = Client()
  
  digger.use(diggerlevel(db))
  client.on('request', digger.reception.bind(digger))

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

  describe('save', function(){


    it('should do a basic save', function(done){

      warehouse('city.red area.blue').ship(function(areas){

        areas.attr('test', 'yo').save().ship(function(){
          warehouse('city.red area.blue').ship(function(areas2){
            areas2.eq(0).attr('test').should.equal('yo')
            areas2.eq(1).attr('test').should.equal('yo')
            done()

          })
        })

      })
      
    })

  })


})
