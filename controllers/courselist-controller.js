 "use strict";
const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const uuid = require('../utils/uuid')
const { find } = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

router.post('/', (req, res, next) => {
  if (!req.body.name) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  }

  const name = req.body.name

  // Check for name uniqueness
  const result = find(courseListCollection, { name })
  if (result) {
    return next(new BadRequestError('VALIDATION', 'Name should be unique'))
  }

  const newCourseList = {
    id: uuid.uuidv4(),
    name,
    items: []
  }

  courseListCollection.push(newCourseList)

  res.json({
    data: newCourseList
  })
})

router.post('/item', (req, res, next) => {

  if (!req.body.name) {
    return next(new BadRequestError('VALIDATION', 'Missing item name'))
  }

  if (!req.body.listName) {
    return next(new BadRequestError('VALIDATION', 'Missing list name'))
  }

  const name = req.body.name
  const listName = req.body.listName

  // Check if id exist
  const result = find(courseListCollection, { name : listName })

  if (!result) {
    return next(new BadRequestError('VALIDATION', 'Unknow list name'))
  }

  result.items.push({id:uuid.uuidv4() ,name:req.body.name})
     res.json({
    data: result
  })
})


router.get('/', (req, res, next) => {


  if(courseListCollection.length !== 0){
      res.json({
        data: courseListCollection
      })
  }else {
    res.json({
      data: "Aucune liste n'a été créé"
    })
  }
})


router.get('/item', (req, res, next) => {

  if (!req.body.name) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  }

  const name = req.body.name

   // Check if id exist
  const result = find(courseListCollection, { name })

  if (!result) {
    return next(new BadRequestError('VALIDATION', 'Unknown name'))
  }
  res.json({
      data: result.items
  })

})

router.patch('/item', (req, res, next) => {

    if (!req.body.listId) {
    return next(new BadRequestError('VALIDATION', 'Missing list ID'))
  }

  if (!req.body.itemId) {
    return next(new BadRequestError('VALIDATION', 'Missing item ID'))
  }

  const listId = req.body.listId
  const itemId = req.body.itemId

   // Check if id exist
  const list = find(courseListCollection, { listId })


  if (!list) {
    return next(new BadRequestError('VALIDATION', 'Unknown list ID'))
  }

  const item = find(list, { itemId })

  res.json({
      data: result.items
  })

})


router.delete('/', (req, res, next) => {
  if (!req.body.name) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  }

  const name = req.body.name
  const list = find(courseListCollection, { name })
  
  if (!list) {
    return next(new BadRequestError('VALIDATION', 'Unknown list name'))
  }
  for (var i=0; i<courseListCollection.length; i++){
    if (courseListCollection[i].name == name){
      courseListCollection.splice(i,1)
    }
  }

  res.json({
    data: courseListCollection
  })
})

module.exports = router