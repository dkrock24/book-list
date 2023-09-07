const should = require('should');
const sinon = require('sinon');
const booksController = require('../controllers/booksController');

describe('Book Controller  Test:', () => {
    describe('Post', ()=>{
        it('should not allow an empty title on post', ()=> {
            const Book = function (book) { this.save = () =>{}};
        }); 
    });
});