import express from "express";
import { authentication } from "../middlewares/auth.js";
import { createTicket, getTicket, getTickets } from "../controllers/ticket.js";

const router = express.Router();

router.get("/", authentication, getTickets);
router.get("/:id", authentication, getTicket);
router.post("/", authentication, createTicket);

export default router;