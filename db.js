const mongoose = require( 'mongoose' );
const chalk = require( 'chalk' );

require( './models/User' ); // initializes the User schema and model
require( './models/Story' ); // initializes the Story schema and model

if( process.env.NODE_ENV === 'production' ) {
    mongoose.connect( 'mongodb://admin:admin123@ds159025.mlab.com:59025/leavethemarks' );
} else {
    mongoose.connect( 'mongodb://localhost:27017/leaveyourmark' );
}

mongoose.connection.on( 'connected', function() {
    console.log( chalk.yellow( 'DB all set - good to go.' ) );
});

mongoose.connection.on( 'error', function( error ) {
    console.log( chalk.red( error.message ) );
    process.exit( 1 );
});