// authRoutes.ts
import { Route } from "@std/http";
import AuthController from "controllers/authController.ts";

export const authRoutes = (authController: AuthController): Route[] => [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/auth/signup" }),
    handler: authController.signupForm,
  }
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
