import type { Form, FormResponse } from "./types.ts";
import { genId } from "./utils/genId.ts";

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
      {
        question: "Can we contact you via email",
        description: "",
        type: "choose-one",
        options: ["Yes", "No"],
        required: false,
      },
    ],
    description: "hello world",
    protected: false,
    owner: "",
    webhooks: [],
  },
];

export const fakeResponses: FormResponse[] = [
  {
    id: genId(),
    formId: "1",
    response: {
      "What is your name?": "Alice",
      "What is your age?": 25,
    },
  },
  {
    id: genId(),
    formId: "1",
    response: {
      "What is your name?": "Bob",
      "What is your age?": 30,
    },
  },
  {
    id: genId(),
    formId: "2",
    response: {
      "What is your favorite color?": "Red",
      "What is your favorite number?": 5,
      "Can we contact you via email": "Yes",
    },
  },
];

const v = genId().split("-")[4];
