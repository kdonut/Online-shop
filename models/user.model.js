const bcrypt = require('bcryptjs');
const db = require('../data/database');

class User {

    constructor(email,password,fullname,street,postal,city) {
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street : street,
            postalCode : postal,
            city : city

        };
    }

    async signup(){
        
        const hashedPassword = await bcrypt.hash(this.password,12);
      
        const result = await db.getDb().collection('users').insertOne({
            email : this.email,
            password :hashedPassword,
            name: this.name,
            address: this.address
        });
        return result;
    }

    async login(comparePassword) {
        const passwordsAreEqual = await bcrypt.compare(
            this.password,comparePassword
        );
        return passwordsAreEqual;
    }
   
}
module.exports = User;