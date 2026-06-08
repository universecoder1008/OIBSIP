const Pizza = require('../models/pizzaModel')

const updatePizza = async(req,res)=>{
    try {
        

        const pizza = await Pizza.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true
            }
        );

        if(!pizza){
            return res.status(404).json({
                message:"Pizza not found"
            })
        }

        res.status(200).json(pizza)


    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const deletePizza = async(req,res)=>{
    try {
        const pizza = await Pizza.findById(req.params.id)

        if(!pizza){
            return res.status(404).json({
                message:"Pizza not found"
            })
        }

        await pizza.deleteOne();

        res.status(200).json({
    message:"Pizza deleted successfully"
})

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}
const getPizza = async (req,res) => {
   try {
     const pizza = await Pizza.find()

    res.status(200).json(pizza)
   } catch (error) {
    return res.status(500).json({
        message:"error.message"
    })
   }
}

const getPizzaById = async(req,res)=>{
    try {
        const pizza = await Pizza.findById(req.params.id)

        if(!pizza){
            return res.status(404).json({
                message:"Pizza not found"
            })
        }

        res.status(200).json(pizza)
    } catch (error) {
         return res.status(500).json({
        message:"error.message"
    })
    }
}

module.exports = {updatePizza,deletePizza,getPizzaById,getPizza}

