import { v2 } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const cloud_name = process.env.cloud_name as string;
    const api_key = process.env.api_key as string;
    const api_secret = process.env.api_secret as string;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = req.body.folder;

    const signature = v2.utils.api_sign_request(
      { timestamp, folder },
      api_secret
    );

    return res.status(200).json({ timestamp, signature, cloud_name, api_key });
  } else {
    return res.status(400).json({ message: "neverniy zapros" });
  }
}
