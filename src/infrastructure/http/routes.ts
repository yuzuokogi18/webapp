import { Router } from "express";
import { UserController } from "./UserController";
import { RoomController } from "./RoomController";
import { ProductController } from "./ProductController";
import { VoteController } from "./VoteController";
import { CartController } from "./CartController";

const router = Router();

const userController = new UserController();
const roomController = new RoomController();
const productController = new ProductController();
const voteController = new VoteController();
const cartController = new CartController();

/* USER */
router.post("/users/register", userController.register);
router.post("/users/login", userController.login);

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

export default router;