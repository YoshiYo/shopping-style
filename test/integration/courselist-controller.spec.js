const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash')

const db = require('../../data/db')
const courseListCollection = db.courseList
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('CourselistController', () => {
  beforeEach(() => { courseListFixture.up() })
  afterEach(() => { courseListFixture.down() })

  describe('When I create a courseList (POST /course-lists)', () => {
    it('should reject with a 400 when no name is given', () => {
      return request(app).post('/course-lists').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })

    it('should reject when name is not unique', () => {
      return request(app)
        .post('/course-lists')
        .send({ name: 'Toto' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name should be unique'
            }
          })
      })
    })

    it('should  succesfuly create a courseList', () => {
      const mockName = 'My New List'

      return request(app)
        .post('/course-lists')
        .send({ name: mockName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(mockName)

          const result = find(db.courseList, { name: mockName } )
          result.should.not.be.empty

          result.name.should.equal(res.body.data.name)
          result.items.should.eql([])
        })
    })
  })



  describe('When I delete a courseList (DELETE /course-lists)', () => {
    afterEach(() => { courseListFixture.down() })
    it('should reject with a 400 when no name is given', () => {
      return request(app).delete('/course-lists').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })
    it('should reject when name is not in list', () => {
      return request(app)
        .delete('/course-lists')
        .send({ name: 'Unknown' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Unknown list name'
            }
          })
      })
    })

    it('should  succesfuly delete a courseList', () => {
      const name = 'Toto'
      const nbList = db.courseList.length

      return request(app)
        .delete('/course-lists')
        .send({ name: name })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('array')

          const result = find(db.courseList, { name: name  } ) || 'Aucun résultat'
          
          db.courseList.length.should.equal(nbList-1)
          result.should.equal('Aucun résultat')


        })
    })
  })



    describe('When I get all courseList (GET /course-lists)', () => {
      beforeEach(() => { courseListFixture.up() })
      afterEach(() => { courseListFixture.down() })
    it('should  succesfuly get all courseList', () => {
      
      const nbList = db.courseList.length
      const result = db.courseList
      
      return request(app)
        .get('/course-lists')
        .then((res) => {
          console.log("result",result)
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('array')          
          res.body.data.should.eql(result)

        })
    })
  })

  describe('When I add item in courseList (POST /course-lists/item)', () => {
    beforeEach(() => { courseListFixture.up() })
    afterEach(() => { courseListFixture.down() })
    it('should reject with a 400 when no name is given', () => {
      return request(app).post('/course-lists/item').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing item name'
          }
        })
      })
    })

     it('should reject with a 400 when no list name is given', () => {
      return request(app)
        .post('/course-lists/item')
        .send({ name: 'Toto' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing list name'
            }
          })
      })
    })

    it('should reject when list name is not in courseList', () => {
      return request(app)
        .post('/course-lists/item')
        .send({ name: 'MyItem',listName: 'Unknow' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Unknow list name'
            }
          })
      })
    })

    it('should  succesfuly create item in courseList', () => {
      const mockName = 'MyItem'
      const listName = 'Toto'
      const result = find(db.courseList, { name: listName } )
      const nbItem = result.items.length

      return request(app)
        .post('/course-lists/item')
        .send({ name: mockName, listName: listName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')

          const result2 = find(db.courseList, { name: listName } )
          const nbItem2 = result2.items.length

          result.items.should.not.be.empty
          result.items[result.items.length - 1].name.should.eql(mockName)
          result.items.length.should.equal(nbItem + 1)
        })
    })
  })

    describe('When I get all item from one courseList (GET /course-list/item)', () => {
      beforeEach(() => { courseListFixture.up() })
      afterEach(() => { courseListFixture.down() })

      it('should reject with a 400 when no name is given', () => {
      return request(app)
      .get('/course-lists/item').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })

    it('should reject when list name is not in courseList', () => {
      return request(app)
        .get('/course-lists/item')
        .send({ name: 'Unknown'})
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Unknown name'
            }
          })
      })
    })

    it('should  succesfuly get all item from one courseList', () => {
      
      const name = 'Toto'

      return request(app)
        .get('/course-lists/item')
        .send({ name: name })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('array')

         const result = find(db.courseList, { name } )

 
          res.body.data.should.eql(result.items)
         
        })
    })
  })

    describe('When I check one item from one courseList (PATCH /course-list/item)', () => {
      beforeEach(() => { courseListFixture.up() })
      afterEach(() => { courseListFixture.down() })

      it('should reject with a 400 when no list name is given', () => {
      return request(app)
      .patch('/course-lists/item').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing list name'
          }
        })
      })
    })

      it('should reject with a 400 when no item name is given', () => {
      return request(app)
      .patch('/course-lists/item')
      .send({listName: 'Toto'})
      .then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing item name'
          }
        })
      })
    })


    it('should reject when list name is not in courseList', () => {
      return request(app)
        .patch('/course-lists/item')
        .send({ listName: 'Unknown'})
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Unknown list name'
            }
          })
      })
    })

    it('should reject when item name is not in list', () => {
      return request(app)
        .patch('/course-lists/item')
        .send({ listName: 'Toto', itemName: 'Unknown'})
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Unknown item name'
            }
          })
      })
    })


    it('should succesfuly check one item from one courseList', () => {
      
      const listName = 'Toto'
      const itemName = 'MyItem'

       
      return request(app)
        .patch('/course-lists/item')
        .send({ listName: listName, itemName: itemName  })
        .then((res) => {
          res.status.should.equal(200)
        
        expect(res.body.data).to.be.an('object')

        const list = find(db.courseList, { name:listName } )
        const item = find(list.items, {name : itemName})

        res.body.data.should.have.property('check')
        res.body.data.should.eql(item)
         
        })
    })
  })

})