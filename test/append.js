var Server = require('digger-server')
var Client = require('digger-client')
var Folders = require('../db/folders')
var diggerlevel = require('../')

var level    = require('level-test')()
var sub = require('level-sublevel')

var db = sub(level('level-digger--append', {encoding: 'json'}))


describe('digger-level append', function(){

  describe('append', function(){

    it('should append some simple data', function(done){

      var digger = Server();
      var client = Client();

      digger.use(diggerlevel(db))

      client.on('request', digger.reception.bind(digger));

      var warehouse = client.connect('/apples');

      var data = client.create('folder').addClass('red').inode('/red')
      var sub1 = client.create('sub').inode('/sub')
      var sub2 = client.create('sub2').inode('/sub2')

      sub1.append(sub2)

      data.append(sub1)

      var otherdata = client.create('folder').addClass('blue').inode('/blue')      
      data.add(otherdata)

      warehouse.append(data).ship(function(answers){

        warehouse('folder.red').ship(function(folder){

          folder.tag().should.equal('folder')
          folder.hasClass('red').should.equal(true)
          folder.path().should.equal('/apples')
          


          folder.count().should.equal(1);
          done();
        })
      })

    })


    it('should append a batch of data', function(done){

      var digger = Server();
      var client = Client();

      digger.use(diggerlevel(db))
      client.on('request', digger.reception.bind(digger));

      var warehouse = client.connect('/cities');

      var data = client.create(require(__dirname + '/fixtures/cities.json'))

      warehouse.append(data).ship(function(answers){

        warehouse('city').ship(function(cities){

          cities.count().should.equal(8)
          done()

        })
      })

    })

  })

})
