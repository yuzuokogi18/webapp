import express from "express";
import cors from "cors";
import routes from "./routes"; // <-- Verifica que este archivo exporte 'router' por default

export class HttpApiServer {
  private readonly app = express();

  constructor(private readonly port: number) {
    // 1. Middlewares globales
    this.app.use(cors());
    this.app.use(express.json());

    // 2. Ruta de prueba rápida (PARA VER SI EL SERVIDOR RESPONDE)
    this.app.get("/ping", (req, res) => res.send("API Viva"));

    // 3. Registrar tus rutas de la API
    // Si en Postman llamas a /api/rooms, aquí DEBE decir "/api"
    this.app.use("/api", routes);

    // 4. Encender el servidor
    this.app.listen(this.port, () => {
      console.log(`🚀 HTTP Server running on http://localhost:${this.port}`);
    });
  }
}