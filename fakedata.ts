import type { Form } from "./types.ts";

const exampleForm: Form = {
  id: "1",
  name: "Form 1",
  fields: [
    {
      question: "What is your name?",
      description: "Please enter your full name",
      type: "text",
      required: true,
    },
    {
      question: "What is your age?",
      description: "Please enter your age",
      type: "number",
      required: false,
    },
  ],
  description: "Hello world",
  protected: false,
  owner: "",
  webhooks: [],
};

export const fakeForms: Form[] = [
  exampleForm,
  {
    id: "2",
    name: "Form 2",

    fields: [
      {
        question: "What is your favorite color?",
        description: "Please enter your favorite color",
        type: "dropdown",
        options: ["Red", "Green", "Blue"],
        required: true,
      },
      {
        question: "What is your favorite number?",
        description: "Please enter your favorite number",
        type: "number",
        required: false,
      },
    ],
    description: "hello world",
    protected: false,
    owner: "",
    webhooks: [],
  },
];
