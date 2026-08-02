import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import { findAdminById } from "../db";
export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: any;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: any = null;

  try {
    const auth = opts.req.headers.authorization;

    if (auth?.startsWith("Bearer ")) {
      const token = auth.substring(7);

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as { id: number };

      user = await findAdminById(payload.id);
    }
  } catch (err) {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
