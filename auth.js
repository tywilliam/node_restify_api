const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
exports.authenticate = (email, password) => {
    return new Promise ( async (resolve, reject) => { 
        try {
            // Get user by email
            const user = await User.findOne({ email});

            // Match password
            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    resolve(user)
                } else {
                    // Pass didnt mach
                    reject('Authentication failed')
                }
            });
        } catch(err) {
            // Email not found
            reject('Authenitcation failed.')
        }
    });
}