import type { Request, Response } from "express";
import { getDatabase } from "../database/DatabaseConnection";
import { MysqlRoomRepository } from "../database/MysqlRoomRepository";

export class RoomController {
  private repo = new MysqlRoomRepository(getDatabase());

  /* =========================
  OBTENER TODAS LAS SALAS
  =========================
  */
  getAll = async (_req: Request, res: Response) => {
  try {
    console.log("🔍 Intentando obtener todas las salas...");
    const rooms = await this.repo.findAll();
    res.json(rooms);
  } catch (err: any) {
    console.error("❌ Error en el controlador:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

  /* =========================
  CREAR SALA
  =========================
  */
  create = async (req: Request, res: Response) => {
    try {
      const { name, description, createdBy } = req.body;
      
      // Validar que vengan los datos necesarios
      if (!name || !createdBy) {
        return res.status(400).json({ error: "name y createdBy son requeridos" });
      }

      const room = await this.repo.create({
        name,
        description: description || "",
        createdBy,
      });

      res.status(201).json(room);
    } catch (err: any) {
      console.error("❌ Error al crear sala:", err.message);
      // Si el error es de Foreign Key (el usuario no existe), responder 400
      res.status(400).json({ error: err.message });
    }
  };

  /* =========================
  OBTENER SALA POR ID
  =========================
  */
  getById = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const room = await this.repo.findById(id);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      res.json(room);
    } catch (err: any) {
      console.error("❌ Error al obtener sala:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  /* =========================
  CERRAR SALA
  =========================
  */
  close = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      // Pasamos un objeto parcial para actualizar el estado
      const updated = await this.repo.update(id, { isActive: false } as any);
      
      res.json(updated);
    } catch (err: any) {
      console.error("❌ Error al cerrar sala:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
}