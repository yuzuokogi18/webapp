"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("./UserController");
const RoomController_1 = require("./RoomController");
const ProductController_1 = require("./ProductController");
const VoteController_1 = require("./VoteController");
const CartController_1 = require("./CartController");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
const roomController = new RoomController_1.RoomController();
const productController = new ProductController_1.ProductController();
const voteController = new VoteController_1.VoteController();
const cartController = new CartController_1.CartController();
/* USER */
router.post("/users", userController.create);
router.get("/users", userController.getAll);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);
/* ROOM */
router.post("/rooms", roomController.create);
router.get("/rooms/:id", roomController.getById);
router.put("/rooms/:id/close", roomController.close);
/* PRODUCT */
router.post("/products", productController.create);
router.get("/products", productController.getAll);
router.put("/products/:id", productController.update);
router.delete("/products/:id", productController.delete);
/* VOTE */
router.post("/votes", voteController.vote);
router.get("/votes/:productId", voteController.getByProduct);
/* CART */
router.post("/cart", cartController.add);
router.get("/cart/:userId", cartController.getByUser);
router.delete("/cart/:id", cartController.remove);
router.delete("/cart/clear/:userId", cartController.clear);
exports.default = router;
