import { Router, Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";

import { s3Client } from "../aws";
import { BUCKETS } from "../constants/Enumeration";

const router = Router();

const upload = multer();

router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const response = await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKETS.IMAGES,
          Key: req.file.originalname,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      if (response.$metadata.httpStatusCode === 200) {
        res.json({
          url: `https://${BUCKETS.IMAGES}.s3.${process.env.AWS_HOST}/${req.file.originalname}`,
        });
      } else {
        res.status(500).json({ message: "Image upload failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Image upload failed", error });
    }
  }
);

export default router;
