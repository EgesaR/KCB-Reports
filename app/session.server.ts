import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET || "my-secret";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "my-session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "strict",
    httpOnly: true,
  },
});

export { getSession, commitSession, destroySession };
