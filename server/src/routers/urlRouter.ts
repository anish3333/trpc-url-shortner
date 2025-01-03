import { trpc } from "../context";
import { z } from "zod";
import {PrismaClient} from "@prisma/client";

// routers -> collection of procedures
// procedures -> queries, mutations, subscriptions(ws)

const prisma = new PrismaClient();

export const urlRouter = trpc.router({
  getOriginalUrl: trpc.procedure
                  .input(z.string())
                  .query(async ({ input }) => {
                    const url = await prisma.url.findFirst({
                      where: {
                        shortUrl: input
                      }
                    })
                    if (!url) {
                      throw new Error("Url not found");
                    }

                    return url.originalUrl;

                  }),
  createShortUrl: trpc.procedure
                  .input(z.object({ url : z.string().url() }))
                  .mutation(async ({ input }) => {
                    const shortUrl = Math.random().toString(36).substring(2, 8);
                    await prisma.url.create({
                      data: {
                        originalUrl: input.url,
                        shortUrl
                      }
                    })

                    return shortUrl;
                  
                  }),
});

export type UrlRouter = typeof urlRouter;
