// authRoutes.ts
import { Handler, Route } from "@std/http";

interface AuthController {
  signupForm: Handler;
  signup: Handler;
  login: Handler;
  logout: Handler;
  me: Handler;
}

const authController: AuthController = {
  signupForm: (_req) => {
    return new Response("Signup form");
  },
  signup: (_req) => {
    return new Response("Signup");
  },
  login: (_req) => {
    return new Response("Login");
  },
  logout: (_req) => {
    return new Response("Logout");
  },
  me: (_req) => {
    return new Response("Me");
  },
};

export const authRoutes = (): Route[] => [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/auth/signup" }),
    handler: authController.signupForm,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/auth/signup" }),
    handler: authController.signup,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/auth/login" }),
    handler: authController.login,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/auth/logout" }),
    handler: authController.logout,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/auth/me" }),
    handler: authController.me,
  },
];
