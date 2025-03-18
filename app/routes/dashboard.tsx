// app/routes/dashboard.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
import Sidebar from "~/components/Sidebar";
import { getUserSession } from "~/utils/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  if (!session.has("userId")) {
    return redirect("/auth/signin");
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="w-full h-screen flex overflow-hidden isolate relative text-black dark:text-white bg-white dark:bg-gray-950">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.7%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5]/50 to-[#9089fc]/50 opacity-30"
        />
      </div>
      <Sidebar />
      <div className="h-full w-[95%] px-4">

      </div>
    </div>
  );
}
