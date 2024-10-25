import HistoryFiles from "@/features/files/HistoryFiles";
import FormUpload from "@/features/uploads/FormUpload";
import GuestLayout from "@/layouts/GuestLayout";
import Head from "next/head";

export default function Home() {
  return (
    <GuestLayout>
      <Head>
        <title>Zippyshare</title>
      </Head>

      <FormUpload />

      <HistoryFiles />
    </GuestLayout>
  )
}