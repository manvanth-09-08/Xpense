import express from 'express';
import { loginControllers, registerControllers, setAvatarController, addNewBankAccount, deleteBankAccount, getBankDetails } from '../controllers/userController.js';

const router = express.Router();

router.route("/register").post(registerControllers);

router.route("/login").post(loginControllers);

router.route("/setAvatar/:id").post(setAvatarController);

router.route("/addBankAccount").post(addNewBankAccount);

router.route("/deleteBankAccount").post(deleteBankAccount);

router.route("/getBankDetails").post(getBankDetails);

export default router;