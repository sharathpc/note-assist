import { Router, Request, Response } from "express";

import { Users } from "../aws";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const response = await Users.query("email")
      .eq(req.body.email)
      .and()
      .where("password")
      .eq(req.body.password)
      .attributes(["userId", "firstname", "lastname", "email"])
      .exec();
    if (response.length > 0) {
      res.json(response[0]);
    } else {
      res.status(401).json({ message: "User login failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "User login failed", error });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const newUser = new Users(req.body);
  try {
    const response = await newUser.save();
    delete response['password'];
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "User registration failed", error });
  }
});

export default router;
