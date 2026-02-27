import type { Request, Response } from "express";
import { getDatabase } from "../database/DatabaseConnection";
import { MysqlUserRepository } from "../database/MysqlUserRepository";

export class UserController {
  private repo = new MysqlUserRepository(getDatabase());

  create = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const user = await this.repo.create({
      name,
      email,
      password,
    });

    res.status(201).json(user);
  };

  getAll = async (_: Request, res: Response) => {
    const users = await this.repo.findAll();
    res.json(users);
  };

  update = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const updated = await this.repo.update(id, {
      name,
      email,
      password,
    });

    res.json(updated);
  };

  delete = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await this.repo.delete(id);
    res.json({ message: "User deleted" });
  };
}
