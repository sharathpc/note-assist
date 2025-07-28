import { Router, Request, Response } from "express";
import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { dynamodb } from "../aws";
import { TABLES } from "../constants/Enumeration";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const response = await dynamodb.send(
      new ScanCommand({
        TableName: TABLES.USERS,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": req.body.email,
        },
      })
    );
    if (response.Items && response.Items.length > 0) {
      const user = response.Items[0];
      if (user.password === req.body.password) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "User login failed", error: error.message });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const userObj = {
    ...req.body,
    userId: uuidv4(),
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };

  try {
    const response = await dynamodb.send(
      new PutCommand({
        TableName: TABLES.USERS,
        Item: userObj,
      })
    );
    if (response.$metadata.httpStatusCode === 200) {
      const { password, ...userWithoutPassword } = userObj;
      res.json(userWithoutPassword);
    } else {
      res.status(500).json({ message: "User registration failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "User registration failed", error });
  }
});

router.post("/update", async (req: Request, res: Response) => {
  const userId: any = req.headers["user-id"];

  try {
    const response = await dynamodb.send(
      new UpdateCommand({
        TableName: TABLES.USERS,
        Key: {
          userId: userId,
        },
        UpdateExpression:
          "set #firstName = :firstName, #lastName = :lastName, #email = :email, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#firstName": "firstName",
          "#lastName": "lastName",
          "#email": "email",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":firstName": req.body.firstName,
          ":lastName": req.body.lastName,
          ":email": req.body.email,
          ":updatedAt": new Date().getTime(),
        },
        ReturnValues: "ALL_NEW",
      })
    );
    if (response.$metadata.httpStatusCode === 200) {
      res.json(response.Attributes);
    } else {
      res.status(500).json({ message: "Note creation failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Note creation failed", error: error.message });
  }
});

export default router;
