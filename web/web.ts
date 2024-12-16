import { Hono } from "@hono/hono";
import { html } from "@hono/hono/html";
import forms from "./forms.ts";
import webhooks from "./webhooks.ts";
import respond from "./respond.ts";
export const web = new Hono({ strict: false });

// Styles ****************************************************************
export const head = html`<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Create Form</title>
  <link rel="stylesheet" href="/static/terminal.css" />
</head>`;

const NewHomePage = html` ${head}
  <body>
    <div class="container">
      <header class="terminal-banner space-between">
        <h1 class="terminal-heading">Skeleton Forms</h1>
        <div class="terminal-flex" style="gap: 12px;">
          <a href="/login" class="terminal-link">Login</a>
          <span class="terminal-text">|</span>
          <a href="/signup" class="terminal-link">Signup</a>
        </div>
      </header>

      <br />

      <p class="terminal-alert-primary">
        The simple, flexible form builder for developers.
      </p>
      <p>
        Skeleton Forms is a lightweight form builder made for developers who
        want an easy way to collect and process data. It comes with a
        straightforward REST API and built-in webhook support, so you can
        quickly integrate forms into your workflows and automate tasks without
        the hassle.
      </p>
      <hr class="terminal-hr" />
      <br />

      <!-- Features Section -->
      <h2 class="terminal-heading">Features</h2>
      <div>
        <strong>Developer Friendly</strong>
        <p>Build and manage forms programmatically with our API.</p>
        <strong>Webhook Integrations</strong>
        <p>
          Automate your workflows by triggering external services on form
          submissions.
        </p>
        <strong>Flexible Usage</strong>
        <p>
          Choose between simple pricing tiers or flexible pay-per-use options
          that scale with your needs.
        </p>
        <strong>Lightweight & Fast</strong>
        <p>
          Built for speed and simplicity, Skeleton Forms won&apos;t slow you
          down.
        </p>
      </div>
      <hr class="terminal-hr" />
      <br />

      <!-- Pricing Section -->
      <h2 class="terminal-heading">Pricing</h2>
      <div class="free-tier" style="margin: 0 auto;">
        <div class="plan">
          <strong>Free</strong>
          <div style="display:flex; align-items: baseline;">
            <h2>$0</h2>
            <small>/per month</small>
          </div>
          <ul>
            <li>1 Form</li>
            <li>100 Responses</li>
            <li>100 Webhook calls</li>
          </ul>
        </div>
      </div>
      <br />
      <div class="pricing">
        <div class="plan">
          <strong>Basic</strong>
          <div style="display:flex; align-items: baseline;">
            <h2>$2</h2>
            <small>/per month</small>
          </div>
          <span>or</span>
          <div style="display:flex; align-items: baseline;">
            <h2>$20</h2>
            <small>/per year</small>
          </div>
          <ul>
            <li>10 Forms</li>
            <li>1000 Responses</li>
            <li>1000 Webhook calls</li>
          </ul>
        </div>
        <div class="plan">
          <strong>Pro</strong>
          <div style="display:flex; align-items: baseline;">
            <h2>$10</h2>
            <small>/per month</small>
          </div>
          <span>or</span>
          <div style="display:flex; align-items: baseline;">
            <h2>$96</h2>
            <small>/per year</small>
          </div>
          <ul>
            <li>100 Forms</li>
            <li>10,000 Responses</li>
            <li>10,000 Webhook calls</li>
          </ul>
        </div>
        <div class="plan">
          <strong>Flex</strong>
          <div style="display:flex; align-items: baseline;">
            <h2>1&cent;</h2>
            <small>/per form</small>
          </div>
          <div style="display:flex; align-items: baseline;">
            <h2>0.01&cent;</h2>
            <small>/per response</small>
          </div>
          <div style="display:flex; align-items: baseline;">
            <h2>0.01&cent;</h2>
            <small>/per webhook call</small>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div style="text-align: center; margin-top: 20px;">
        <button class="btn btn-default">Get Started</button>
      </div>
    </div>
  </body>`;
const OldHomePage = html`
  <style>
    .c {
      padding: 0;
      margin: 48px auto;
      max-width: 768px;
      font-family: ui-monospace, monospace;
      font-size: 90%;
    }
    .o {
      border-left: 4px solid #16a34a;
      margin-left: -16px;
      padding-left: 12px;
    }
    body {
      @media (prefers-color-scheme: dark) {
        background-color: #333;
        color: #fff;
        a {
          color: #16a34a;
        }
      }
    }
    .f {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .a {
      display: flex;
      gap: 12px;
    }

    p {
      line-height: 1.5;
    }
    tr {
      padding-bottom: 20px;
    }
    .pricing {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-content: space-between;
      border: 2px dashed #000;
      @media (prefers-color-scheme: dark) {
        border-color: #fff;
      }
      .plan {
        border-right: 2px dashed #000;
        @media (prefers-color-scheme: dark) {
          border-color: #fff;
        }
        padding: 12px;
        h2 {
          margin-bottom: 0;
        }
      }
      .plan:last-child {
        border-right: none;
      }
      ul {
        padding-left: 1rem;
        list-style-type: disc;
        line-height: 1.5;
      }
    }
  </style>

  <div class="c">
    <div class="f">
      <h1>Skeleton Forms</h1>
      <div class="a">
        <a href="/login">Login</a>
        <span>|</span>
        <a href="/signup">Signup</a>
      </div>
    </div>

    <p class="o">The simple, flexible form builder for developers.</p>
    <p>
      Skeleton Forms is a lightweight form builder made for developers who want
      an easy way to collect and process data. It comes with a straightforward
      REST API and built-in webhook support, so you can quickly integrate forms
      into your workflows and automate tasks without the hassle.
    </p>
    <br />
    <!--------------------Features------------------------>
    <h2>Features</h2>
    <hr style="border-top: 2px dashed #000" />
    <br />
    <strong>Developer Friendly</strong>
    <p>Build and manage forms programmatically with our API.</p>
    <strong>Webhook integrations</strong>
    <p>
      Automate your workflows by triggering external services on form
      submissions.
    </p>
    <strong>Flexible usage</strong>
    <p>
      Choose between simple pricing tiers or flexible pay-per-use options that
      scale with your needs.
    </p>
    <strong>Lightweight & Fast</strong>
    <p>
      Built for speed and simplicity, Skeleton Forms won&apos;t slow you down.
    </p>
    <br />
    <!--------------------Pricing------------------------>
    <h2>Pricing</h2>
    <div class="pricing">
      <div class="plan">
        <strong>Basic</strong>
        <div style="display:flex; align-items: baseline;">
          <h2>$2</h2>
          <small>/per month</small>
        </div>
        <ul>
          <li>10 Forms</li>
          <li>1000 Responses</li>
          <li>1000 Webhook call</li>
        </ul>
      </div>
      <div class="plan">
        <strong>Pro</strong>
        <div style="display:flex; align-items: baseline;">
          <h2>$10</h2>
          <small>/per month</small>
        </div>
        <ul>
          <li>100 Forms</li>
          <li>10,000 Responses</li>
          <li>10,000 Webhook call</li>
        </ul>
      </div>
      <div class="plan">
        <strong>Flex</strong>
        <div style="display:flex; align-items: baseline;">
          <h2>$0</h2>
          <small>/per month</small>
        </div>
        <ul>
          <li>25&cent; / Form</li>
          <li>0.002&cent; / Response</li>
          <li>0.002&cent; / Webhook call</li>
        </ul>
      </div>
    </div>
    <div
      style="display: flex; align-items:center; justify-content:center; margin-top: 20px;"
    >
      <div>
        <button>Get Started</button>
      </div>
    </div>
  </div>
`;

// users ****************************************************************
const users = new Hono({ strict: false });
//list
// show
// create
// save
// edit
// update
// delete

// Responses ****************************************************************
const responses = new Hono({ strict: false });
//list
// show
// create
// save
// edit
// update
// delete

// Home ****************************************************************
web.get("/", (c) => {
  return c.html(NewHomePage);
});
web.get("/old", (c) => {
  return c.html(OldHomePage);
});
web.route("/forms", forms);
web.route("/webhooks", webhooks);
web.route("/users", users);
web.route("/responses", responses);
web.route("/respond", respond);
