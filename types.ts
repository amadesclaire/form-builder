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
export type UpdateWebhookPayload = Partial<CreateWebhookPayload>;

export type FormField = {
  question: string;
  description?: string;
  type:
    | "text"
    | "paragraph"
    | "choose-one" // radio
    | "checkbox"
    | "dropdown" // select
    | "file-upload"
    | "image"
    | "number"
    | "rating"
    | "range"
    | "tel"
    | "email"
    | "url"
    | "date"
    | "time"
    | "date-time";
  options?: string[];
  required: boolean;
};

export type Form = {
  id: string;
  owner: string;
  name: string;
  description: string;
  fields: FormField[];
  protected: boolean;
  password?: string;
  webhooks: Webhook[];
};
export type CreateFormPayload = Omit<Form, "id" | "owner" | "webhooks">;
export type UpdateFormPayload = Partial<CreateFormPayload>;

export type FormResponse = {
  id: string;
  formId: string;
  response: Record<string, string>;
};
export type CreateFormResponsePayload = Omit<FormResponse, "id">;
export type UpdateFormResponsePayload = Partial<CreateFormResponsePayload>;

type chooseOneOptions = string[];
type checkboxOptions = string[];
type dropdownOptions = string[];
type ratingOptions = number;
type rangeOptions = {
  min: number;
  max: number;
  step: number;
  leftLabel?: string;
  rightLabel?: string;
};
