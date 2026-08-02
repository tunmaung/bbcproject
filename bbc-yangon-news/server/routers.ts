import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  listArticles,
  getArticleById,
  getFeaturedArticle,
  getBreakingArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleStats,
  getVisitorStats,
  saveVisitorLocation,
  listVisitorLocations,
  findAdminByUsername,
  updateAdminLastLogin,
} from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { storagePut } from "./storage";

const ARTICLE_CATEGORIES = ["Myanmar", "World", "Politics", "Business", "Sport", "Culture"] as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Public article procedures
  articles: router({
    list: publicProcedure
      .input(z.object({ category: z.enum(ARTICLE_CATEGORIES).optional() }).optional())
      .query(async ({ input }) => {
        return listArticles(input?.category);
      }),

    featured: publicProcedure.query(async () => {
      return getFeaturedArticle();
    }),

    breaking: publicProcedure.query(async () => {
      return getBreakingArticle();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return getArticleById(input.id);
      }),

  visitor: router({
    saveLocation: publicProcedure
      .input(
        z.object({
          latitude: z.string(),
          longitude: z.string(),
          accuracy: z.number().optional(),
         publicIp: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ip =
          (ctx.req.headers["x-forwarded-for"] as string) ||
          ctx.req.socket.remoteAddress ||
          "";

        const userAgent =
          (ctx.req.headers["user-agent"] as string) || "";

        return await saveVisitorLocation({
          latitude: input.latitude,
          longitude: input.longitude,
          accuracy: input.accuracy,
          ipAddress: input.publicIp || ip,
          userAgent,
        });
      }),
  }),
  }),


  // Protected admin procedures
  admin: router({
 
login: publicProcedure
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const admin = await findAdminByUsername(input.username);

    if (!admin) {
      throw new Error("Invalid username or password");
    }

    const ok = await bcrypt.compare(input.password, admin.password);

    if (!ok) {
      throw new Error("Invalid username or password");
    }

    await updateAdminLastLogin(admin.id);

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return {
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    };
  }),
   articles: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return listArticles();
      }),

      create: protectedProcedure
        .input(
          z.object({
            title: z.string().min(1, "Title is required"),
            category: z.enum(ARTICLE_CATEGORIES),
coverImageUrl: z.string().min(1, "Image is required"),
            content: z.string().min(1, "Content is required"),
            author: z.string().min(1, "Author is required"),
            isFeatured: z.boolean().default(false),
            isBreaking: z.boolean().default(false),
          })
        )
        .mutation(async ({ input, ctx }) => {
          if (ctx.user?.role !== "admin") {
            throw new Error("Unauthorized");
          }

          const article = await createArticle({
            id: nanoid(),
            title: input.title,
            category: input.category,
            coverImageUrl: input.coverImageUrl,
            content: input.content,
            author: input.author,
            isFeatured: input.isFeatured,
            isBreaking: input.isBreaking,
            publishedAt: new Date(),
            updatedAt: new Date(),
          });

          return article;
        }),

      update: protectedProcedure
        .input(
          z.object({
            id: z.string(),
            title: z.string().min(1).optional(),
            category: z.enum(ARTICLE_CATEGORIES).optional(),
coverImageUrl: z.string().optional(),
            content: z.string().min(1).optional(),
            author: z.string().min(1).optional(),
            isFeatured: z.boolean().optional(),
            isBreaking: z.boolean().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          if (ctx.user?.role !== "admin") {
            throw new Error("Unauthorized");
          }

          const { id, ...updateData } = input;
          const article = await updateArticle(id, updateData);
          return article;
        }),

      delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user?.role !== "admin") {
            throw new Error("Unauthorized");
          }

          await deleteArticle(input.id);
          return { success: true };
        }),
    }),

    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return getArticleStats();
    }),
visitorStats: protectedProcedure.query(async ({ ctx }) => {
  if (ctx.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return getVisitorStats();
}),
visitorLocations: protectedProcedure.query(async ({ ctx }) => {
  if (ctx.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return listVisitorLocations();
}),
  }),
});

export type AppRouter = typeof appRouter;
