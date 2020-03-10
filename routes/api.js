const router = require('express').Router();
const Transaction = require("../models/transaction");

router.post("/api/transaction", ({body}, res) => {
    Transaction.create(body).then(dbTransaction => {
        res.json(dbTransaction);
    }).catch(err => {
        res.status(400).json(err);
    });
});