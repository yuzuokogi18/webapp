import type { Request, Response } from "express";
import { getDatabase } from "../database/DatabaseConnection";
import { MysqlProductRepository } from "../database/MysqlProductRepository";

export class ProductController {
  private repo = new MysqlProductRepository(getDatabase());

  create = async (req: Request, res: Response) => {
    const { name, price, stock, roomId } = req.body;

    const product = await this.repo.create({
      name,
      price,
      stock,
      roomId,
    });

    res.status(201).json(product);
  };

  getAll = async (_: Request, res: Response) => {
    const products = await this.repo.findAll();
    res.json(products);
  };

  update = async (req: Request, res: Response) => {
    const { name, price, stock } = req.body;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const updated = await this.repo.update(id, {
      name,
      price,
      stock,
    });

    res.json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await this.repo.delete(id);
    res.json({ message: "Product deleted" });
  };
}
