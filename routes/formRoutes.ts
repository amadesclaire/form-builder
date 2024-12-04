// formRoutes.ts
import { Handler, Route } from "@std/http";

interface FormController {
  signupForm: Handler;
  signup: Handler;
  login: Handler;
  logout: Handler;
  me: Handler;
}

const formController: FormController = {
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

export const formRoutes = (): Route[] => [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/form/signup" }),
    handler: formController.signupForm,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/form/signup" }),
    handler: formController.signup,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/form/login" }),
    handler: formController.login,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/form/logout" }),
    handler: formController.logout,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/form/me" }),
    handler: formController.me,
  },
];
