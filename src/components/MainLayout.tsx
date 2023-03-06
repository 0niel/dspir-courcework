import Head from "next/head";
import Header from "~/components/Header";

export interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout(props: LayoutProps) {
  return (
    <>
      <Head>
        <title>Основы разработки виртуальных цифровых двойников</title>
        <meta
          name="description"
          content="Основы разработки виртуальных цифровых двойников"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {props.children}
    </>
  );
}
