import { createApp } from "../server/app";

export default async (req, res) => {
  const { app } = await createApp();
  app(req, res);
};
