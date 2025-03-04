---
import ChallengeLayout from "../../layouts/ChallengeLayout.astro";

import Step from "../../components/challenges/multi-step-form/Step";
import StepIndicator from "../../components/challenges/multi-step-form/StepIndicator";
import PersonalInfo from "../../components/challenges/multi-step-form/PersonalInfo";
import StepNavigation from "../../components/challenges/multi-step-form/StepNavigation";
import SubscriptionTimeToggle from "../../components/challenges/multi-step-form/SubscriptionTimeToggle";
import PlanItem from "../../components/challenges/multi-step-form/PlanItem";
import AddonItem from "../../components/challenges/multi-step-form/AddonItem";

import {
  planData,
  addonData,
} from "../../components/challenges/multi-step-form/StepProvider";
import CheckoutList from "../../components/challenges/multi-step-form/CheckoutList";
---

<ChallengeLayout title="Job Listings with Filtering">
  <Fragment slot="links"></Fragment>
  <nav>
    <StepIndicator client:only="react" />
  </nav>

  <main>
    <section class="step">
      <nav>
        <StepIndicator client:load />
      </nav>
      <Step step={1} client:load>
        <h1>Personal info</h1>
        <p class="description">
          Please provide your name, email address, and phone number.
        </p>

        <PersonalInfo client:load />
      </Step>
      <!-- Step 1 end -->

      <!-- Step 2 start -->
      <Step step={2} client:idle>
        <h1>Select your plan</h1>
        <p class="description">
          You have the option of monthly or yearly billing.
        </p>

        <div class="plan-selection">
          {
            planData.map((plan) => (
              <PlanItem
                client:only="react"
                src={`${Astro.url.href}/icon-${plan.title.toLowerCase()}.svg`}
                plan={plan}
              />
            ))
          }
        </div>

        <SubscriptionTimeToggle client:only="react" />
      </Step>
      <!-- Step 2 end -->

      <!-- Step 3 start -->
      <Step step={3} client:idle>
        <h1>Pick add-ons</h1>
        <p class="description">Add-ons help enhance your gaming experience.</p>

        <div class="addon-selection">
          {
            addonData.map((addon) => (
              <AddonItem client:only="react" addon={addon} />
            ))
          }
        </div>
      </Step>

      <!-- Step 3 end -->

      <!-- Step 4 start -->
      <Step step={4} client:idle>
        <h1>Finishing up</h1>
        <p class="description">
          Double-check everything looks OK before confirming.
        </p>

        <CheckoutList client:only="react" />
      </Step>

      <!-- Step 4 end -->

      <!-- Step 5 start -->

      <Step step={5} client:idle>
        <article class="thank-you">
          <img
            src={`${Astro.url.href}/icon-thank-you.svg`}
            alt="red check icon"
          />
          <h1>Thank you!</h1>
          <p>
            Thanks for confirming your subscription! We hope you have fun using
            our platform. If you ever need support, please feel free to email us
            at support@loremgaming.com.
          </p>
        </article>
      </Step>
      <StepNavigation client:only="react" />
    </section>

    <!-- Step 5 end -->
  </main>

  <StepNavigation client:only="react" />
</ChallengeLayout>

<style is:inline>
  @font-face {
    font-family: "Ubuntu";
    src: url("/frontend-mentor/challenges/fonts/Ubuntu-Regular.ttf")
      format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Ubuntu";
    src: url("/frontend-mentor/challenges/fonts/Ubuntu-Medium.ttf")
      format("truetype");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Ubuntu";
    src: url("/frontend-mentor/challenges/fonts/Ubuntu-Bold.ttf")
      format("truetype");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  :root {
    /* Primary */
    --marine-blue: hsl(213, 96%, 18%);
    --purplish-blue: hsl(243, 100%, 62%);
    --pastel-blue: hsl(228, 100%, 84%);
    --light-blue: hsl(206, 94%, 87%);
    --strawberry-red: hsl(354, 84%, 57%);
    /* Neutral */
    --cool-gray: hsl(231, 11%, 63%);
    --light-gray: hsl(229, 24%, 87%);
    --magnolia: -hsl(217, 100%, 97%);
    --alabaster: hsl(231, 100%, 99%);
    --white: hsl(0, 0%, 100%);
  }

  body {
    min-height: 100vh;
    background-color: var(--white);
    /* background-image: url("/assets//bg-sidebar-mobile.svg"); */
    background-position-y: top;
    background-repeat: no-repeat;
    font-size: 16px;
    font-family: "Ubuntu";
  }

  main {
    position: relative;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  nav {
    width: 100%;
    padding: 36px;
    padding-bottom: 100px;
    background-image: url("/assets//bg-sidebar-mobile.svg");
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 99;
  }

  nav ul {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  nav p,
  nav h2 {
    display: none;
  }

  .step article {
    z-index: 1;
  }

  .step nav {
    display: none;
  }

  .step-indicator span {
    height: 36px;
    width: 36px;
    border: 1px solid var(--pastel-blue);
    color: white;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
  }

  .step-indicator.active span {
    background-color: var(--pastel-blue);
    color: var(--marine-blue);
  }

  .step {
    width: 330px;
    padding: 24px 20px;
    border-radius: 16px;
    background-color: var(--alabaster);
    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.2);
    margin-top: -68px;
    overflow: hidden;
  }

  .step h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--marine-blue);
    margin-bottom: 12px;
  }

  .step .description {
    font-weight: 400;
    color: var(--cool-gray);
    font-size: 16px;
    margin-bottom: 16px;
  }

  .step input[type="text"] {
    width: 100%;
    border: 1px solid var(--light-gray);
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    margin-top: 4px;
    transition: border-color 200ms ease-in;
    outline: none;
  }

  .step input[type="text"]:focus {
    border-color: var(--marine-blue);
  }

  .step input::placeholder {
    font-weight: 700;
    color: var(--cool-gray);
  }

  .personal-info input.error {
    border-color: var(--strawberry-red);
  }

  .personal-info label {
    color: var(--marine-blue);
    font-weight: 400;
    font-size: 12px;
    display: block;
    margin-bottom: 12px;
  }

  .personal-info label div {
    display: flex;
    justify-content: space-between;
  }

  .personal-info span.error {
    color: var(--strawberry-red);
    font-weight: 700;
  }

  .plan-selection input {
    visibility: hidden;
    position: absolute;
  }

  .plan-selection label {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    border: 1px solid var(--light-gray);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: border-color 150ms ease-in;
  }

  .plan-selection label:hover {
    border-color: var(--marine-blue);
  }

  .plan-selection input[type="radio"]:checked + label {
    border-color: var(--marine-blue);
  }

  .plan-selection div {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .plan-selection h3 {
    font-weight: 500;
    color: var(--marine-blue);
    font-size: 16px;
  }

  .plan-selection p {
    color: var(--cool-gray);
    font-size: 14px;
  }

  .plan-selection .yearly-information {
    color: var(--marine-blue);
    font-size: 12px;
  }

  .button-month-year {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 16px;
  }

  .button-month-year label {
    height: 18px;
    background-color: var(--marine-blue);
    border-radius: 9px;
    width: 36px;
    padding-inline: 4px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    transition: justify-content 200ms ease-in;
    cursor: pointer;
  }

  .button-month-year label .dot {
    height: 60%;
    aspect-ratio: 1 / 1;
    background-color: var(--alabaster);
    border-radius: 100%;
  }

  .button-month-year strong {
    color: var(--cool-gray);
  }

  .button-month-year strong.active {
    color: var(--marine-blue);
  }

  .button-month-year input[type="checkbox"]:checked + label {
    justify-content: flex-end;
  }

  .button-month-year input {
    display: none;
  }

  .addon-selection input {
    position: absolute;
    opacity: 0;
  }

  .addon-selection label {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid var(--light-gray);
    border-radius: 8px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: border-color 150ms ease-in;
  }

  .addon-selection label:hover {
    border-color: var(--marine-blue);
  }

  .addon-selection label .checkmark {
    height: 18px;
    width: 18px;
    background-color: transparent;
    border: 1px solid var(--light-gray);
    border-radius: 4px;
    position: relative;
  }

  .addon-selection input[type="checkbox"]:checked + label .checkmark {
    background-color: var(--purplish-blue);
    border-color: var(--purplish-blue);
  }

  .addon-selection input[type="checkbox"]:checked + label {
    border-color: var(--marine-blue);
  }

  .addon-selection label .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    top: 40%;
    left: 50%;
  }

  .addon-selection input[type="checkbox"]:checked + label .checkmark:after {
    display: block;
  }

  .addon-selection label .checkmark:after {
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: translate(-50%, -50%) rotate(45deg);
    -ms-transform: translate(-50%, -50%) rotate(45deg);
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .addon-selection .input-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
  }

  .addon-selection h3 {
    color: var(--marine-blue);
    font-size: 14px;
    font-weight: 500;
  }

  .addon-selection p {
    font-size: 12px;
    color: var(--cool-gray);
  }

  .addon-selection .extra-price {
    color: var(--purplish-blue);
  }

  .finishing-up {
    padding: 12px;
    font-size: 14px;
    color: var(--cool-gray);
  }

  .finishing-up li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .finishing-up li > div {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .finishing-up li strong {
    font-weight: 500;
    color: var(--marine-blue);
  }

  .finishing-up li span {
    color: var(--marine-blue);
  }

  .finishing-up li:first-of-type > strong {
    font-weight: 700;
  }

  .finishing-up button {
    text-decoration: underline;
    font-weight: 500;
  }

  .finishing-up hr {
    border: none;
    background-color: var(--light-gray);
    height: 1px;
    margin-block: 12px;
  }

  .finishing-up .total-cost {
    margin-top: 28px;
  }

  .finishing-up .total-cost strong {
    color: var(--purplish-blue);
    font-weight: 700;
    font-size: 16px;
  }

  .thank-you {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .thank-you img {
    height: 64px;
    width: 64px;
    margin-block: 48px 24px;
  }

  .thank-you p {
    color: var(--cool-gray);
    text-align: center;
    padding-inline: 4px;
    margin-bottom: 64px;
    font-size: 15px;
  }

  .step .navigation-buttons {
    display: none;
  }

  .navigation-buttons {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    font-size: 14px;
    font-weight: 500;
    z-index: 999;
  }

  .navigation-buttons .back {
    color: var(--cool-gray);
    transition: color 150ms ease-in;
  }

  .navigation-buttons .back:hover {
    color: var(--marine-blue);
  }

  .navigation-buttons .next {
    background-color: var(--marine-blue);
    color: var(--white);
    padding: 8px 16px;
    border-radius: 4px;
    transition: opacity 150ms ease-in;
  }

  .navigation-buttons .next:hover {
    opacity: 0.85;
  }

  .navigation-buttons .next.final {
    background-color: var(--purplish-blue);
    transition: opacity 150ms ease-in;
  }

  .navigation-buttons .next.final:hover {
    opacity: 0.6;
  }

  @media only screen and (min-width: 756px) {
    main {
      min-height: 100vh;
      display: flex;
      flex-direction: row;
    }

    .step {
      width: 848px;
      height: 600px;
      display: flex;
      margin-top: unset;
      justify-content: space-between;
      padding: 20px;
      position: relative;
    }

    .navigation-buttons {
      display: none;
    }

    .step article {
      padding: 24px;
      margin-inline: 48px;
      flex: 1;
    }

    .step h1 {
      font-size: 32px;
    }

    nav {
      display: none;
    }

    .step nav {
      width: auto;
      display: flex;
      background-image: url("/assets//bg-sidebar-desktop.svg");
      background-size: cover;
      border-radius: 8px;
    }

    .step nav ul {
      justify-content: start;
      flex-direction: column;
      align-items: start;
    }

    .step-indicator {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .step-indicator > div {
      display: flex;
      flex-direction: column;
    }

    .step-indicator p,
    .step-indicator h2 {
      display: block;
      text-transform: uppercase;
    }

    .step-indicator p {
      font-weight: 400;
      font-size: 14px;
      color: var(--light-blue);
    }

    .step-indicator h2 {
      font-weight: 700;
      color: white;
    }

    .plan-selection {
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }

    .plan-selection label {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      gap: 48px;
    }
    .plan-selection div {
      flex: unset;
    }

    .thank-you {
      justify-content: center;
    }

    .step .navigation-buttons {
      display: flex;
      right: calc(48px + 24px);
      left: unset;
      width: calc(100% - 220px - 48px * 2 - 24px * 2);
    }
  }
</style>