import type { Request, Response } from "express";
import { getDatabase } from "../database/DatabaseConnection";
import { MysqlRoomRepository } from "../database/MysqlRoomRepository";

export class RoomController {
  private repo = new MysqlRoomRepository(getDatabase());

  create = async (req: Request, res: Response) => {
    const { name, description, createdBy } = req.body;

    const room = await this.repo.create({
      name,
      description,
      createdBy,
    });

    res.status(201).json(room);
  };

  getById = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const room = await this.repo.findById(id);
    res.json(room);
  };

  close = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await this.repo.update(id, {});
    res.json(updated);
  };
}
