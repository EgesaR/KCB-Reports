// app/routes/reports.$id.tsx
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useReport } from "~/contexts/ReportContext";
import { useTheme } from "~/components/ThemeProvider";
import { reports, type Report } from "~/data/reports";

// Define shared item types
interface SharedAvatar {
  src: string;
  alt: string;
}

interface SharedUser {
  name: string;
  href: string;
}

type SharedItem = SharedAvatar | SharedUser;

// Loader function
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const report = reports.find((report) => report.id === params.id);
  if (!report) {
    throw new Response("Report not found", { status: 404 });
  }
  return { report };
};

// Meta function
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const report = data?.report as Report | undefined;
  return [
    { title: report ? `${report.name} - KCB Reports` : "Report Not Found" },
    {
      name: "description",
      content: report ? `View details for ${report.name}` : "Report not found",
    },
  ];
};

// Define tab configurations for each mode
const tabs = {
  view: [
    { name: "Overview", id: "overview" },
    { name: "Shared With", id: "shared" },
    { name: "Metadata", id: "metadata" },
  ],
  edit: [
    { name: "Content", id: "content" },
    { name: "Metadata", id: "metadata" },
  ],
};

export default function ReportPage() {
  const { report } = useLoaderData<{ report: Report }>();
  const { isDarkMode } = useTheme();
  const { mode, setMode } = useReport();

  if (!report) {
    return (
      <div className="pt-16 p-4 bg-indigo-50 dark:bg-zinc-950 text-gray-900 dark:text-neutral-200 min-h-screen transition-colors duration-300 ease-in-out">
        <h1 className="text-2xl font-bold font-comfortaa">Report Not Found</h1>
        <p className="font-comfortaa">No report found with ID</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-indigo-50 dark:bg-zinc-950 transition-colors duration-300 ease-in-out">
      <article className="pt-16 p-4 relative overflow-hidden h-full text-gray-900 dark:text-neutral-200">
        <div className="overflow-auto h-[99%] pb-4 custom-scrollbar">
          <TabGroup>
            <TabList className="flex gap-4 mb-4">
              {tabs[mode].map(({ name, id }) => (
                <Tab
                  key={id}
                  className="rounded-full px-3 py-1 text-sm font-semibold font-comfortaa text-gray-900 dark:text-neutral-200 bg-dark data-[hover]:bg-gray-200 dark:data-[hover]:bg-zinc-800 data-[selected]:bg-gray-200 dark:data-[selected]:bg-zinc-800 data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-[var(--md-sys-color-primary)] transition-colors duration-200"
                  aria-label={`Select ${name} tab`}
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {mode === "view" ? (
                <>
                  <TabPanel className="rounded-xl bg-gray-100 dark:bg-zinc-800/50 p-3 transition-colors duration-200">
                    <h1 className="text-2xl font-bold mb-2 font-comfortaa">
                      {report.name}
                    </h1>
                    <p className="font-comfortaa">
                      {report.body?.content || "No content available"}
                    </p>
                  </TabPanel>
                  <TabPanel className="rounded-xl bg-gray-100 dark:bg-zinc-800/50 p-3 transition-colors duration-200">
                    <h2 className="text-lg font-semibold mb-2 font-comfortaa">
                      Shared With
                    </h2>
                    {report.shared.length > 0 ? (
                      <ul
                        className="list-disc pl-5"
                        aria-label="Shared with users"
                      >
                        {report.shared.map((item, index) => (
                          <li key={index} className="font-comfortaa">
                            {"name" in item ? (
                              <a
                                href={item.href}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                aria-label={`Profile for ${item.name}`}
                              >
                                {item.name}
                              </a>
                            ) : (
                              <img
                                src={item.src}
                                alt={
                                  item.alt ||
                                  `Avatar for shared user ${index + 1}`
                                }
                                aria-label={`Avatar for shared user ${
                                  index + 1
                                }`}
                                className="inline-block h-8 w-8 rounded-full"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-comfortaa">None</p>
                    )}
                  </TabPanel>
                  <TabPanel className="rounded-xl bg-gray-100 dark:bg-zinc-800/50 p-3 transition-colors duration-200">
                    <h2 className="text-lg font-semibold mb-2 font-comfortaa">
                      Metadata
                    </h2>
                    <div className="space-y-2 font-comfortaa">
                      <p>
                        <strong>Status:</strong> {report.status}
                      </p>
                      <p>
                        <strong>Last Updated:</strong>{" "}
                        {format(new Date(report.lastUpdated), "MMMM d, yyyy")}
                      </p>
                      <p>
                        <strong>Type:</strong> {report.type}
                      </p>
                      <p>
                        <strong>URL:</strong>{" "}
                        <a
                          href={report.url}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          aria-label={`Link to ${report.name} report`}
                        >
                          {report.url}
                        </a>
                      </p>
                    </div>
                  </TabPanel>
                </>
              ) : (
                <>
                  <TabPanel className="rounded-xl bg-gray-100 dark:bg-zinc-800/50 p-3 transition-colors duration-200">
                    <h2 className="text-lg font-semibold mb-2 font-comfortaa">
                      Edit Content
                    </h2>
                    <textarea
                      className="w-full p-2 rounded-md bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-neutral-200 font-comfortaa"
                      defaultValue={report.body?.content || ""}
                      rows={5}
                      aria-label="Edit report content"
                      placeholder="Edit the report content here..."
                    />
                    <button
                      className="mt-2 px-4 py-2 bg-[var(--md-sys-color-primary)] text-white rounded-md hover:bg-opacity-90 font-comfortaa"
                      aria-label="Save content changes"
                    >
                      Save Content
                    </button>
                  </TabPanel>
                  <TabPanel className="rounded-xl bg-gray-100 dark:bg-zinc-800/50 p-3 transition-colors duration-200">
                    <h2 className="text-lg font-semibold mb-2 font-comfortaa">
                      Edit Metadata
                    </h2>
                    <div className="space-y-2 font-comfortaa">
                      <div>
                        <label className="block text-sm font-medium">
                          Status
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 rounded-md bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-neutral-200"
                          defaultValue={report.status}
                          aria-label="Edit report status"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Type
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 rounded-md bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-neutral-200"
                          defaultValue={report.type}
                          aria-label="Edit report type"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">URL</label>
                        <input
                          type="url"
                          className="w-full p-2 rounded-md bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-neutral-200"
                          defaultValue={report.url}
                          aria-label="Edit report URL"
                        />
                      </div>
                      <button
                        className="mt-2 px4- py-2 bg-[var(--md-sys-color-primary)] text-white rounded-md hover:bg-gray-700"
                        aria-label="Save metadata changes"
                      >
                        Save Metadata
                      </button>
                    </div>
                  </TabPanel>
                </>
              )}
            </TabPanels>
            <p className="mt-4 font-comfortaa">
              Current theme: {isDarkMode ? "Dark" : "Light"}
            </p>
          </TabGroup>
        </div>
      </article>
    </div>
  );
}
