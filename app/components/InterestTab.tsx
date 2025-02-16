import { Suspense } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import BlogCard from "./BlogCard";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

// ✅ Error Fallback Component
const ErrorFallback = () => (
  <p className="text-red-500 text-center mt-10">Something went wrong. 😕</p>
);

const InterestTabs = ({ blogs }: { blogs: any[] }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<p className="text-center mt-10">Loading tabs...</p>}>
        <TabGroup>
          <TabList className="flex space-x-4">
            <Tab className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800">
              Popular
            </Tab>
            <Tab className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800">
              Latest
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {blogs.map((blog, idx) => (
                <BlogCard key={idx} blog={blog} />
              ))}
            </TabPanel>
            <TabPanel>
              {blogs.slice(0, 5).map((blog, idx) => (
                <BlogCard key={idx} blog={blog} />
              ))}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Suspense>
    </ReactErrorBoundary>
  );
};

export default InterestTabs;
