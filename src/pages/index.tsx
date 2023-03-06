import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import MainLayout from "~/components/MainLayout";
import { Post, User } from "@prisma/client";
import { useState, useEffect } from "react";
import Image from "next/image";

const nameByCategory = (category: string) => {
  switch (category) {
    case "education":
      return "Обучение";
    case "medicine":
      return "Медицина";
    case "industry":
      return "Промышленность";
    case "it":
      return "Информационные технологии";
    case "auto":
      return "Автомобильная промышленность";
    default:
      return "Обучение";
  }
};

const colorByCategory = (category: string) => {
  switch (category) {
    case "Обучение":
      return "bg-indigo-100 text-indigo-800";
    case "Медицина":
      return "bg-green-100 text-green-800";
    case "Промышленность":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-indigo-100 text-indigo-800";
  }
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const getMinutesFromSeconds = (seconds: number) => {
  return Math.floor(seconds / 60);
};

const Post = ({ post }: { post: Post }) => {
  const user = api.users.getOne.useQuery({ id: post.authorId });

  return (
    <Link href="/post/[id]" as={`/post/${post.id}`}>
      <div key={post.title}>
        {/* Изображение и категория (друг в друге) */}
        <div className="group relative">
          <div className="aspect-w-3 aspect-h-2 cursor-pointer overflow-hidden rounded-lg">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="pointer-events-none object-cover group-hover:opacity-75"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-end px-4 py-4">
            <div className="rounded-full">
              <span
                className={classNames(
                  colorByCategory(nameByCategory(post.category)),
                  "inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium"
                )}
              >
                {nameByCategory(post.category)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 block">
          <p className="text-xl font-semibold text-gray-900">{post.title}</p>
          <p className="mt-3 text-base text-gray-500">
            {post.content.substring(0, 100)}
          </p>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <Link href="/post/[id]" as={`/post/${post.id}`}>
              <span className="sr-only">{user.data?.name}</span>
              <img
                src={user.data?.image || "/images/avatar.png"}
                className="h-10 w-10 rounded-full"
                alt=""
              />
            </Link>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              <Link href="/author/[id]" as={`/author/${post.authorId}`}>
                {user.data?.name}
              </Link>
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <span>{post.createdAt.toLocaleTimeString()}</span>
              <span aria-hidden="true">&middot;</span>
              {post.timeToRead && (
                <span>{getMinutesFromSeconds(post.timeToRead)} мин чтения</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Home: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = api.posts.getAll.useQuery();

  useEffect(() => {
    if (getPosts.data) {
      // const users: User[] = [];
      // getPosts.data.forEach((post) => {
      //   const isUserExists = users.find((user) => user.id === post.authorId);
      //   if (!isUserExists) {
      //     const user = api.users.getOne.useQuery({ id: post.authorId });

      //     if (user.data) {
      //       users.push(user.data);
      //     }
      //   }
      // });

      // setUsers(users);
      setPosts(getPosts.data);
    }
  }, [getPosts.data]);

  return (
    <MainLayout>
      {/* все публикации + кнопка создать */}
      <div className="min-h-full">
        <header className="pt-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Публикации</h1>
            <div className="mt-2 flex-shrink-0">
              <Link
                className="rounded-2xl bg-blue-600 p-4 text-base font-semibold text-white hover:bg-blue-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70"
                href="/create"
              >
                Создать публикацию
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-12 grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
            {posts.map((post) => (
              <Post post={post} key={post.id} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
