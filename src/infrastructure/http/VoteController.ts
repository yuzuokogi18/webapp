import type { Request, Response } from "express";
import { getDatabase } from "../database/DatabaseConnection";
import { MysqlVoteRepository } from "../database/MysqlVoteRepository";

export class VoteController {
  private repo = new MysqlVoteRepository(getDatabase());

  vote = async (req: Request, res: Response) => {
    const { userId, productId, value } = req.body;

    const vote = await this.repo.vote({
      userId,
      productId,
      value,
    });

    res.status(201).json(vote);
  };

  getByProduct = async (req: Request, res: Response) => {
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    const votes = await this.repo.findByProduct(productId);
    res.json(votes);
  };
}
