var Server = require('digger-server')
var Client = require('digger-client')
var concat = require('concat-stream')
var Folders = require('../db/folders')
var diggerlevel = require('../')

var level    = require('level-test')()
var sub = require('level-sublevel')

var db = sub(level('level-digger--select', {encoding: 'json'}))


describe('digger-level select', function(){

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


    it('should handle multiple phases', function(done){
      var selstart = new Date().getTime()
      warehouse('country[name^=S],country[name^=U] city.north area,city.south[name^=L] area.poor').ship(function(results){

        var end = new Date().getTime()
        console.log('query: ' + (end-selstart));

        results.count().should.equal(5)
        results.find('area').count().should.equal(4)
        results.find('country[name^=S]').count().should.equal(1)
        
        results.each(function(r){
          console.log(r.attr('name'))
        })
        
        done()
      })
      
    })


    it('should do a 3 step selector', function(done){
      var selstart = new Date().getTime()
      warehouse('country[name^=U] city.south area').ship(function(results){

        var end = new Date().getTime()
        console.log('query: ' + (end-selstart));

        results.count().should.equal(7)
        done()

      })
      
    })



    it('should ship tree results as a tree', function(done){
      var selstart = new Date().getTime()
      warehouse('country[name^=U] city.south:tree').ship(function(cities){

        var end = new Date().getTime()
        console.log('query: ' + (end-selstart));

        cities.count().should.equal(9)
        
        var tree = cities.tree()
        tree.count().should.equal(2)
        tree.children().count().should.equal(7)
        tree.children().eq(3).tag().should.equal('area')

        done()
      })
      
    })


    it('should not have duplicates in the results', function(done){
      var selstart = new Date().getTime()
      warehouse('country[name^=U], country').ship(function(results){

        var end = new Date().getTime()
        console.log('query: ' + (end-selstart));

        results.count().should.equal(2)

        done()
      })
      
    })



    it('should do a query from multiple inputs', function(done){
      
      warehouse('country').ship(function(countries){
        countries('city').ship(function(cities){
          cities.count().should.equal(8)
          done()
        })
      })
      
    })



    it('should do a query from multiple inputs (2)', function(done){
      
      warehouse('city').ship(function(cities){
        cities.count().should.equal(8)
        cities('area').ship(function(areas){
          areas.count().should.equal(14)
          done()
        })
      })
      
    })


    it('should do a query from a simple context', function(done){
      
      warehouse('area', 'country[name^=S] city').ship(function(area){
        area.count().should.equal(2)
        area.tag().should.equal('area')
        done()
      })
      
    })


    it('should do a query for contexts with phases', function(done){
      
      warehouse('city.north', 'country[name^=S], country[name^=U]').ship(function(cities){
        cities.count().should.equal(3)
        done()
      })
      
    })

    it('should do a query for direct children', function(done){
      
      warehouse('country[name^=S] > city').ship(function(cities){
        cities.count().should.equal(2)
        done()
      })
      
    })


    it('should do a triple step query for direct children', function(done){
      
      warehouse('country[name^=S] > city > area').ship(function(areas){
        areas.count().should.equal(2)
        done()
      })
      
    })



  })


})
