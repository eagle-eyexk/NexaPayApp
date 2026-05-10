import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statsRouter from "./stats";
import transactionsRouter from "./transactions";
import nodesRouter from "./nodes";
import activityRouter from "./activity";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(transactionsRouter);
router.use(nodesRouter);
router.use(activityRouter);

export default router;
