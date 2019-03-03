const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt' );

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre( 'save', function( next ) {
    const user = this;
    const plaintextPassword = this.password;

    bcrypt.genSalt( 10, function( err, salt ) {
        if( err ) { return next( err ); }

        bcrypt.hash( plaintextPassword, salt, function( err, hashedPassword ) {
            if( err ) { return next( err ); }
            user.password = hashedPassword;
            next(); // this will cause the user object to be saved to the DB
        });
    });
});

// create a model class out of the schema
const User = mongoose.model( 'User', UserSchema );

module.exports = {
    UserSchema: UserSchema,
    User: User
};