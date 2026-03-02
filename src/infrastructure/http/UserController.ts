import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { JwtService } from "../auth/JwtService";
import { getDatabase } from "../database/DatabaseConnection";
import { MysqlUserRepository } from "../database/MysqlUserRepository";

export class UserController {
  private repo = new MysqlUserRepository(getDatabase());
  private jwt = new JwtService();

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

      const hashed = await bcrypt.hash(password, 10);

      const user = await this.repo.create({
        name,
        email,
        password: hashed,
      });

      const token = this.jwt.generateToken({
        userId: user.id,
        email: user.email,
      });

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
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

      if (!user) {
        return res.status(401).json({
          message: "Credenciales incorrectas",
        });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({
          message: "Credenciales incorrectas",
        });
      }

      const token = this.jwt.generateToken({
        userId: user.id,
        email: user.email,
      });

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
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

      let hashedPassword = password;

      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updated = await this.repo.update(id, {
        name,
        email,
        password: hashedPassword,
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