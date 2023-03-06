import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import MainLayout from "~/components/MainLayout";
import { Fragment, MouseEventHandler, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  LinkIcon,
  PaperClipIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import toast, { Toaster } from "react-hot-toast";

const types = [
  { name: "В каталог", value: "catalog" },
  {
    name: "Статья",
    value: "article",
  },
];

const articleCategories = [
  { name: "Обучение", value: "education" },
  { name: "Медицина", value: "medicine" },
  { name: "Промышленность", value: "industry" },
  { name: "Информационные технологии", value: "it" },
  { name: "Автомобильная промышленность", value: "auto" },
];

const catalogCategories = [
  { name: "Обучение", value: "education" },
  { name: "Медицина", value: "medicine" },
  { name: "Промышленность", value: "industry" },
  { name: "Информационные технологии", value: "it" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const CreatePost: NextPage = () => {
  const [postType, setPostType] = useState(types[1]);
  const [aviableCategories, setAviableCategories] = useState(articleCategories);
  const [postCategory, setPostCategory] = useState(articleCategories[0]);

  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  const computeTimeToRead = (content: string) => {
    const wordsPerMinute = 200;
    const noOfWords = content.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    const readTime = Math.ceil(minutes);
    return readTime;
  };

  const postCreate = api.posts.create.useMutation();

  const onSubmit = async () => {
    if (session === null) {
      toast.error("Вы не авторизованы");
      return;
    }

    const timeToRead = computeTimeToRead(content);

    if (title === "") {
      toast.error("Заголовок не может быть пустым");
      return;
    }

    if (content === "") {
      toast.error("Описание не может быть пустым");
      return;
    }

    if (imageUrl === "") {
      toast.error("Изображение не может быть пустым");
      return;
    }

    if (
      (sourceUrl === "" || sourceUrl === null) &&
      postType.value === "catalog"
    ) {
      toast.error(
        "Ссылка на источник не может быть пустой для данного типа публикации"
      );
      return;
    }

    const newPost = {
      title: title,
      content: content,
      imageUrl: imageUrl,
      sourceUrl: sourceUrl,
      category: postCategory.value,
      timeToRead: timeToRead,
      postType: postType.value,
      authorId: session.user.id,
    };

    const res = await postCreate.mutateAsync(newPost, {
      onSuccess: (newPost) => {
        console.log(newPost);
      },
    });
  };

  useEffect(() => {
    if (postType.value === "article") {
      setPostCategory(articleCategories[0]);
      setAviableCategories(articleCategories);
    } else {
      setPostCategory(catalogCategories[0]);
      setAviableCategories(catalogCategories);
    }
  }, [postType]);

  return (
    <>
      <MainLayout>
        <div className="min-h-full">
          <header className="pt-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Создать публикацию
              </h1>
            </div>
          </header>

          <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
            <form action="#" className="relative space-y-8">
              <div className="overflow-hidden rounded-lg border border-gray-300 p-6 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <label htmlFor="title" className="sr-only">
                  Заголовок
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0"
                  placeholder="Заголовок"
                  defaultValue={""}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="description" className="sr-only">
                  Описание
                </label>
                <textarea
                  rows={5}
                  name="description"
                  id="description"
                  className="block w-full resize-none border-0 py-0 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Напишите описание публикации..."
                  defaultValue={""}
                  onChange={(e) => setContent(e.target.value)}
                />

                <div aria-hidden="true">
                  <div className="py-2">
                    <div className="h-9" />
                  </div>
                  <div className="h-px" />
                  <div className="py-2">
                    <div className="py-px">
                      <div className="h-9" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-px bottom-0">
                <div className="flex flex-nowrap justify-end space-x-2 py-2 px-2 sm:px-3">
                  <Listbox
                    as="div"
                    value={postType}
                    onChange={setPostType}
                    className="flex-shrink-0"
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="sr-only">
                          {" "}
                          Тип публикации{" "}
                        </Listbox.Label>
                        <div className="relative">
                          <Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
                            <TagIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span
                              className={classNames(
                                postType.value === null ? "" : "text-gray-900",
                                "hidden truncate sm:ml-2 sm:block"
                              )}
                            >
                              {postType.value === null ? "Тип" : postType.name}
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {types.map((assignee) => (
                                <Listbox.Option
                                  key={assignee.value}
                                  className={({ active }) =>
                                    classNames(
                                      active ? "bg-gray-100" : "bg-white",
                                      "relative cursor-default select-none py-2 px-3"
                                    )
                                  }
                                  value={assignee}
                                >
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        assignee.value === null
                                          ? ""
                                          : "text-gray-900",
                                        "block truncate"
                                      )}
                                    >
                                      <TagIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </span>

                                    <span className="ml-3 block truncate font-medium">
                                      {assignee.name}
                                    </span>
                                  </div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>

                  <Listbox
                    as="div"
                    value={postCategory}
                    onChange={setPostCategory}
                    className="flex-shrink-0"
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="sr-only">
                          {" "}
                          Категория публикации{" "}
                        </Listbox.Label>
                        <div className="relative">
                          <Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
                            <TagIcon
                              className={classNames(
                                postCategory.value === null
                                  ? "text-gray-300"
                                  : "text-gray-500",
                                "h-5 w-5 flex-shrink-0 sm:-ml-1"
                              )}
                              aria-hidden="true"
                            />
                            <span
                              className={classNames(
                                postCategory.value === null
                                  ? ""
                                  : "text-gray-900",
                                "hidden truncate sm:ml-2 sm:block"
                              )}
                            >
                              {postCategory.value === null
                                ? "Label"
                                : postCategory.name}
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {aviableCategories.map((label) => (
                                <Listbox.Option
                                  key={label.value}
                                  className={({ active }) =>
                                    classNames(
                                      active ? "bg-gray-100" : "bg-white",
                                      "relative cursor-default select-none py-2 px-3"
                                    )
                                  }
                                  value={label}
                                >
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        label.value === null
                                          ? ""
                                          : "text-gray-900",
                                        "block truncate"
                                      )}
                                    >
                                      <TagIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </span>

                                    <span className="ml-3 block truncate font-medium">
                                      {label.name}
                                    </span>
                                  </div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
                <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
                  <div className="flex">
                    <div className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400">
                      <label className="text-sm italic text-gray-500 group-hover:text-gray-600">
                        <PaperClipIcon
                          className="-ml-1 mr-2 h-5 w-5 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </label>
                      <input
                        type="text"
                        name="image"
                        id="image"
                        className="text-sm italic text-gray-500 group-hover:text-gray-600"
                        placeholder="https://example.com.jpg"
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {postType.value === "catalog" && (
                    <div className="flex">
                      <div className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400">
                        <label className="text-sm italic text-gray-500 group-hover:text-gray-600">
                          <LinkIcon
                            className="-ml-1 mr-2 h-5 w-5 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </label>
                        <input
                          type="text"
                          name="link"
                          id="link"
                          className="text-sm italic text-gray-500 group-hover:text-gray-600"
                          placeholder="Источник"
                          onChange={(e) => setSourceUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex-shrink-0">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        void onSubmit();
                      }}
                    >
                      Опубликовать
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
      <Toaster position="bottom-center" />
    </>
  );
};

export default CreatePost;
