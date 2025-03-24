const mongoose = require('mongoose');

async function main(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database is connected with success!");
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = main