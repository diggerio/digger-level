var Server = require('digger-server')
var Client = require('digger-client')
var concat = require('concat-stream')
var Folders = require('../db/folders')
var diggerlevel = require('../')

var level    = require('level-test')()
var sub = require('level-sublevel')

var db = sub(level('level-search--diggerlevel', {encoding: 'json'}))


describe('digger-level', function(){
/*
  describe('append', function(){

    it('should append some data', function(done){

      var digger = Server();
      var client = Client();

      digger.use(diggerlevel(db))

      client.on('request', digger.reception.bind(digger));

      var warehouse = client.connect('/apples');

      var data = client.create('folder').addClass('red').inode('/red')

      data.append(client.create('sub').inode('/sub'))

      var contract = warehouse.append(data)

      console.log(JSON.stringify(contract.req, null, 4));
      process.exit();

      warehouse.append(data).ship(function(answers){


        console.log('-------------------------------------------');
        console.log('answers');
        console.dir(answers.toJSON());

        process.exit();

        warehouse('folder.red').ship(function(folder){


          folder.count().should.equal(1);
          done();
        })
      })

    })

  })
*/

  describe('folders', function(){

    it('should ensure folders for adding a new thing', function(done){

      var digger = Server();
      var client = Client();
      var warehouse = diggerlevel(db)

      digger.use(warehouse)

      client.on('request', digger.reception.bind(digger));

      var supplychain = client.connect('/a/b/c/d/e');

      var data = client.create('folder').addClass('red').inode('/f')

      supplychain.append(data).ship(function(answers){

        warehouse.db.folders.get('/a/b/c/d/e/f', function(err, folders){
          if(err) throw err

          folders.length.should.equal(7)
          folders[0].path.should.equal('/')
          folders[0].create.should.equal(true)
          folders[1].path.should.equal('/a')
          folders[1].create.should.equal(true)
          folders[2].path.should.equal('/a/b')
          folders[2].create.should.equal(true)
          folders[3].path.should.equal('/a/b/c')
          folders[3].create.should.equal(true)
          folders[4].path.should.equal('/a/b/c/d')
          folders[4].create.should.equal(true)
          folders[5].path.should.equal('/a/b/c/d/e')
          folders[5].create.should.equal(true)
          folders[6].path.should.equal('/a/b/c/d/e/f')
          folders[6].create.should.equal(true)
          done()
        })

      })

    })

  })
})
