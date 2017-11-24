require('chai').should()

const axios = require('axios')
// Il faudra faire un fichier config pour importer le port

describe('TESTING API', () => {
    it('/ should return 200', (done) => {
        axios.get('http://localhost:8080')
        .then((res) => {
            res.status.should.equal(200)
            done()
        })
    })
})


describe('USER STORY 1', () => {
    it('It should create a shopping list', () => {
        const shoppinglist = 1
        shoppinglist.should.equal(1)
    })
    it('The shopping list need to have a name', () => {     
    })        
})