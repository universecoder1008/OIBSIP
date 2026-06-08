const express = require('express')

const router = express.Router()

const{
    updatePizza,
    deletePizza,
    getPizza,
    getPizzaById
} = require('../controller/pizzaController')

router.put('/:id',updatePizza)
router.delete('/:id',deletePizza)
router.get('/',getPizza)
router.get('/:id',getPizzaById)

module.exports = router