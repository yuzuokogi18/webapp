"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpApiServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
class HttpApiServer {
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use("/api", routes_1.default);
        this.app.listen(this.port, () => {
            console.log(`🚀 HTTP Server running on http://localhost:${this.port}`);
        });
    }
}
exports.HttpApiServer = HttpApiServer;
