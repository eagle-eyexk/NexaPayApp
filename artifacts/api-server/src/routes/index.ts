import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statsRouter from "./stats";
import transactionsRouter from "./transactions";
import nodesRouter from "./nodes";
import activityRouter from "./activity";
import authRouter from "./auth";
import userRouter from "./user";
import merchantRouter from "./merchant";
import paymentRouter from "./payment";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(transactionsRouter);
router.use(nodesRouter);
router.use(activityRouter);
router.use(authRouter);
router.use(userRouter);
router.use(merchantRouter);
router.use(paymentRouter);

export default router;
