const routes = require("express").Router()
const branchControl = require("../controllers/Branch")
const {validateBranch} = require("../middleware/validator")
const {protect} = require("../repos/token-repo")
const allowedUser = require("../middleware/Authorization")

routes.post("/create",protect,allowedUser([1,5]),validateBranch,branchControl.create)
        .put("/update",protect,allowedUser([1,5]),validateBranch,branchControl.update)
        .get("/",protect,allowedUser([1,5,9]),branchControl.get)
        .get("/active",branchControl.getActive)
        .get("/approve",protect,allowedUser([1]),branchControl.approve)

module.exports = routes