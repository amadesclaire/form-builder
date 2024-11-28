# Form Builder

## **Key Features**

### **1. User Authentication**

- **Sign-Up**: Users can create accounts with username, email, and password.
- **Login**: Users can log in using their email and password.
- **Protected Routes**: JWT-based authentication secures protected API endpoints.
- **Session Management**: JWT tokens are issued upon login for user session handling.
- **User Info Retrieval**: Authenticated users can fetch their account details.

### **2. Form Management**

- **Create Forms**: Users can define custom forms with fields (e.g., text, email, checkbox, etc.).
- **Edit Forms**: Modify form definitions, including title, description, and fields.
- **Delete Forms**: Remove forms when no longer needed.
- **View Forms**: Retrieve JSON definitions of forms via API or display them as plain HTML.

### **3. Form Submission**

- **HTML Forms**: Dynamically render forms as HTML pages for easy user submission.
- **Submit Responses**: Allow users to submit responses via web forms or API.
- **Data Storage**: Save form definitions and responses as JSON in MongoDB.

### **4. Namespaced Links**

- **Unique URLs**: Each form is accessible via a namespaced URL, e.g., `/forms/{namespace}/{formId}`.
- **Personalization**: Users can group forms under their unique namespace.

### **5. Webhooks**

- **Event-Based Notifications**: Support webhooks triggered by form submissions.
- **Custom URLs**: Users can specify webhook URLs to receive form data.
- **Security**: Optionally sign webhook payloads for secure data transmission.

### **6. API for Developers**

- **CRUD Operations**: API endpoints for creating, retrieving, updating, and deleting forms.
- **Submit Responses**: API endpoint to programmatically submit form responses.
- **Webhook Management**: API for creating, listing, and deleting webhooks.

### ** 7. API Key Management**

- **Generate API Keys**: API keys are issued to authenticated users upon request.
- **Authenticate Requests**: API requests must include a valid API key in the headers or query parameters.
- **Rate Limiting**: Limit requests based on the API key.
- **API Key Revocation**: Users can revoke their API keys if needed.
- **Secure Storage**: API keys are securely stored as hashed values in the database.

## **Routes**

### **Authentication Routes**

| Method | Route          | Description                |
| ------ | -------------- | -------------------------- |
| POST   | `/auth/signup` | Create a new user.         |
| POST   | `/auth/login`  | Authenticate a user.       |
| GET    | `/auth/me`     | Fetch logged-in user info. |

---

### **Form Management API**

| Method | Route                           | Description                               |
| ------ | ------------------------------- | ----------------------------------------- |
| GET    | `/api/forms`                    | Get all forms for the authenticated user. |
| POST   | `/api/forms`                    | Create a new form.                        |
| GET    | `/api/forms/:namespace/:formId` | Get form details by ID.                   |
| PUT    | `/api/forms/:namespace/:formId` | Update an existing form.                  |
| DELETE | `/api/forms/:namespace/:formId` | Delete a form.                            |

---

### **Form Submission API**

| Method | Route                              | Description              |
| ------ | ---------------------------------- | ------------------------ |
| GET    | `/forms/:namespace/:formId`        | Render the form as HTML. |
| POST   | `/forms/:namespace/:formId/submit` | Submit a form response.  |

---

### **Webhook Management API**

| Method | Route                              | Description                        |
| ------ | ---------------------------------- | ---------------------------------- |
| POST   | `/api/webhooks`                    | Define a new webhook.              |
| GET    | `/api/webhooks/:namespace`         | List all webhooks for a namespace. |
| DELETE | `/api/webhooks/:namespace/:hookId` | Delete a webhook.                  |

---

## **Models**

### **User Model**

```typescript
export interface User {
  id: string; // MongoDB ObjectId or UUID
  username: string;
  email: string;
  passwordHash: string; // Hashed password
  createdAt: Date;
  updatedAt: Date;
}
```

### **Form Model**

```typescript
export interface Form {
  id: string; // UUID or MongoDB ObjectId
  namespace: string; // User-defined namespace
  title: string; // Form title
  description?: string; // Optional description
  fields: FormField[]; // Array of form fields
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  name: string; // Field name
  type: "text" | "email" | "number" | "checkbox" | "radio" | "textarea"; // Field type
  options?: string[]; // For checkbox/radio fields
  required: boolean; // Is field mandatory
}
```

### **Form Response Model**

```typescript
export interface FormResponse {
  id: string; // UUID or MongoDB ObjectId
  formId: string; // Associated form ID
  namespace: string; // Namespace of the form
  responses: Record<string, any>; // Field name to value mapping
  submittedAt: Date;
}
```

### **Webhook Model**

```typescript
export interface Webhook {
  id: string; // UUID or MongoDB ObjectId
  namespace: string; // Namespace the webhook is associated with
  event: "form_submission"; // Event type
  url: string; // Webhook URL
  secret?: string; // Optional secret for signing payloads
  createdAt: Date;
}
```

---

## **Directory Structure**

```
src/
  controllers/
    userController.ts
    formController.ts
    responseController.ts
    webhookController.ts
  models/
    userModel.ts
    formModel.ts
    responseModel.ts
    webhookModel.ts
  routes/
    authRoutes.ts
    formRoutes.ts
    responseRoutes.ts
    webhookRoutes.ts
  middleware/
    authMiddleware.ts
  views/
    formView.ts
  app.ts
test/
  authController.test.ts
  formController.test.ts
  responseController.test.ts
```

---

## **Additional Features**

1. **Data Validation**: Ensure fields like email and password meet specific criteria.
2. **Password Security**: Use bcrypt for hashing passwords.
3. **Token Management**: Use JWT for secure user sessions.
4. **Scalable Storage**: Store forms, responses, and webhooks as JSON in MongoDB.
5. **Security for Webhooks**: Optionally sign payloads to ensure data integrity.
