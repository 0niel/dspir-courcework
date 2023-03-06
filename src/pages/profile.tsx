import { type NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import MainLayout from "~/components/MainLayout";
import Image from "next/image";
import { Post } from "@prisma/client";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";

const Profile: NextPage = () => {
  const { data: session } = useSession();

  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = api.posts.getAll.useQuery();

  useEffect(() => {
    if (getPosts.data) {
      setPosts(getPosts.data);
    }
  }, [getPosts.data]);

  return (
    <MainLayout>
      <div className="min-h-full">
        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
          </div>
        </header>

        {session && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
              <div className="px-5 py-6 sm:px-6">
                <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  {/* Аватарка и имя */}
                  <div className="flex items-center space-x-4">
                    <Image
                      src={session?.user?.image || "/images/avatar.png"}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover"
                      alt=""
                    />

                    {/* Имя */}
                    <div className="mt-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {session?.user?.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-500">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Редактировать */}
                  <div className="mt-2 flex-shrink-0">
                    <Link
                      href="https://lk.mirea.ru"
                      className="w-full rounded-2xl bg-blue-600 p-4 text-base font-semibold text-white hover:bg-blue-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70"
                    >
                      Перейти в ЛКС
                    </Link>
                  </div>
                </div>

                {/* Разделитель */}
                <div className="my-6 border-t border-gray-200"></div>

                {/* Публикации */}
                <div className="mt-6">
                  <div className="mt-6 flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {posts.map((post) => (
                        <li key={post.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <Image
                                src={post.imageUrl}
                                width={80}
                                height={80}
                                className="h-20 w-20 rounded-full object-cover"
                                alt=""
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/post/${post.id}`}
                                className="focus:outline-none"
                              >
                                <span className="absolute inset-0"></span>
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {post.title}
                                </p>
                                <p className="truncate text-sm text-gray-500">
                                  {post.content.slice(0, 100)} ...
                                </p>
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!session && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="px-5 py-6 sm:px-6">
              <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="mt-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Вы не авторизованы
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      Для того чтобы просматривать свой профиль, вам необходимо
                      авторизоваться
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex-shrink-0">
                  <Link
                    href="/signin"
                    className="w-full rounded-2xl bg-blue-600 p-4 text-base font-semibold text-white hover:bg-blue-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70"
                  >
                    Авторизоваться
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
