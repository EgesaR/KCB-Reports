import { MetaFunction } from "@remix-run/node";
import { RiCheckFill } from "react-icons/ri";

export const meta : MetaFunction = () => [
  {
    title: "Our Mission and Values | Pricing KCB Reports",
    description: "Welcome to KCB Reports!",
  },
];

const tiers = [
  {
    name: "Hobby",
    id: "tier-hobby",
    href: "#",
    priceMonthly: "$24",
    description: "The perfect plan if you're just started with our product.",
    features: [
      "25 products",
      "Up to 10,000 subscribers",
      "Advanced analytics",
      "24-hour support response time",
    ],
    featured: false,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "$99",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Unlimited products",
      "Unlimited subscribers",
      "Advanced analytics",
      "Dedicated support representative",
      "Marketing automations",
      "Custom integrations",
    ],
    featured: true,
  },
];

const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const Pricing = () => {
  return (
    <div className="relative isolate bg-white dark:bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.7%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
          Pricing
        </h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 dark:text-gray-300 sm:text-xl">
        Choose an affordable plan that's packed with the best features for
        engaging your audience, creating customer loyalty, and driving sales.
      </p>
      <div className="mx-auto mt-16 max-w-lg text-pretty font-medium grid place-content-center">
        <div className="p-1 h-10 ring-1 ring-gray-900/10 dark:ring-gray-600 gap-x-2 rounded-full flex text-sm">
          <div className="h-full w-1/2 grid place-content-center text-white rounded-full bg-indigo-500 px-4 py-1">
            Monthly
          </div>
          <div className="h-full w-1/2 grid place-content-center text-gray-600 dark:text-gray-300 rounded-full px-4 py-1">
            Annually
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? "relative bg-gray-900 dark:bg-gray-800 shadow-2xl"
                : "bg-white/60 dark:bg-gray-900 sm:mx-8 lg:mx-0",
              tier.featured
                ? ""
                : tierIdx === 0
                ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-br-none"
                : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-br-3xl",
              "rounded-3xl p-8 ring-1 ring-gray-900/10 dark:ring-gray-700 sm:px-10"
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured
                  ? "text-indigo-400"
                  : "text-indigo-600 dark:text-indigo-400",
                "text-base font-semibold"
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured
                    ? "text-white"
                    : "text-gray-900 dark:text-gray-100",
                  "text-5xl font-semibold tracking-tight"
                )}
              >
                {tier.priceMonthly}
              </span>
              <span
                className={classNames(
                  tier.featured
                    ? "text-gray-400"
                    : "text-gray-500 dark:text-gray-400",
                  "text-base"
                )}
              >
                /month
              </span>
            </p>
            <p
              className={classNames(
                tier.featured
                  ? "text-gray-300"
                  : "text-gray-600 dark:text-gray-300",
                "mt-6 text-base"
              )}
            >
              {tier.description}
            </p>
            <ul
              className={classNames(
                tier.featured
                  ? "text-gray-300"
                  : "text-gray-600 dark:text-gray-300",
                "mt-8 space-y-3 text-sm sm:mt-10"
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <RiCheckFill
                    className={classNames(
                      tier.featured
                        ? "text-indigo-400"
                        : "text-indigo-600 dark:text-indigo-400",
                      "h-6 w-5 flex-none"
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                  : "text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700 hover:ring-indigo-300 focus-visible:outline-indigo-600",
                "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
              )}
            >
              Get started today
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
