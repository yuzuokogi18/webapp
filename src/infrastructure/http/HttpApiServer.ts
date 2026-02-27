import express from "express";
import cors from "cors";
import routes from "./routes";

export class HttpApiServer {
  private readonly app = express();

  constructor(private readonly port: number) {
    this.app.use(cors());
    this.app.use(express.json());

    this.app.use("/api", routes);

    this.app.listen(this.port, () => {
      console.log(`🚀 HTTP Server running on http://localhost:${this.port}`);
    });
  }
}