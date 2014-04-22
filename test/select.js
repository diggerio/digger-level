var Server = require('digger-server')
var Client = require('digger-client')
var concat = require('concat-stream')
var Folders = require('../db/folders')
var diggerlevel = require('../')

var level    = require('level-test')()
var sub = require('level-sublevel')

var db = sub(level('level-digger--select', {encoding: 'json'}))


describe('digger-level', function(){

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
          console.dir(e.key);
        })
        done()
      }))
      
    })
  })

  

  describe('select', function(){

    it('should select a multistep but simple selector', function(done){

      var selstart = new Date().getTime()
      warehouse('city.red area.blue').ship(function(areas){

        var end = new Date().getTime()


        console.log('all: ' + (end-mainstart));
        console.log('query: ' + (end-selstart));

        areas.count().should.equal(2)
        areas.tag().should.equal('area')
        areas.hasClass('blue').should.equal(true)
        
        done()
      })
      
    })

    it('should select a multistep with class selectors', function(done){

      var selstart = new Date().getTime()
      warehouse('city.south area.poor').ship(function(areas){
        var end = new Date().getTime()
        console.log('query: ' + (end-selstart));

        areas.count().should.equal(3)
        areas.eq(2).tag().should.equal('area')
        
        done()
      })
      
    })


    it('should stream results', function(done){
      var selstart = new Date().getTime()
      warehouse('city.south area.poor').stream().pipe(concat(function(areas){
        var end = new Date().getTime()
        console.log('query: ' + (end-selstart));
        
        areas.length.should.equal(3);

        
        done()
      }))
      
    })



    it('should load an attribute selector', function(done){

      warehouse('city.south area.poor[name^=S]').ship(function(areas){

        areas.count().should.equal(1)
        areas.attr('name').should.equal('St. Pauls')
        
        done()
      })
      
    })

    it('should ship tree results as a tree', function(done){
      var selstart = new Date().getTime()
      warehouse('country[name^=U] city.south:tree').ship(function(cities){

        var end = new Date().getTime()
        console.log('query: ' + (end-selstart));

        cities.count().should.equal(2)
        cities.children().count().should.equal(7)
        cities.children().eq(3).tag().should.equal('area')

        done()
      })
      
    })


  })


})
