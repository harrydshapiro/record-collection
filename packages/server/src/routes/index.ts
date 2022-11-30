import { Router } from 'express';

import smsIncomingController from 'controllers/smsIncoming.controller';
import userSignupController from 'controllers/userSignup.controller';

const router = Router();

router.post(`/sms/incoming`, smsIncomingController);
router.post(`/user/signup`, userSignupController);

export default router;
