import type { Request, Response } from "express";
import { getDatabase } from "../database/DatabaseConnection";
import { MysqlUserRepository } from "../database/MysqlUserRepository";

export class UserController {
  private repo = new MysqlUserRepository(getDatabase());

  /* ================= REGISTER ================= */
  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Datos incompletos",
        });
      }

      const existingUser = await this.repo.findByEmail(email);

      if (existingUser) {
        return res.status(400).json({
          message: "El email ya está registrado",
        });
      }

      const user = await this.repo.create({
        name,
        email,
        password,
      });

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al registrar usuario",
      });
    }
  };

  /* ================= LOGIN ================= */
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Datos incompletos",
        });
      }

      const user = await this.repo.findByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({
          message: "Credenciales incorrectas",
        });
      }

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al iniciar sesión",
      });
    }
  };

  /* ================= GET ALL ================= */
  getAll = async (_: Request, res: Response) => {
    try {
      const users = await this.repo.findAll();

      const sanitized = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      }));

      return res.json(sanitized);

    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener usuarios",
      });
    }
  };

  /* ================= UPDATE ================= */
  update = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const updated = await this.repo.update(id, {
        name,
        email,
        password,
      });

      return res.json({
        id: updated.id,
        name: updated.name,
        email: updated.email,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar usuario",
      });
    }
  };

  /* ================= DELETE ================= */
  delete = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      await this.repo.delete(id);

      return res.json({
        message: "User deleted",
      });

    } catch (error) {
      return res.status(500).json({
        message: "Error al eliminar usuario",
      });
    }
  };
}