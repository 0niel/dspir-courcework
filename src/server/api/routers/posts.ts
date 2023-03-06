import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import type { Post } from '@prisma/client';


export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany() as Promise<Post[]>;
  }),
  getOne: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.post.findUnique({
      where: {
        id: input.id,
      },
    }) as Promise<Post>;
  }),
  create: protectedProcedure.input(z.object({ title: z.string(), content: z.string(), imageUrl: z.string(), authorId: z.string(), timeToRead: z.nullable(z.number()), postType: z.string(), sourceUrl: z.nullable(z.string()), category: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        imageUrl: input.imageUrl,
        authorId: input.authorId,
        timeToRead: input.timeToRead,
        postType: input.postType,
        sourceUrl: input.sourceUrl,
        category: input.category,
      },
    }) as Promise<Post>;
  }),
  update: protectedProcedure.input(z.object({ id: z.string(), title: z.string(), content: z.string(), imageUrl: z.string(), authorId: z.string(), timeToRead: z.nullable(z.number()), postType: z.string(), sourceUrl: z.nullable(z.string()), category: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.post.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title,
        content: input.content,
        imageUrl: input.imageUrl,
        authorId: input.authorId,
        timeToRead: input.timeToRead,
        postType: input.postType,
        sourceUrl: input.sourceUrl,
        category: input.category,
      },
    }) as Promise<Post>;
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.post.delete({
      where: {
        id: input.id,
      },
    }) as Promise<Post>;
  }),
});


