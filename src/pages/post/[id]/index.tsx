import { Post } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "~/components/MainLayout";
import { api } from "~/utils/api";

const PostPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;

  const [post, setPost] = useState<Post>();

  const getPosts = api.posts.getOne.useQuery({ id: id as string });

  const deletePost = api.posts.delete.useMutation();

  useEffect(() => {
    if (getPosts.data) {
      setPost(getPosts.data);
    }
  }, [getPosts.data]);

  return (
    <MainLayout>
      <div className="relative bg-white py-16 sm:py-24">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-24 lg:px-8">
          <div className="relative sm:py-16 lg:py-0">
            <div
              aria-hidden="true"
              className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen"
            >
              <div className="absolute inset-y-0 right-1/2 w-full rounded-r-3xl bg-gray-50 lg:right-72" />
              <svg
                className="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                width={404}
                height={392}
                fill="none"
                viewBox="0 0 404 392"
              >
                <defs>
                  <pattern
                    id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={392}
                  fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
                />
              </svg>
            </div>
            <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:px-0 lg:py-20">
              {/* Testimonial card*/}
              <div className="relative overflow-hidden rounded-2xl pt-64 pb-10 shadow-xl">
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src={post?.imageUrl}
                  alt=""
                />
                <div className="absolute inset-0 bg-indigo-500 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 via-indigo-600 opacity-90" />
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
            {/* Content area */}
            <div className="pt-12 sm:pt-16 lg:pt-20">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {post?.title}
              </h2>
              <div className="mt-6 space-y-6 text-gray-500">
                <p className="text-lg">{post?.content}</p>
              </div>
            </div>

            <div className="mt-10">
              {/* кнопка удаления поста */}
              <button
                onClick={() => {
                  deletePost.mutate({ id: post?.id as string });
                  void router.push("/");
                }}
                className="rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage;
