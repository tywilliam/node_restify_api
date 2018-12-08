const errors = require('restify-errors');
const Customer = require('../ models/Customer');
const config = require('../config');
const rjwt = require('restify-jwt-community');
module.exports = server => {
    server.get('/customers', async (req, res, next) => {
        console.log('worked');
        try {

            const customers = await Customer.find({});
            res.send(customers);
            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    // Get Single Customer
    server.get('/customers/:id', async (req,res,next) => {
        try {
            const customer = await Customer.findById(req.params.id);
            res.send(customer);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`
            ))
        }
    });

    // Update Customer
    server.put('/customers/:id',  rjwt({ secret: config.JWT_SECRET }), async (req,res,next) => {
            try {
            const customer = await Customer.findOneAndUpdate(
                { _id: req.params.id},
                 req.body
                 );
                res.send(200);
                next();
            } catch(err) {
                return next(
                    new errors.ResourceNotFoundError(
                        `There is no customer with the id of ${req.params.id}`
                        )
                );
            }
    });




    // Add Customer
    server.post('/customers', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }
        const { name, email, balance } = req.body;
        const customer = new Customer({
            name,
            email,
            balance
        });

        try {
            const newCustomer = await customer.save();
            res.send(201);
            next();
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }

    });
    server.del('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findOneAndRemove({_id: req.params.id });
            res.send(204)
            next();
        } catch (err) {
            new errors.ResourceNotFoundError(
                `There is no customer with the id of ${req.params.id}`
            )
        };
    });
};