import { type NextPage } from "next";
import { signIn } from "next-auth/react";

const SignIn: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <section
          id="found-items"
          aria-labelledby="found-items-title"
          className="py-20 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
                Вход через ЛКС МИРЭА
              </h2>
              <p className="font-display mt-4 text-2xl tracking-tight text-blue-900">
                Для входа в систему вам необходимо авторизоваться через Личный
                кабинет студента МИРЭА.
              </p>
              <div className="flex flex-col items-center justify-center gap-4">
                <button
                  className="inline-flex justify-center rounded-2xl bg-blue-600 p-4 text-base font-semibold text-white hover:bg-blue-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70"
                  onClick={() => void signIn("mirea", { callbackUrl: "/" })}
                >
                  Войти через ЛКС
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignIn;
