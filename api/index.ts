import { createApp } from "../server/app";
import type { IncomingMessage, ServerResponse } from "http";

export default async (req: IncomingMessage, res: ServerResponse) => {
  const { app } = await createApp();
  app(req, res);
};
