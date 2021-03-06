const bcrypt = require('bcryptjs');
const db = require('../data/database');
const mongoDb = require('mongodb');

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

    static async findById(userId){
        const uid = new mongoDb.ObjectId(userId);
        return db.getDb().collection('users').findOne({_id : uid},{projection : { password : 0 }});
    }

    getUserWithSameEmail() {

        return db.getDb().collection('users').findOne({email : this.email});

    }

    checkIfIsAdmin()
    {
        return db.getDb().collection('users').findOne({email : this.email,isAdmin:true});
    }

    async existsAlready(){
        const existingUser = await this.getUserWithSameEmail();
        if(existingUser){
            return true;
        }
        return false;
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

    hasMatchingPassword(hashedPassword){
        return bcrypt.compare(this.password,hashedPassword );
    }
   
}
module.exports = User;