import type { Request, Response } from "express";
import { getDatabase } from "../database/DatabaseConnection";
import { MysqlCartRepository } from "../database/MysqlCartRepository";

export class CartController {
  private repo = new MysqlCartRepository(getDatabase());

  add = async (req: Request, res: Response) => {
    const { userId, productId, quantity } = req.body;

    const cartItem = await this.repo.add({
      userId,
      productId,
      quantity,
    });

    res.status(201).json(cartItem);
  };

  getByUser = async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const cart = await this.repo.findByUser(userId);
    res.json(cart);
  };

  remove = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await this.repo.remove(id);
    res.json({ message: "Item removed" });
  };

  clear = async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await this.repo.clear(userId);
    res.json({ message: "Cart cleared" });
  };
}
