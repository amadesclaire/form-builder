import { Hono } from "@hono/hono";
import { Webhook } from "../types.ts";
import { db } from "../db.ts";
import { html } from "@hono/hono/html";

// Webhooks ****************************************************************
const webhooks = new Hono({ strict: false });
//list
// show
// create
// save
// edit
// update
// delete

export default webhooks;
