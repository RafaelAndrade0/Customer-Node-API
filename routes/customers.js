const errors = require("restify-errors");
const Customer = require("../models/Customer");

module.exports = server => {
  // Get All Customers
  server.get("/customers", async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      // res.send({ msg: "Customers!" });
      next();
    } catch (error) {
      //   console.log(err)
      return next(new errors.InvalidContentError(error));
    }
  });

  // Return Single Customer
  server.get("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (error) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no user with an id of ${req.params.id}`
        )
      );
    }
  });

  // Add a Customer
  server.post("/customers", async (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects application/json"));
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
    } catch (error) {
      return next(new errors.InternalError(error.message));
    }
  });

  // Update a Customer
  server.put("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.send(201);
      next();
    } catch (error) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no user with an id of ${req.params.id}`
        )
      );
    }
  });

  server.del("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndRemove({ _id: req.params.id });
      res.send(204);
      next();
    } catch (error) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no user with an id of ${req.params.id}`
        )
      );
    }
  });
};
