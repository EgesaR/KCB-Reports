import { useState } from "react";
import { motion } from "framer-motion";
import AddonItem from "./multi-step-form/AddonItem";
import CheckoutList from "./multi-step-form/CheckoutList";
import PersonalInfo from "./multi-step-form/PersonalInfo";
import PlanItem from "./multi-step-form/PlanItem";
import Step from "./multi-step-form/Step";
import StepIndicator from "./multi-step-form/StepIndicator";
import StepNavigation from "./multi-step-form/StepNavigation";
import { addonData, planData } from "./multi-step-form/StepProvider";
import SubscriptionTimeToggle from "./multi-step-form/SubscriptionTimeToggle";

const Stepper = () => {
  const [showSignUpStepper, setShowSignUpStepper] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      {!showSignUpStepper && (
        <div className="h-full w-full grid place-content-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-blue-500 to-purple-600 p-6"
          >
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-14 text-center">
              <h2 className="text-4xl font-bold text-gray-800">Welcome to KCB Reports</h2>
              <p className="text-gray-500 mt-2">
                Your go-to hub for smart, smooth, and powerful reporting! Get ready for the next big leap in education! 🚀🔥
              </p>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-14"
                onClick={() => setShowSignUpStepper(true)}
              >
                Let's get started
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showSignUpStepper && (
        <section className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 flex flex-row gap-6">
          <nav className="w-full">
            <StepIndicator />
          </nav>
          <Step step={1}>
            <h1 className="text-2xl font-bold text-blue-900">Personal info</h1>
            <p className="text-gray-500">Please provide your name, email address, and phone number.</p>
            <PersonalInfo />
          </Step>

          <Step step={2}>
            <h1 className="text-2xl font-bold text-blue-900">Select your role</h1>
            <p className="text-gray-500">You have the option of monthly or yearly billing.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planData.map((plan) => (
                <PlanItem key={plan.title} src={`/assets/icon-${plan.title.toLowerCase()}.svg`} plan={plan} />
              ))}
            </div>
            <SubscriptionTimeToggle />
          </Step>

          <Step step={3}>
            <h1 className="text-2xl font-bold text-blue-900">Pick add-ons</h1>
            <p className="text-gray-500">Add-ons help enhance your experience.</p>
            <div className="grid gap-4">
              {addonData.map((addon) => (
                <AddonItem key={addon.title} addon={addon} />
              ))}
            </div>
          </Step>

          <Step step={4}>
            <h1 className="text-2xl font-bold text-blue-900">Finishing up</h1>
            <p className="text-gray-500">Double-check everything before confirming.</p>
            <CheckoutList />
          </Step>

          <Step step={5}>
            <article className="text-center flex flex-col items-center">
              <img src="/assets/icon-thank-you.svg" alt="Thank You" width={80} height={80} className="mb-4" />
              <h1 className="text-2xl font-bold text-blue-900">Thank you!</h1>
              <p className="text-gray-500 max-w-md">
                Thanks for confirming your subscription! If you ever need support, please feel free to email us.
              </p>
            </article>
          </Step>

          <StepNavigation />
        </section>
      )}
    </main>
  );
};

export default Stepper;
