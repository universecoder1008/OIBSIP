const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const Inventory = require('./src/models/inventoryModel');

mongoose.connect(process.env.MONGO_URI);

const seed = async()=>{
    await Inventory.deleteMany()
    await Inventory.insertMany([
          {
         name: 'Thin Crust',
         category: 'Base',
         stock: 50
      },

      {
         name: 'Cheese Burst',
         category: 'Base',
         stock: 40
      },

      {
         name: 'Mozzarella',
         category: 'Cheese',
         stock: 100
      },

      {
         name: 'Tomato Sauce',
         category: 'Sauce',
         stock: 80
      }

    ]);

    console.log('Inventory Seeded');

    process.exit()
    
}

seed()