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
import notificationsRouter from "./notifications";
import explorerRouter from "./explorer";
import analyticsRouter from "./analytics";
import tokenRouter from "./token";
import governanceRouter from "./governance";

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
router.use(notificationsRouter);
router.use(explorerRouter);
router.use(analyticsRouter);
router.use(tokenRouter);
router.use(governanceRouter);

export default router;
