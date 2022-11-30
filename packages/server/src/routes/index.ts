import { Router } from "express";

import smsIncomingController from "controllers/smsIncoming.controller";
import userAdmitController from "controllers/userAdmitController.controller";
import userSignupController from "controllers/userSignup.controller";

const router = Router();

router.post(`/sms/incoming`, smsIncomingController);
router.post(`/user/signup`, userSignupController);
router.post(`/user/admit`, userAdmitController);

export default router;
