const noAuthRoute = require("express").Router();

const controller = require("../controller/noauth.controller");

noAuthRoute.post("/login", controller.logIn);

module.exports = noAuthRoute;
