import { trpc } from "../context";
import { z } from "zod";
import {PrismaClient} from "@prisma/client";
import { nanoid } from "nanoid";

// routers -> collection of procedures
// procedures -> queries, mutations, subscriptions(ws)

const prisma = new PrismaClient();

export const urlRouter = trpc.router({
  getOriginalUrl: trpc.procedure
                  .input(z.string())
                  .query(async ({ input }) => {
                    const url = await prisma.url.findUnique({
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
                    
                    // handle the case where the original url has already been shortened
                    const url = await prisma.url.findUnique({
                      where: {
                        originalUrl: input.url
                      }
                    })
                  
                    if (url) {
                      return url.shortUrl;
                    }
                  
                    let isUnique = false;
                    let shortUrl = "";
                    // handle the case where the new shorturl is already used (collision)
                    while (!isUnique) {
                      shortUrl = nanoid(6);

                      const exists = await prisma.url.findUnique({
                        where: { shortUrl }
                      });
                      if (!exists) {
                        isUnique = true;
                      }
                    }

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
