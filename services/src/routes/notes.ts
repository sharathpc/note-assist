import { Router, Request, Response } from "express";
import {
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { dynamodb } from "../aws";
import { TABLES } from "../constants/Enumeration";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const userId: any = req.headers["user-id"];

  try {
    const response = await dynamodb.send(
      new ScanCommand({
        TableName: TABLES.NOTES,
        FilterExpression: "#userId = :userId",
        ExpressionAttributeNames: {
          "#userId": "userId",
        },
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );
    res.json(response.Items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
});

router.get("/:noteId", async (req: Request, res: Response) => {
  const noteId: any = req.params.noteId;

  try {
    const response = await dynamodb.send(
      new QueryCommand({
        TableName: TABLES.NOTES,
        KeyConditionExpression: "#noteId = :noteId",
        ExpressionAttributeNames: {
          "#noteId": "noteId",
        },
        ExpressionAttributeValues: {
          ":noteId": noteId,
        },
      })
    );
    res.json(response.Items[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching note", error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const userId: any = req.headers["user-id"];
  const noteObj = {
    ...req.body,
    noteId: uuidv4(),
    userId: userId,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };

  try {
    const response = await dynamodb.send(
      new PutCommand({
        TableName: TABLES.NOTES,
        Item: noteObj,
      })
    );
    if (response.$metadata.httpStatusCode === 200) {
      res.json(noteObj);
    } else {
      res.status(500).json({ message: "Note creation failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Note creation failed", error });
  }
});

router.put("/:noteId", async (req: Request, res: Response) => {
  const userId: any = req.headers["user-id"];
  const noteId: any = req.params.noteId;

  try {
    const response = await dynamodb.send(
      new UpdateCommand({
        TableName: TABLES.NOTES,
        Key: {
          noteId: noteId,
        },
        UpdateExpression:
          "set #userId = :userId, #title = :title, #status = :status, #content = :content, #imageUrl = :imageUrl, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#userId": "userId",
          "#title": "title",
          "#status": "status",
          "#content": "content",
          "#imageUrl": "imageUrl",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":userId": userId,
          ":title": req.body.title,
          ":status": req.body.status,
          ":content": req.body.content,
          ":imageUrl": req.body.imageUrl,
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
    res.status(500).json({ message: "Note creation failed", error });
  }
});

router.delete("/:noteId", async (req: Request, res: Response) => {
  const { noteId } = req.params;
  try {
    const response = await dynamodb.send(
      new DeleteCommand({
        TableName: TABLES.NOTES,
        Key: {
          noteId: noteId,
        },
      })
    );
    if (response.$metadata.httpStatusCode === 200) {
      res.json({ message: "Note deleted successfully" });
    } else {
      res.status(500).json({ message: "Note deletion failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Note deletion failed", error });
  }
});

export default router;
