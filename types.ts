export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export type Webhook = {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
};
export type CreateWebhookPayload = Omit<Webhook, "id" | "active">;
export type UpdateWebhookPayload = Partial<Webhook>;

export type rangeOptions = {
  min: number;
  max: number;
  step: number;
  leftLabel?: string;
  rightLabel?: string;
};

export type FormField =
  | {
      question: string;
      description?: string;
      type:
        | "text"
        | "paragraph"
        | "file-upload"
        | "image"
        | "number"
        | "tel"
        | "email"
        | "url"
        | "date"
        | "time"
        | "date-time";
      required: boolean;
    }
  | {
      question: string;
      description?: string;
      type: "choose-one" | "checkbox" | "dropdown";
      options: string[];
      required: boolean;
    }
  | {
      question: string;
      description?: string;
      type: "rating";
      options: number;
      required: boolean;
    }
  | {
      question: string;
      description?: string;
      type: "range";
      options: rangeOptions;
      required: boolean;
    };

export type Form = {
  id: string;
  owner: string;
  name: string;
  description: string;
  fields: FormField[];
  protected: boolean;
  password?: string; // Only required if `protected` is true
  webhooks: Webhook[];
};

export type CreateFormPayload = Omit<Form, "id" | "owner" | "webhooks">;
export type UpdateFormPayload = Partial<CreateFormPayload>;

export type FormResponseBody = Record<string, string | number | string[]>;

export type FormResponse = {
  id: string;
  formId: string;
  response: FormResponseBody;
};
export type CreateFormResponsePayload = Omit<FormResponse, "id">;
export type UpdateFormResponsePayload = Partial<FormResponse>;

// Utility type for making specific fields optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
