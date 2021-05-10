import express, { Response, Request } from "express";

const router = express.Router();

router.delete("/api/orders/:orderId", (req: Request, res: Response) => {
  res.send({});
});

export { router as deleteOrderRouter };
