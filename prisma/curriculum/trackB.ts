// Track B: AI Product & Automation Entrepreneurship
// Phase 3 "core-skills" (9 weeks, Aug 10 - Oct 9, 2026) and
// Phase 4 "build-studio" (6 weeks, Oct 12 - Nov 20, 2026).
// Seeded by prisma/seed.ts.

import type { PhaseContent, ProjectSeed } from "./types";

export const trackBContent: PhaseContent[] = [
  {
    phaseSlug: "core-skills",
    modules: [
      {
        title: "Automation Thinking & Process Mapping",
        description:
          "Learn to see businesses the way an automation consultant does: as a set of repeatable processes, some of which are quietly wasting hours every week. You will map real workflows, calculate what automation is worth, and produce documentation a paying client would sign off on.",
        lessons: [
          {
            title: "Spotting Automatable Work in Real Businesses",
            type: "ai",
            duration: "30 min",
            objectives: [
              "Identify the four signals that a task is a good automation candidate: repetitive, rule-based, digital, and frequent.",
              "List at least five common processes in Cameroonian SMEs that are usually done manually.",
              "Explain the difference between automating a task and automating a whole process.",
              "Use an AI assistant to brainstorm automation opportunities from a plain-language business description.",
            ],
            content: `Every business you walk past in Douala or Bamenda runs on repeated work. A boutique owner types the same "your order is ready" WhatsApp message forty times a week. A clinic receptionist in Buea calls patients one by one to remind them about appointments. A bakery copies phone orders into a paper book, then into Excel, then into a delivery list. None of this needs a human. All of it is billable work for you.

## The four signals

A task is a strong automation candidate when it is:

1. **Repetitive** - it happens the same way every time.
2. **Rule-based** - you could write the steps as "if this, then that" without judgment calls.
3. **Digital (or digitisable)** - the inputs and outputs live in WhatsApp, email, a spreadsheet, or a form, or could easily be moved there.
4. **Frequent** - daily or weekly, not twice a year.

A task that hits all four is money on the table. Chasing unpaid invoices hits all four. Negotiating a supplier discount hits none - leave that to the owner.

## Tasks vs. processes

Beginners automate tasks: "send this message automatically." Professionals automate processes: order received, confirmation sent, order logged in a sheet, delivery scheduled, follow-up review request sent two days later. The Douala bakery does not want a message-sender; it wants the whole order flow handled. Thinking in processes is what lets you charge 60,000-150,000 F for a setup instead of 5,000 F for a trick.

## Work with your AI assistant

Describe a business to your AI assistant in plain language - "a hair salon in Yaounde with two staff, bookings by phone call, payments in cash and MoMo" - and ask it to list every repetitive process and score each one against the four signals. The AI is excellent at generating candidates; your job is to judge which ones are real, because you understand the local context and it does not.

**Your task:** Pick one real business you know personally - a shop, salon, school, or church office. Write a list of at least eight repetitive tasks it performs, score each against the four signals (0-4), and mark your top two automation candidates with one sentence explaining why. Save this as a markdown file in a new GitHub repo called \`automation-casebook\` - you will build on it all phase.`,
            aiPrompt:
              "This lesson teaches students to spot automation candidates using four signals: repetitive, rule-based, digital, frequent. Use Cameroonian SME examples (boutiques, clinics, bakeries, salons) and steer the student toward thinking in whole processes rather than single tasks. If they share a business, help them brainstorm and score candidate tasks.",
          },
          {
            title: "Mapping a Process Step by Step",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Break a real business process into discrete steps with a trigger, actions, decisions, and an end state.",
              "Draw a simple process map using boxes, diamonds, and arrows (or text-based flow notation).",
              "Identify the actors, tools, and data involved at each step.",
              "Spot the failure points in a process where things get lost, delayed, or forgotten.",
            ],
            content: `You cannot automate what you cannot describe. Process mapping is the skill of turning "we just handle orders as they come" into a precise sequence a machine can follow. It is also the moment clients start taking you seriously, because most owners have never seen their own business drawn on paper.

## The anatomy of a process

Every process has:

- **A trigger** - the event that starts it. A WhatsApp message arrives. A patient books. Month-end comes.
- **Actions** - steps where something is done: send, record, calculate, print.
- **Decisions** - forks in the road: is payment confirmed? Is the item in stock?
- **An end state** - how you know it is finished: order delivered and logged.

## Map the Buea clinic

Take a clinic's appointment reminder flow. Trigger: appointment saved in the register. Actions: receptionist checks tomorrow's list each evening, finds each phone number, calls or texts each patient. Decision: did the patient confirm? If no answer, call again next morning. End state: every patient confirmed or flagged. Written out like this, you can immediately see the machine-shaped hole: a daily automated check of the list, an SMS or WhatsApp reminder, and a flag for non-responders. Only the flagged few need a human call.

## Notation that works

You do not need fancy software. Use boxes for actions, diamonds for decisions, arrows for flow - on paper, in draw.io, or even as an indented text list:

- Trigger: new order message
- Action: reply with confirmation + price
- Decision: MoMo payment received? Yes: add to delivery sheet. No: reminder after 2 hours.

## Find the failure points

As you map, mark where the process breaks in real life: the notebook that gets misplaced, the "I forgot to call back," the price quoted from memory. Failure points are your sales pitch - each one is a story of lost money that your automation prevents.

**Your task:** Map one of the two top candidates from your previous lesson as a full process: trigger, every action, every decision, end state, and at least two failure points. Ask your AI assistant to review the map and point out missing steps or unhandled cases, then revise it. Commit the final map (image or text flow) to your \`automation-casebook\` repo.`,
            aiPrompt:
              "This lesson covers process mapping: trigger, actions, decisions, end state, failure points. Use the Buea clinic appointment-reminder example and similar SME flows. When a student shares a process map, review it for missing steps, unhandled decision branches, and failure points, and encourage precise, machine-followable descriptions.",
          },
          {
            title: "Choosing What to Automate First (ROI)",
            type: "ai",
            duration: "30 min",
            objectives: [
              "Estimate the time and money a manual process costs a business per month.",
              "Compare automation candidates using a simple value-vs-effort matrix.",
              "Explain why the first automation for a client should be small, visible, and fast to deliver.",
              "Present an ROI estimate in FCFA that a non-technical owner immediately understands.",
            ],
            content: `Clients do not buy automation. They buy hours back and money recovered. Your job in this lesson is to learn the arithmetic that turns "this is annoying" into "this costs you 45,000 F a month."

## Cost out the manual work

Take the boutique chasing unpaid invoices. The owner spends roughly 30 minutes a day sending "please pay" messages and checking who has paid - about 10 hours a month. If her time is worth even 2,000 F an hour (it is worth more - she could be selling), that is 20,000 F a month in labour. Add the invoices that slip through because nobody chased them: two forgotten invoices of 15,000 F each and the real monthly cost passes 50,000 F. Suddenly your 80,000 F setup fee pays for itself in under two months. Write these numbers down; they close deals.

## Value vs. effort

Score each candidate process on two axes:

- **Value**: hours saved plus money recovered per month, in FCFA.
- **Effort**: how hard it is for you to build - number of tools, messy data, edge cases.

High value, low effort wins. The bakery's order-confirmation flow (one trigger, two messages, one sheet) beats a full inventory system every time, even if the inventory system sounds more impressive.

## Start small and visible

Your first automation for any client should be live within one to two weeks and produce something the owner sees working - a message sent, a row appearing in a sheet. Visible wins build the trust that funds bigger projects. Consultants who start with the big system spend three months building, the client loses faith, and nobody gets paid.

## Let AI do the arithmetic with you

Give your AI assistant the process details - frequency, minutes per occurrence, error cost - and ask it to build the monthly-cost estimate and a one-paragraph ROI pitch. Then sanity-check the numbers against local reality: Cameroonian labour costs, MoMo fees, actual invoice sizes.

**Your task:** For both of your top candidate processes, produce an ROI one-pager: monthly cost of the manual process in FCFA, estimated setup price you would charge (use the 60,000-150,000 F range as a guide), and payback period. Declare a winner and justify it in three sentences. Add it to your repo.`,
            aiPrompt:
              "This lesson teaches ROI-based prioritisation of automations: costing manual work in FCFA, a value-vs-effort matrix, and starting with small visible wins. Help students calculate monthly cost estimates and payback periods with realistic Cameroonian figures, and challenge inflated or vague numbers.",
          },
          {
            title: "Documenting a Workflow for a Client",
            type: "task",
            duration: "45 min",
            objectives: [
              "Write a workflow document a non-technical business owner can read and approve.",
              "Structure documentation as: current process, proposed automation, tools used, what changes for staff.",
              "Use AI to draft the document, then edit it for accuracy and local context.",
              "Package the document professionally as a PDF with your name and contact details.",
            ],
            content: `The document you hand a client before building anything is called a workflow proposal, and it does three jobs at once: it proves you understood their business, it defines exactly what you will deliver (protecting you from endless "can you also add..."), and it justifies your price. Automators who skip this step end up in disputes; automators who nail it get referrals.

## The four-section structure

1. **Current process** - your process map in plain words. "Today, when an order arrives on WhatsApp, Mme Ngo writes it in the blue notebook..." The owner should nod at every sentence. If they correct you, good - better now than after you build.
2. **Proposed automation** - the new flow, step by step, with the human touchpoints clearly marked. Never pretend the human disappears; say exactly what staff still do (approve unusual orders, handle complaints).
3. **Tools and access needed** - name the tools (n8n, Google Sheets, the WhatsApp provider) and list what you need from the client: the Gmail account, the price list, admin access. Missing-access delays are the number one reason projects stall.
4. **What changes day to day** - one short table: before vs. after, in staff time and owner time.

Close with scope ("this covers orders via WhatsApp only; Instagram DMs are a future phase"), the price, and a delivery date.

## Drafting with AI, finishing like a professional

Paste your process map and ROI numbers into your AI assistant and ask for a first draft in this four-section structure, in clear simple French or English depending on your client. Then edit ruthlessly: cut jargon, fix any invented details, and make sure every tool named is one you actually plan to use. AI drafts the skeleton in two minutes; your local knowledge and honesty are what make it trustworthy.

**Your task:** Produce a complete two-to-three-page workflow proposal PDF for your winning process from the ROI lesson, following the four-section structure, with scope, a price in FCFA, and a delivery date. Have your AI assistant critique it as if it were a skeptical business owner, revise once, and commit both the PDF and the markdown source to your \`automation-casebook\` repo.`,
            aiPrompt:
              "This is a build lesson: the student writes a client-facing workflow proposal with four sections (current process, proposed automation, tools and access, day-to-day changes) plus scope, FCFA price, and delivery date. Help them draft and then critique the document as a skeptical Cameroonian business owner would - flag jargon, vague scope, and missing access requirements.",
          },
        ],
      },
      {
        title: "n8n & Workflow Automation",
        description:
          "n8n is your power tool: an open-source automation platform you can run cheaply and bill for confidently. You will master nodes, triggers, and credentials, connect the apps Cameroonian SMEs actually use, transform data between steps, and build workflows that fail gracefully instead of silently.",
        lessons: [
          {
            title: "n8n Fundamentals: Nodes, Triggers, Credentials",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Set up an n8n instance (cloud trial or local install) and navigate the editor.",
              "Explain what nodes, triggers, and executions are and how data flows between nodes.",
              "Store credentials securely in n8n instead of pasting keys into workflows.",
              "Build and manually execute a first two-node workflow.",
            ],
            content: `n8n (pronounced "n-eight-n") is a visual automation platform: you drag nodes onto a canvas, wire them together, and data flows left to right. It is open source, which matters for your business model - you can self-host it for a client for a few thousand francs a month in server costs and charge a healthy maintenance fee, instead of pushing them onto dollar-priced SaaS subscriptions that hurt in FCFA.

## The three building blocks

- **Trigger nodes** start a workflow: on a schedule ("every day at 18:00"), when a webhook receives data, or when something happens in an app (new row in Google Sheets, new email).
- **Regular nodes** do the work: send a Gmail message, append a Sheets row, call an API, run a bit of code.
- **Credentials** are stored logins and API keys, saved once in n8n's credential store and referenced by nodes. Never paste a key directly into a node parameter - when you export or screen-share a workflow, credentials stay safe; pasted keys leak.

Each run of a workflow is an **execution**, and n8n keeps a log of them - your first debugging tool. Click any past execution to see exactly what data entered and left every node.

## Data is items

n8n passes data between nodes as a list of items, each item being a JSON object. If your Sheets node reads ten order rows, the next node receives ten items and (usually) runs once per item. Internalise this now: "how many items are flowing here?" answers half of all n8n confusion.

## Set up and first workflow

Create an n8n cloud trial or install locally with Docker. Build the classic starter: a Schedule Trigger set to every minute, wired to a Gmail (or plain SMTP) node that emails you "n8n is alive." Execute it manually first, inspect the execution data, then activate it and watch it run on its own. Deactivate it before it fills your inbox.

**Your task:** Set up your n8n instance and build a workflow with a Schedule Trigger that sends you one email each morning at 07:00 containing a motivational sentence. Store your email credentials properly in the credential store. Take a screenshot of the canvas and one successful execution log, and add both to your \`automation-casebook\` repo with a short setup note.`,
            aiPrompt:
              "This lesson introduces n8n: trigger nodes vs regular nodes, the credential store, executions, and data flowing as JSON items. Help students with setup issues (cloud trial or Docker), explain the items model when they are confused about node output, and insist credentials go in the credential store, never in node parameters.",
          },
          {
            title: "Connecting Apps: Google Sheets, Gmail, WhatsApp",
            type: "ai",
            duration: "45 min",
            objectives: [
              "Connect n8n to Google Sheets and Gmail with OAuth credentials.",
              "Explain how WhatsApp automation works through official API providers (Meta Cloud API, 360dialog, Twilio) and why unofficial tools risk bans.",
              "Build a workflow that reads rows from a sheet and sends a personalised message per row.",
              "Choose the right app connections for a typical Cameroonian SME stack.",
            ],
            content: `The Cameroonian SME stack is beautifully simple: WhatsApp for customers, a phone full of contacts, maybe a Google Sheet, maybe a Gmail account. Master connecting these three and you can automate most small businesses in the country.

## Google Sheets and Gmail

Both connect via OAuth: n8n redirects you to Google, you approve access, and the credential is saved. The Sheets node can read rows, append rows, and update rows - treat a well-structured sheet (one header row, one record per row) as the client's database. The Gmail node sends, searches, and labels mail. Practise the most common pattern in all of SME automation: **read rows from a sheet, act on each row**. Remember items: ten rows in means the Gmail node fires ten times.

## WhatsApp: the honest version

There is no free official "WhatsApp node for your personal number." Real WhatsApp automation goes through the **WhatsApp Business Platform (Cloud API)**, accessed directly from Meta or via providers like 360dialog or Twilio. You register a business number, get an API key, and pay per conversation (of the order of tens of francs each - build it into client pricing). Unofficial gateways that hijack WhatsApp Web are cheaper but get numbers banned, and a client whose business number gets banned will never forgive you. Quote the official route; it is a professional advantage, not a burden. In n8n, the WhatsApp Business Cloud node or a plain HTTP Request node to the provider's API both work.

## The bakery order confirmations

Picture the Douala bakery logging orders in a sheet: name, phone, item, pickup time. Workflow: Schedule Trigger at 06:30, Sheets node reads today's unconfirmed rows, a message node sends each customer "Bonjour {name}, votre commande de {item} sera prete a {time}", then the Sheets node marks the row confirmed. That is a sellable product.

**Your task:** Build a workflow that reads at least five rows (name, phone or email, custom detail) from a Google Sheet and sends each person a personalised message via Gmail (use email as your WhatsApp stand-in if you have no provider account yet), then writes "SENT" back to a status column. Export the workflow JSON to your repo.`,
            aiPrompt:
              "This lesson covers connecting n8n to Google Sheets, Gmail, and WhatsApp via official API providers (Meta Cloud API, 360dialog, Twilio). Warn firmly against unofficial WhatsApp Web gateways because of ban risk. Help students debug OAuth setup and the read-rows-act-per-row pattern, using the Douala bakery order-confirmation example.",
          },
          {
            title: "Data Transformation Between Steps",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Use n8n expressions to reference and reshape data from previous nodes.",
              "Apply Edit Fields (Set), IF, Switch, and Merge nodes to route and restructure items.",
              "Clean messy real-world data: phone number formats, date formats, empty cells.",
              "Use an AI assistant to write and debug n8n expressions and small Code-node snippets.",
            ],
            content: `Real client data is messy. The boutique's sheet has phone numbers as "6 77 12 34 56", "+237677123456", and "677123456" in the same column. Dates arrive as "3/9/26" meaning who-knows-which month. The gap between a demo workflow and a paid workflow is almost entirely data transformation.

## Expressions: reaching into the data

Anywhere in n8n you can switch a field to expression mode and pull values from earlier nodes, like \`{{ $json.name }}\` for a field on the current item. Expressions also transform: trim spaces, change case, slice strings, do arithmetic. You do not need to memorise the syntax - you need to know it exists and read what it returns in the preview.

## The transformation toolkit

- **Edit Fields (Set)** - build a clean, renamed version of your data. Make it a habit: right after any messy input, add a Set node that outputs exactly the fields the rest of the workflow needs.
- **IF / Switch** - route items down different branches: paid vs unpaid, French vs English customer.
- **Merge** - bring branches or two data sources back together, such as matching payments against invoices by reference number.
- **Code node** - a few lines of JavaScript when expressions get awkward, like normalising every phone variant to \`+2376XXXXXXXX\`.

## The clinic's messy register

The Buea clinic exports appointments where some rows have no phone number and dates are inconsistent. Pipeline: Sheets read, IF node drops rows without phones (routing them to a "needs attention" sheet instead of silently discarding them - the receptionist must know), Code node normalises phones to international format required by SMS and WhatsApp APIs, Set node shapes the final reminder fields. Never silently drop data; always route rejects somewhere visible.

## AI is your expression writer

Expressions and Code-node JavaScript are where your AI assistant shines. Paste a sample item and say "write an n8n expression that extracts the first name" or "normalise these Cameroonian phone formats to +237 form in a Code node." Always test on real sample data - AI-written code is a draft, not a guarantee.

**Your task:** Create a deliberately messy Google Sheet of ten fake customers (mixed phone formats, some blanks, inconsistent name casing). Build a workflow that cleans it: normalised +237 phones, trimmed and capitalised names, invalid rows routed to a second "review" sheet. Export the workflow JSON and both sheets' final state to your repo.`,
            aiPrompt:
              "This lesson covers n8n data transformation: expressions, Set/IF/Switch/Merge nodes, Code-node JavaScript, and cleaning messy SME data such as mixed Cameroonian phone formats and inconsistent dates. Write and debug expressions and snippets with the student, insist on testing against sample items, and reinforce routing invalid rows to a visible review path instead of dropping them.",
          },
          {
            title: "Error Handling & Monitoring Workflows",
            type: "task",
            duration: "45 min",
            objectives: [
              "Explain why unmonitored automations are a business risk, not a convenience.",
              "Configure error workflows in n8n that alert you when a client's automation fails.",
              "Apply retry settings and fallback branches for unreliable steps like API calls.",
              "Define a simple monitoring routine you can sell as a monthly maintenance service.",
            ],
            content: `Here is the nightmare: the boutique's invoice-chase workflow silently dies on a Tuesday because Google OAuth expired. For three weeks nobody chases invoices, the owner assumes the robot is working, and 200,000 F goes uncollected. When she finds out, you do not lose a client - you lose every referral she would ever have given you. Error handling is not a technical nicety; it is your reputation.

## Assume failure

Every external step will eventually fail: APIs time out, credentials expire, someone renames a sheet column, a phone number is invalid. Professional workflows are built on that assumption.

## The n8n toolkit

- **Error workflow**: in workflow settings, attach a separate error workflow that runs whenever this one fails. Make it message YOU (email, Telegram, WhatsApp) with the workflow name and error. One error workflow can watch all your client automations - this is the heart of your monitoring service.
- **Retries**: on flaky nodes like HTTP requests, enable retry-on-fail with a wait between attempts. Most network hiccups vanish on retry two.
- **Error branches**: nodes can be set to continue on error and expose an error output, letting you route failures to a fallback - log the failed item to an "errors" sheet, notify a human - while the rest of the items keep flowing. One bad phone number must not kill the other forty-nine reminders.
- **Execution history**: check it weekly for every client workflow. Five minutes of scanning catches slow rot like rising failure rates.

## Sell the monitoring

This is a recurring-revenue product. "Setup 90,000 F, then 15,000 F per month: I monitor the workflow, fix failures within 24 hours, and send you a monthly report." Owners happily pay for sleep. Ten clients on maintenance is 150,000 F a month before you build anything new.

**Your task:** Take your sheet-to-message workflow from the previous lesson and harden it: add an error workflow that alerts you on failure, enable retries on the sending node, and add an error branch that logs failed items to an "errors" sheet without stopping the batch. Force a failure (break a credential or use an invalid address) and screenshot the alert arriving. Commit the workflow JSON, the screenshot, and a five-line monitoring routine you would sell as a monthly service.`,
            aiPrompt:
              "This is a build lesson on n8n error handling: error workflows, retry-on-fail, continue-on-error branches routing failures to an errors sheet, and execution-history review. Help students force and diagnose test failures, and steer them toward framing monitoring as a monthly paid maintenance service (e.g. around 15,000 F/month per client).",
          },
        ],
      },
      {
        title: "APIs & Webhooks for Automators",
        description:
          "APIs are how software talks to software, and automators who can read API docs and wire up webhooks stop being limited by whatever nodes exist. You will learn requests, JSON, and auth from scratch, call any API from n8n, receive events with webhooks, and test everything like a professional with Postman, curl, and an AI copilot.",
        lessons: [
          {
            title: "What APIs Are: Requests, JSON, Auth Keys",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Explain what an API is using the request-response model, without jargon.",
              "Read and write basic JSON confidently.",
              "Distinguish GET and POST requests and know when each is used.",
              "Describe what an API key does and how to handle keys safely.",
            ],
            content: `Every n8n node you have used is a costume over an API call. Take the costume off and you can talk to any service on the internet - including the MoMo APIs, SMS gateways, and local services that will never get an official n8n node.

## The request-response model

An API (Application Programming Interface) is a service's counter window for software. Your workflow (the client) sends a **request** to a **URL** (the endpoint); the service sends back a **response**. Like ordering at a counter: you state what you want in an agreed format, you get back the goods or a clear "no."

A request has:
- a **method** - \`GET\` means "give me data" (fetch today's exchange rate), \`POST\` means "here is data, do something" (send this SMS);
- a **URL** - e.g. \`https://api.provider.com/v1/messages\`;
- **headers** - metadata, including your auth key;
- often a **body** - the data you are sending, almost always in JSON.

The response comes with a **status code**: 200 means success, 401 means bad credentials, 404 means wrong URL, 500 means the server broke. Learn these four and you can diagnose most failures.

## JSON in five minutes

JSON is just labelled data in braces:

\`{ "customer": "Amina", "amount": 15000, "paid": false }\`

Curly braces hold key-value pairs; square brackets hold lists; strings wear double quotes; numbers and true/false do not. Every API you touch speaks it, and every n8n item you have inspected already was it.

## Auth keys

An API key is a long secret string proving the request is yours - it is a password, and it is often connected to your money (SMS credits, LLM usage). Rules: store keys in n8n credentials or environment variables, never in the workflow itself, never in a GitHub repo, never in a screenshot. Leaked keys get abused within hours.

## AI as your translator

Paste any confusing API response or documentation snippet into your AI assistant and ask "explain this and show me the exact request I need." Reading docs with an AI beside you is how modern automators learn a new API in an afternoon.

**Your task:** Handwrite (in a markdown file) the JSON body and method for two imaginary requests: sending an appointment-reminder SMS for the Buea clinic, and fetching the list of unpaid invoices for the boutique. Then ask your AI assistant to critique your JSON syntax and fix any errors. Commit the corrected file to your repo.`,
            aiPrompt:
              "This lesson introduces APIs from zero: request-response, GET vs POST, JSON syntax, status codes (200/401/404/500), and API key safety. Use SME examples like sending a clinic reminder SMS or fetching unpaid invoices. Correct students' JSON gently and precisely, and reinforce never committing or screenshotting keys.",
          },
          {
            title: "Calling APIs from Automation Tools",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Configure the n8n HTTP Request node: method, URL, headers, query parameters, and JSON body.",
              "Authenticate API calls using header keys and n8n's generic credential types.",
              "Parse an API's JSON response and use its fields in later nodes.",
              "Handle pagination and rate limits at a practical level.",
            ],
            content: `The HTTP Request node is the skeleton key of n8n. Any service with an API - an SMS gateway in Douala, a currency-rate service, a payment provider - becomes usable the moment you can fill in five fields: method, URL, headers, query parameters, body.

## Building a call

Say you are wiring up an SMS provider for the clinic reminders. The docs say: POST to \`/v1/sms\`, key in a header, JSON body with \`to\` and \`message\`. In the HTTP Request node: method POST, the URL, authentication set to a generic header-auth credential holding your key (credential store, always), and a JSON body where \`to\` and \`message\` come from expressions referencing the cleaned data of earlier nodes. Run it once with your own phone number. Getting your own test SMS is a rite of passage.

## Reading the response

The response lands as JSON items like any node output. If the provider returns \`{ "id": "msg_123", "status": "queued" }\`, a later node can log that id to the client's sheet - now you have delivery tracking for free. When a response nests data deeply, pin a real execution and click through the output tree instead of guessing paths.

## Pagination and rate limits

Two realities of production APIs. **Pagination**: list endpoints return data in pages (50 invoices at a time) with a "next page" marker; the HTTP Request node has built-in pagination settings, and your AI assistant can help configure them for a specific API's style. **Rate limits**: providers cap requests per second; blast 300 SMS in one loop and you will see status 429 (too many requests). The fix is n8n's batching options or a small Wait node between calls. Respecting limits is also good manners toward services you bill clients on.

## Docs-to-node with AI

The professional loop: open the API docs, copy the relevant endpoint section into your AI assistant, and ask "give me the exact n8n HTTP Request node settings for this." Verify against one manual test call. This turns a day of trial and error into twenty minutes.

**Your task:** Pick any free public API (a currency-rate, weather, or country-data API works well). Build a workflow that calls it with the HTTP Request node, extracts at least two fields from the JSON response, and writes them into a Google Sheet with a timestamp. Commit the workflow JSON and a screenshot of the populated sheet.`,
            aiPrompt:
              "This lesson covers the n8n HTTP Request node: configuring method/URL/headers/body, generic header-auth credentials, parsing JSON responses, pagination, and rate limits (429s, Wait nodes, batching). Help students translate real API documentation into exact node settings and debug failed calls by status code.",
          },
          {
            title: "Webhooks & Event-Driven Flows",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Explain the difference between polling and webhooks, and when each is appropriate.",
              "Create an n8n Webhook trigger and understand test vs production webhook URLs.",
              "Receive and process incoming data from a form or external service in real time.",
              "Respond to a webhook call so the sender knows it was received.",
            ],
            content: `So far your workflows have either run on a schedule or gone out to fetch data - that is **polling**: "anything new? anything new?" every few minutes. Webhooks flip the direction: the other service calls YOU the instant something happens. A customer submits an order form and your workflow fires within a second, not at the next 15-minute check.

## Why it matters commercially

Speed is a feature clients feel. The Douala bakery's customer submits an order at 08:03 and gets the WhatsApp confirmation at 08:03 - that feels like a serious business. A payment confirmation processed instantly means the delivery moto leaves ten minutes earlier. Polling wastes executions checking nothing (which costs money on hosted plans); webhooks run only when there is real work.

## The Webhook trigger in n8n

Add a Webhook node and n8n mints a unique URL. Anything that sends an HTTP request to that URL starts your workflow, with the request's data as the first item. Two URLs matter: the **test URL** works while you are in the editor listening (perfect for development), the **production URL** works when the workflow is activated. Forgetting to activate the workflow and wondering why production calls vanish is a rite of passage; do it once and move on.

The webhook's data arrives however the sender formats it - a form service sends field names, a payment provider sends its own event shape. First step after any new webhook: send one real test event, pin the execution, and study the structure before building the rest.

## Responding

Senders expect an answer. By default n8n returns a simple success response; with a Respond to Webhook node you control it - useful when the caller shows your response to a user, or when a payment provider requires a specific acknowledgement or it keeps retrying the same event (and your workflow sends the same WhatsApp message five times).

## The pattern to internalise

Form or event, then webhook, then validate the data, then act, then respond. This event-driven skeleton underlies order bots, payment flows, and every support bot you will build in the next module.

**Your task:** Create a Google Form or Tally form for bakery orders (name, phone, item, pickup time) and connect its submissions to an n8n Webhook trigger (native integration or the form tool's webhook feature). On each submission: append the order to a sheet and send yourself a notification message. Submit two test orders, and commit the workflow JSON plus a screenshot of both executions.`,
            aiPrompt:
              "This lesson covers webhooks vs polling and n8n's Webhook trigger: test vs production URLs, inspecting incoming payload structure, and responding with Respond to Webhook (including why payment providers retry without a proper acknowledgement). Help students connect a form to a webhook and debug 'workflow not firing' issues - the usual cause is using the test URL without listening or forgetting to activate.",
          },
          {
            title: "Testing with Postman, curl & AI Help",
            type: "task",
            duration: "45 min",
            objectives: [
              "Send test requests to any API or webhook using Postman and curl.",
              "Simulate external services calling your webhooks before the real integration exists.",
              "Debug failing integrations methodically using status codes and response bodies.",
              "Use an AI assistant to generate test requests and interpret confusing errors.",
            ],
            content: `Professionals do not test integrations by clicking around the real app and hoping. They fire precise, repeatable test requests with **curl** (command line) or **Postman** (visual), see exactly what comes back, and only then wire things into n8n. This lesson makes you dangerous with both.

## curl: one line, full control

You already know the command line from Phase 2. A curl call to your bakery webhook looks like:

\`curl -X POST https://your-n8n.app/webhook/orders -H "Content-Type: application/json" -d '{"name":"Amina","item":"10 croissants","phone":"+237677123456"}'\`

Method, URL, headers, body - the same anatomy you have been learning, now in one line you can rerun forever. This is how you test your webhook workflow fifty times without submitting fifty real forms.

## Postman: the visual lab

Postman gives you the same power with a UI: build a request, save it, organise client integrations into collections. When you take on the boutique as a client, a Postman collection with "create invoice," "send reminder," and "check payment status" requests becomes part of your professional toolkit - and part of the handover documentation you charge for.

## The debugging ritual

When an integration fails, resist random changes. Work the ritual:

1. Read the **status code**: 401 or 403 means auth (wrong or missing key), 404 means wrong URL, 400 means the service rejects your data shape, 429 means slow down, 500 means their side broke.
2. Read the **response body** - most APIs tell you what is wrong in plain text.
3. Reproduce the exact call in curl or Postman, outside n8n, to isolate whether the problem is your request or your workflow.
4. Change **one thing** and retest.

## AI in the loop

Your AI assistant writes curl commands from a description ("POST this JSON to this URL with a bearer token"), generates realistic test payloads (ten fake orders with edge cases: missing phone, French accents, an absurd quantity), and decodes cryptic error bodies. Paste the full request and full response - never a paraphrase - and ask what is wrong.

**Your task:** Test your bakery-order webhook from the previous lesson without using the form: send five curl or Postman requests including at least two broken ones (missing field, wrong data type) and confirm your workflow handles good orders and does not crash on bad ones - add validation if it does. Commit the test commands or exported Postman collection, plus a short log of each request and result.`,
            aiPrompt:
              "This is a build lesson on testing APIs and webhooks with curl and Postman: crafting requests, simulating form submissions, and the debugging ritual (status code, response body, reproduce outside n8n, change one thing). Generate test payloads with edge cases for the student and help interpret error responses - ask them to paste the exact request and response.",
          },
        ],
      },
      {
        title: "AI Workflows & Agents",
        description:
          "This is where automation becomes intelligent - and where your rates double. You will call LLM APIs inside n8n to summarise, classify, and draft; build an AI responder for email and WhatsApp; ground a business FAQ bot in real documents; and, crucially, learn the guardrails and cost controls that make clients trust an AI touching their customers.",
        lessons: [
          {
            title: "Using LLM APIs Inside Automations",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Call an LLM API from n8n to summarise, classify, and draft text inside a workflow.",
              "Write system prompts that produce reliable, structured output (JSON mode / strict formats).",
              "Choose appropriate model sizes for automation tasks and estimate per-call costs.",
              "Identify the three workhorse patterns: summarise, classify, draft.",
            ],
            content: `Everything you learned about prompting in Phase 2 now becomes a component inside a machine. An LLM call in a workflow is just another API call - request in, JSON out - but it handles the messy human parts no IF node ever could: reading an angry customer message, extracting an order from free-form text, drafting a polite reply in the right language.

## The three workhorse patterns

Ninety percent of profitable AI automation is one of these:

- **Summarise** - long input, short output. Every evening, condense the day's forty WhatsApp order messages into a five-line owner briefing.
- **Classify** - text in, label out. Is this incoming message an ORDER, a QUESTION, a COMPLAINT, or SPAM? Route each down a different n8n branch.
- **Draft** - context in, human-quality text out. Given an unpaid invoice's details, draft a firm-but-warm reminder in French, personalised, ready to send (or to approve).

## Prompting for machines, not people

Inside a workflow, nobody rereads the output - a node consumes it. So your prompt must force a **fixed format**. For classification: "Respond with exactly one word from this list: ORDER, QUESTION, COMPLAINT, SPAM. No other text." For extraction, demand JSON with named fields and use the API's structured-output mode where available. Then test with twenty varied real-ish messages, including pidgin, French/English mixes, and voice-note-style fragments, because that is what Cameroonian customers actually send.

## Models and money

Small, fast models are almost always right for classification and extraction - they cost a fraction of a franc per message. Save bigger models for drafting where tone matters. Do the arithmetic per client: 500 messages a month through a small model might cost the client under 1,000 F while saving twenty staff-hours. That ratio is your sales pitch, so calculate it honestly, including your margin.

In n8n, use the native LLM/AI nodes or a plain HTTP Request node to the provider's API - you already know both roads.

**Your task:** Build a classification workflow: feed it ten sample customer messages for the boutique (mix French, English, an order, a complaint, spam) from a sheet, have an LLM node classify each into ORDER / QUESTION / COMPLAINT / SPAM, and write the label back to the sheet. Tune the prompt until all ten are correct. Commit the workflow JSON, your final prompt, and the labelled sheet.`,
            aiPrompt:
              "This lesson covers calling LLM APIs inside n8n for the summarise/classify/draft patterns, prompting for fixed machine-readable output (single-label answers, strict JSON), choosing small models for classification, and per-client cost arithmetic in FCFA. Help students tighten prompts until output is deterministic enough to route in a workflow, and test with mixed French/English/pidgin messages.",
          },
          {
            title: "Building an AI Email & WhatsApp Responder",
            type: "ai",
            duration: "45 min",
            objectives: [
              "Design a responder flow: receive, classify, generate reply, send or escalate.",
              "Give the LLM the business context it needs (hours, prices, tone) via the system prompt.",
              "Implement human handoff for messages the AI should not answer.",
              "Handle multilingual customers (French, English, pidgin) gracefully.",
            ],
            content: `Now assemble the pieces into the product SMEs ask for by name: "can the robot answer my WhatsApp?" A responder is a webhook trigger, a classifier, a drafting call, and a send - plus the judgment about when NOT to answer, which is what separates a professional build from a toy.

## The responder skeleton

1. **Receive** - webhook fires on incoming email or WhatsApp message (via your API provider).
2. **Classify** - your ORDER / QUESTION / COMPLAINT / SPAM classifier from last lesson routes the message.
3. **Generate** - for answerable categories, an LLM node drafts the reply using a system prompt loaded with business facts.
4. **Send or escalate** - send the reply, or hand off to a human.

## Context is the product

A generic LLM knows nothing about the Buea clinic. Your system prompt carries the business: opening hours, services and prices, location and landmarks, payment options (MoMo number included), tone ("warm, brief, always in the customer's language"), and hard rules ("never give medical advice; for anything about symptoms or medication, hand off to staff"). Building and maintaining this context block IS the deliverable - it is why the client pays you and not a generic chatbot subscription.

## Handoff is a feature, not a failure

Route COMPLAINTs and anything the classifier is unsure about straight to the owner with a summary: "Complaint from +2376..., about a late delivery, full message attached." The AI answering 70% of messages instantly and escalating the rest cleanly is a system owners trust. An AI that answers 100% including the ones it should not is a lawsuit in waiting. Add a dedicated OTHER/UNSURE label to your classifier for exactly this.

## Language reality

Instruct the model to reply in the language of the incoming message and test all three realities: French, English, and pidgin-flavoured messages ("abeg how much for your bread dem"). The reply to that last one should be warm and simple - if it comes back sounding like a Paris bank letter, tune the tone instructions.

**Your task:** Build a working responder for a fictional business (pick the bakery or clinic): webhook in (test with curl), classify, auto-answer QUESTIONs from a context block you write with at least eight business facts, escalate COMPLAINTs to your own email/WhatsApp with a summary. Demonstrate one auto-answered French question, one English, and one escalated complaint. Commit workflow JSON, context block, and screenshots of all three.`,
            aiPrompt:
              "This lesson assembles an AI responder: webhook in, classify, draft from a business-context system prompt, send or escalate. Emphasise human handoff for complaints and unsure cases as a trust feature, business context blocks (hours, prices, MoMo number, tone, hard rules like no medical advice), and replying in the customer's language including pidgin. Help students write and refine the context block and test all three language cases.",
          },
          {
            title: "Retrieval & Knowledge Bases for FAQ Bots",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Explain why stuffing everything into one prompt breaks down and what retrieval (RAG) solves.",
              "Structure a business knowledge base from real SME documents (price lists, policies, FAQs).",
              "Build a retrieval-backed answer flow in n8n using a vector store or a simpler lookup approach.",
              "Keep the bot honest: answer only from the knowledge base and admit when it does not know.",
            ],
            content: `Your responder's context block works beautifully at eight facts. Now the client hands you a 40-item price list, a delivery-zone table for all of Douala's quartiers, a returns policy, and a promotions calendar that changes monthly. Pasting all of it into every call is expensive, slow, and - worse - the model starts blending facts. The fix is **retrieval**: store the knowledge outside the prompt, and for each question, fetch only the few relevant pieces and hand exactly those to the model.

## RAG in plain terms

Retrieval-Augmented Generation is a three-step dance: the knowledge is split into chunks and stored; when a question arrives, the system finds the chunks most similar in meaning to the question (this is what embeddings and vector stores do - matching by meaning, so "combien pour livraison a Bonaberi?" finds the delivery-zone chunk even though no words match exactly); the model then answers using only those chunks. n8n's AI nodes include vector store and embedding components that make this a wiring job rather than a research project - and for a small structured dataset like a price list, an honest Google Sheets lookup feeding the prompt can beat a vector store. Choose the simplest thing that works.

## The knowledge base is a deliverable

Real SME knowledge lives in the owner's head, old WhatsApp broadcasts, and a battered notebook. Your first job is extraction: interview the owner, write clean question-and-answer pairs and structured tables, get them approved. This document has value beyond the bot - owners are often shocked to finally have their prices and policies written down. Version it, date it, and include "knowledge base updates" in your monthly maintenance fee, because prices change and a bot quoting last month's price destroys trust instantly.

## Honesty rules

The system prompt must say: answer ONLY from the provided information; if the answer is not there, say you will check with the team and escalate. Test this by asking questions the knowledge base cannot answer - an FAQ bot that invents a delivery price is worse than no bot.

**Your task:** Write a 20-item knowledge base for your fictional business (prices, delivery zones, hours, policies) as clean Q&A and tables. Wire it into your responder via n8n's vector store nodes or a sheet-lookup approach. Test with five answerable questions and three unanswerable ones - all three must produce an honest "let me check" plus escalation, not an invention. Commit the knowledge base, workflow JSON, and the eight test results.`,
            aiPrompt:
              "This lesson covers retrieval/RAG for SME FAQ bots: why big context blocks break, chunking and meaning-based retrieval in plain terms, n8n vector store nodes vs simpler sheet lookups, treating the knowledge base document as a paid deliverable with update cycles, and honesty rules (answer only from provided info, escalate unknowns). Help students structure Q&A knowledge bases and design tests including unanswerable questions.",
          },
          {
            title: "Guardrails, Review Loops & Cost Control",
            type: "task",
            duration: "45 min",
            objectives: [
              "Add approval steps so humans review AI output before it reaches customers where stakes are high.",
              "Implement guardrails: forbidden topics, output length limits, and escalation triggers.",
              "Monitor and cap LLM spending per workflow and per client.",
              "Write an honest one-page 'how the AI behaves' note for a client.",
            ],
            content: `An AI system touching a business's customers can damage that business in one bad message. This lesson is what lets you sell AI automation to a skeptical owner and sleep well after deployment. It is also, quietly, a premium: consultants who can explain their guardrails win deals against cheaper builders who cannot.

## Draft-first: the review loop

For high-stakes output - invoice reminders with amounts, complaint responses, anything medical or legal-adjacent - do not auto-send. Instead: AI drafts, human approves. In n8n this is simple to wire: the draft goes to the owner on WhatsApp or email with Approve/Edit options (a reply keyword, a Gmail label, an approval link), and only approval triggers the send. The boutique's payment reminders should run draft-first for the first month; once the owner has approved a hundred drafts with barely an edit, graduate routine categories to auto-send. Trust is earned in stages, and offering this progression is excellent consulting.

## Guardrails

Layer them:

- **Prompt rules** - forbidden topics (no medical advice, no promises of refunds beyond policy, no discounts unless listed), maximum reply length, always the customer's language.
- **Workflow checks** - after the LLM node, cheap deterministic checks: reply too long? Contains a price not present in the knowledge base? Route to human instead of sending.
- **Escalation triggers** - keywords like "avocat," "lawyer," "hopital," or an angry-tone classification skip the AI entirely.

## Cost control

LLM costs are small per call and surprising in aggregate. Protect yourself and the client: log every call's token usage to a per-client sheet inside the workflow itself; set a monthly budget alert (an n8n schedule that sums the sheet and warns you at 80%); cap runaway loops with sane limits. Then price with margin: if a client's usage costs you roughly 3,000 F a month, the 15,000 F maintenance fee covers it comfortably - never resell raw API costs without margin.

**Your task:** Harden your responder: add a draft-first approval loop for COMPLAINT replies, at least three guardrails (one prompt rule, one workflow check, one escalation trigger), and a cost-log sheet recording every LLM call. Then write a one-page "How the AI behaves" note for the client: what it answers alone, what waits for approval, what it never does, monthly cost estimate in FCFA. Commit workflow JSON, the note, and a screenshot of the approval flow working.`,
            aiPrompt:
              "This is a build lesson on making AI automations trustworthy: draft-first approval loops (graduating to auto-send as trust builds), layered guardrails (prompt rules, deterministic workflow checks, escalation keywords), per-client cost logging with budget alerts, and a plain-language client note on AI behaviour. Help students wire approval steps in n8n and price maintenance with margin over API costs.",
          },
        ],
      },
      {
        title: "No-Code Product Building",
        description:
          "Automations serve one client at a time; products serve many. In this module you build a real app in a no-code tool, wire it to your automations, understand how money actually moves in African tech (Mobile Money first), and launch to real users - the complete loop you will repeat in the Build Studio and for the rest of your career.",
        lessons: [
          {
            title: "Building an App in a No-Code Tool",
            type: "ai",
            duration: "45 min",
            objectives: [
              "Choose an appropriate no-code stack (e.g. Softr/Glide/Bubble over Airtable or Sheets) for a small business app.",
              "Model the app's data as tables before touching the interface.",
              "Build core screens: forms for input, lists and detail views for output, basic logic for state.",
              "Use AI to plan the data model and generate realistic test content.",
            ],
            content: `No-code tools let you ship real software - forms, databases, logged-in users, dashboards - without writing an application from scratch. For you they are a business weapon: an idea on Monday can be in a customer's hands on Friday, at a build cost of almost nothing but your time.

## Data first, always

Amateurs open a no-code tool and start dragging buttons. Professionals design the data first. An app is tables: for a Douala bakery's order tracker, that is a **Customers** table (name, phone, quartier), an **Orders** table (customer, items, amount, status, pickup time), maybe a **Products** table (name, price, available). Each table has one row per thing, and tables link to each other (an order belongs to a customer). Sketch this on paper before anything else - a clean data model makes every later step easy, and a messy one poisons the whole app. This is exactly the sheet-structuring discipline from your n8n work, formalised.

Ask your AI assistant to pressure-test the model: "Here are my tables for a bakery order tracker - what fields am I missing? What will break when a customer orders twice in one day?"

## The interface layer

Tools like Softr or Glide build interfaces on top of your tables; Bubble goes deeper with full custom logic. For SME work, the lighter tools cover most needs. Every app you will sell is made of three screen types: **forms** (staff logs a new order), **lists** (today's orders, filterable by status), and **detail views** (one order, with a button that flips status from "en preparation" to "prete"). That status button is your first taste of app logic: a user action that updates data.

## Test with real-shaped data

Generate twenty realistic fake orders with your AI assistant - Cameroonian names, real quartiers, plausible items and amounts - and load them in. An app tested on three tidy rows always breaks on real data; you already know why.

**Your task:** Build a working order tracker for the bakery in the no-code tool of your choice: data model of at least two linked tables, a new-order form, a filterable order list, and a detail view with a status-change action, loaded with twenty AI-generated realistic test orders. Share the app link and screenshots of all three screen types in your repo, plus your data-model sketch.`,
            aiPrompt:
              "This lesson teaches no-code app building with a data-first method: model linked tables before building screens, then create forms, lists, and detail views with simple state logic (e.g. order status buttons). Use the Douala bakery order-tracker example. Help students pressure-test data models and generate realistic Cameroonian test data.",
          },
          {
            title: "Connecting No-Code Apps to Automations",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Trigger n8n workflows from app events (new record, status change) via webhooks or native integrations.",
              "Update app data from workflows so the app reflects what automations have done.",
              "Design the split: what belongs in the app vs what belongs in the automation layer.",
              "Assemble a full-stack no-code system: app + automation + AI.",
            ],
            content: `An app that just stores data is a nicer notebook. Wire it to your n8n workflows and it becomes a system: the moment staff marks an order "prete," the customer's WhatsApp buzzes. This lesson turns your two skills - apps and automations - into one product, and that combination is your real market advantage.

## The two directions

**App to automation:** app events trigger workflows. Most no-code tools can call a webhook when a record is created or changed - which is exactly the n8n Webhook trigger you mastered. New order created: webhook fires, n8n sends the confirmation message. Status flips to "prete": webhook fires, n8n sends "votre commande est prete." If the tool lacks webhooks, n8n can poll the underlying data source on a short schedule; less elegant, still sellable.

**Automation to app:** workflows write back. When your invoice-chase workflow gets a payment confirmation, it updates the order's status in the app's data - so the owner opens the app and sees reality, not yesterday. Most no-code databases (Airtable, Sheets, and the built-in ones with APIs) accept updates from n8n via native nodes or HTTP Request. Nothing here is new to you; it is the same items, credentials, and calls pointed at a new target.

## Where logic should live

A rule worth adopting: the **app** owns data and human interaction (viewing, entering, approving); the **automation layer** owns everything that happens without a human (messages, AI calls, schelduled chases, external APIs). Keep app-side logic thin. When a client asks for a change - "can reminders go out at 17h instead of 8h?" - you change one n8n node instead of rebuilding app internals. This separation is also what lets you swap tools later without starting over.

## The full stack, no code

App for staff, n8n for the machinery, an LLM node for the intelligence, WhatsApp for the customer. That stack - which you now fully possess - is what agencies in Lagos and Nairobi charge millions of francs to assemble.

**Your task:** Connect your bakery app to n8n both ways: a status change to "prete" triggers a customer notification (send to your own number/email for testing), and a workflow writes a confirmation timestamp back to the order record. Demonstrate one order flowing through the complete loop. Commit workflow JSON, screenshots of the trigger and the write-back, and three sentences on what you put app-side vs automation-side and why.`,
            aiPrompt:
              "This lesson connects no-code apps to n8n in both directions: app events triggering workflows via webhooks, and workflows writing status back to app data. Reinforce the architecture rule that apps own data and human interaction while automations own unattended work. Help students debug webhook wiring and design the app/automation split for their bakery order tracker.",
          },
          {
            title: "Payments Basics for Africa: Mobile Money & Stripe Concepts",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Describe how Mobile Money payments work in Cameroon (MTN MoMo, Orange Money) from a builder's perspective.",
              "Explain payment aggregators and APIs for collecting MoMo programmatically, and what merchant onboarding requires.",
              "Understand card-payment concepts (Stripe model: checkout, webhooks for confirmation) and when they matter.",
              "Design a realistic payment flow for an SME product, including semi-manual confirmation as a valid starting point.",
            ],
            content: `No payment, no business. In Cameroon the payment rail that matters is **Mobile Money** - MTN MoMo and Orange Money dwarf card usage - so you will learn payments MoMo-first, with card concepts (the Stripe model) as the international layer you add when a client sells beyond the region.

## How MoMo works for a builder

A customer paying an SME today usually sends to a merchant number and the owner checks their phone for the confirmation SMS. It works, but it is manual and unverifiable at scale. The programmatic version goes through the operators' business APIs or, more practically, **aggregators** (payment platforms serving the Cameroonian market, such as those integrating both MTN and Orange behind one API). The flow: your system sends a payment request to the customer's number, the customer confirms with their PIN on their phone, and the platform notifies your system of success - by calling a webhook you control. You already know exactly what to do with that webhook. Two realities to respect: merchant onboarding requires the business's documents and takes days-to-weeks (start it early in any client project), and every transaction carries fees of a few percent - price them in.

## The Stripe model, conceptually

Stripe's pattern is worth knowing even where Stripe itself is unavailable, because every serious payment API copies it: your app creates a **checkout** (an amount plus a reference), the customer pays on a hosted page, and the provider fires a **webhook** confirming payment - and only that webhook, never the customer's word or a redirect page, is proof of payment. Say that sentence to any developer and they will assume you are one.

## The honest starting point

For a first SME product, a semi-manual flow is legitimate: app shows "send 5,000 F to MoMo number X with reference ORD-042," owner confirms receipt with one tap, n8n does the rest (receipt message, status update, sheet entry). It is automatable later by swapping the human tap for an aggregator webhook - because you designed the flow around a confirmation event from day one.

**Your task:** Design the complete payment flow for your bakery product as a written flow map: how the customer pays (MoMo-first), how payment gets confirmed (semi-manual now, aggregator webhook later - show both variants), what n8n does on confirmation, and how failures (wrong amount, no payment after 24h) are handled. Include realistic fees in FCFA on a 5,000 F order. Commit it to your repo.`,
            aiPrompt:
              "This lesson covers payments for African SME products: Mobile Money mechanics (MTN MoMo, Orange Money), aggregator APIs with webhook confirmation, merchant onboarding lead times and fees, the Stripe checkout+webhook model as a concept, and semi-manual confirmation flows as a legitimate v1. Help students design payment flow maps where only a confirmation event - human tap or webhook - marks an order paid.",
          },
          {
            title: "Launching & Iterating with User Feedback",
            type: "task",
            duration: "45 min",
            objectives: [
              "Run a soft launch: put a real product in front of 3-5 real users with a clear ask.",
              "Collect structured feedback and separate signal from politeness.",
              "Prioritise a v2 iteration list and ship at least one improvement fast.",
              "Document the launch-learn-iterate loop as evidence for clients and your portfolio.",
            ],
            content: `A product nobody has used is a hypothesis. This lesson forces the scariest, most valuable step in the whole phase: putting your bakery system in front of real humans and letting reality vote. Every successful founder and consultant you admire is simply someone who has run this loop more times than everyone else.

## The soft launch

Forget grand launches. Pick 3-5 real people - an actual shop owner in your quartier, a cousin who sells online, classmates role-playing staff and customers - and give them a task, not a demo: "Log these three orders and mark one ready. I will watch and say nothing." Watching someone struggle silently with your form is uncomfortable and worth more than a hundred compliments. Note every hesitation, every "where do I...?", every workaround they invent.

## Separating signal from politeness

Cameroonians are gracious; "c'est bien, c'est joli" is the sound of politeness, not product validation. Get past it with behaviour-based questions: "Which step annoyed you most?" "What would make you stop using this after a week?" "Would you pay 5,000 F a month for it - and if not, what would it need?" Watch what they DO: a user who asks "can I keep using it after today?" is telling you something no survey can.

## Prioritise and ship v2 fast

Dump all feedback into your AI assistant and ask it to cluster themes and draft a prioritised list, scored by user impact against your build effort - your ROI matrix, turned inward. Then fix the top item and get it back to the same users **within days**. Speed of iteration is the trust signal: users who see their feedback shipped become advocates, and "I improved the product twice in one week based on user feedback" is a sentence that wins client work.

## Document the loop

Write the story: what you launched, to whom, what you observed, what you changed, what happened next. This narrative is Build Studio gold and portfolio gold.

**Your task:** Soft-launch your bakery system to at least three real users with observed tasks. Produce a launch report: who tested, five concrete observations, the prioritised iteration list, and proof (screenshots or a short screen recording) of at least one shipped improvement plus one user's reaction to it. Commit the report - this completes your \`automation-casebook\` for the phase.`,
            aiPrompt:
              "This is a build lesson on launching and iterating: soft-launching to 3-5 real users with observed tasks, extracting honest signal past polite 'c'est bien' feedback using behaviour-based questions, clustering feedback into a prioritised v2 list, and shipping one improvement within days. Help students design test tasks, draft interview questions, and cluster their raw feedback notes.",
          },
        ],
      },
    ],
  },
  {
    phaseSlug: "build-studio",
    modules: [
      {
        title: "Client Sprint: Automating a Real Business",
        description:
          "Six weeks of studio time start with a full client engagement, run like the real thing: discovery, a scoped build delivered end-to-end, and a professional handover. Work from a real SME you recruit or a realistic studio brief - either way, you finish with a live automation and the documents that prove you can be trusted with a client's business.",
        lessons: [
          {
            title: "Discovery Call & Requirements from an SME Brief",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Run a structured discovery conversation that surfaces the real process, not the idealised one.",
              "Convert discovery notes into a written requirements document with explicit scope boundaries.",
              "Identify access, data, and decision-maker dependencies before quoting.",
              "Get written sign-off on scope before building anything.",
            ],
            content: `Every failed automation project fails at the beginning - a scope nobody agreed on, a process the consultant misunderstood, an owner who expected magic. The discovery call is where you prevent all of it, and it is a performance: the client is deciding whether you are a professional or a gamble.

## Running discovery

Whether you have recruited a real SME (strongly encouraged - your quartier is full of them) or are working from a studio brief, run the same structure, 30-45 minutes:

1. **The business** - what they sell, to whom, volumes per day/week. Numbers, not vibes.
2. **The process, as it actually happens** - walk through yesterday's real orders or invoices, step by step. Ask "and then what happens?" until you reach the end state. Ask "what happens when that goes wrong?" at every step - the exceptions are where projects die.
3. **The pain, quantified** - hours per week, money lost, in their words. Write down their exact phrases; you will reuse them in the proposal and they are more persuasive than anything you could invent.
4. **Constraints** - what tools they have, who else must approve, what must never change ("customers must always be able to reach a human").

Record it if permitted, or take notes and ask your AI assistant to structure them afterward into process map, pain points, constraints, and open questions - then send the open questions the same day. Speed reads as competence.

## Requirements and the scope fence

Turn discovery into a short requirements document: current process, the automation you propose (using your Phase 3 four-section structure), and - most important - the **scope fence**: an explicit "included / not included" list. "Included: WhatsApp order confirmations and daily order sheet. Not included: inventory, Instagram, delivery tracking (future phases)." Then get a written yes - a WhatsApp message saying "d'accord, on commence" counts. Never build on a verbal maybe.

**Your task:** Conduct a real discovery conversation (with your recruited SME, or a staff-played client from the studio brief) and produce the requirements document: business summary with numbers, as-is process map with exception cases, quantified pain in FCFA, scope fence, dependencies list, and evidence of written sign-off. Submit to your Build Studio repo.`,
            aiPrompt:
              "This lesson covers client discovery for an automation sprint: the four-part discovery structure (business numbers, as-is process with exceptions, quantified pain, constraints), turning notes into a requirements document, and the scope fence with written sign-off. Help students prepare question lists, structure messy discovery notes, and tighten vague scope into explicit included/not-included lists.",
          },
          {
            title: "Building the Automation End-to-End",
            type: "task",
            duration: "45 min",
            objectives: [
              "Plan the build as milestones with a working slice delivered early.",
              "Build the full workflow with production discipline: clean data handling, error workflow, cost logging.",
              "Test against realistic and hostile data before the client ever sees it.",
              "Manage scope creep with 'phase two' discipline while keeping goodwill.",
            ],
            content: `This is the sprint's engine room: one to two weeks turning the signed scope into a running system. Everything from Phase 3 gets used; what is new is the discipline of building for someone else's business, where "it worked when I tried it" is not a standard.

## Milestones, thinnest slice first

Break the build into three milestones and put a **working end-to-end slice** at milestone one: for the bakery, a single test order flowing form-to-confirmation-message within the first two days, even with rough edges. Show the client. This does more than any status update - it converts their anxiety into excitement, and it surfaces wrong assumptions (the sheet they gave you is not the one staff actually use; the "standard" order format is not standard) while they are still cheap to fix. Milestones two and three add branches, edge cases, and polish.

## Production discipline checklist

Before you call any workflow done, it has: a Set node normalising inputs near the top; invalid data routed to a visible review sheet, never dropped; retries on network-dependent nodes; an error workflow that alerts you by name; LLM calls (if any) logged to the cost sheet with guardrails from Phase 3; credentials in the store, zero keys in parameters; and node names a stranger could read ("Send order confirmation WhatsApp," not "HTTP Request 3"). Then the hostile test: feed it your AI-generated nightmare data - duplicates, pidgin, emojis, a 47-item order, an empty message - plus a full dress rehearsal of a normal day's volume.

## Scope creep, handled with grace

Mid-build, the owner will say "et aussi, can it also...". The professional response: "Great idea - noted for phase two. Adding it now would delay your launch." Log every request in a visible phase-two list. This protects the deadline AND builds your pipeline: the phase-two list is next month's paid contract.

**Your task:** Build the complete automation from your signed scope: milestone plan with dates, evidence of the milestone-one demo shown to the client (message or reaction screenshot), the full production-discipline checklist verified item by item, hostile-data test results, and your phase-two request log. Commit workflow exports and evidence to your Build Studio repo.`,
            aiPrompt:
              "This is the core build lesson of the client sprint: milestone planning with a thin end-to-end slice first, the production-discipline checklist (input normalisation, visible reject routing, retries, error workflow, cost logging, credential hygiene, readable node names), hostile-data testing, and deflecting scope creep to a phase-two list. Review students' plans and checklists, and generate nightmare test data for their workflow.",
          },
          {
            title: "Handover: Documentation, Training, Support Terms",
            type: "task",
            duration: "45 min",
            objectives: [
              "Produce a client documentation pack: how it works, what to do when things go wrong, who owns what.",
              "Train the client and staff to operate their part of the system confidently.",
              "Define and price written support terms: response time, what is included, monthly fee.",
              "Close the engagement with a request for a testimonial and a referral.",
            ],
            content: `Handover is where a project becomes either a recurring client or a slow-motion failure. Done right, the client feels ownership, knows exactly what to do when something looks wrong, and keeps paying you monthly to never worry. Done lazily, you get a 21:30 call every time an email bounces - for free, forever.

## The documentation pack

Three short documents, written for the reader:

1. **How it works** (for the owner) - one page, plain language, a simple diagram: what triggers what, what the system sends, where the data lives. No node names.
2. **Daily operations** (for staff) - the two or three things humans still do: approve flagged drafts, check the review sheet, mark exceptions handled. Screenshots with arrows drawn on them beat paragraphs.
3. **When something looks wrong** (for everyone) - symptoms in their words ("customers say they got no confirmation"), what to check first, when to call you, and the promise: "you will never break anything by pausing the workflow."

Draft all three with your AI assistant from your workflow export and requirements doc, then edit for truth and simplicity. Deliver as PDFs, in the client's preferred language.

## Training

One live session, 30-45 minutes, hands-on: the staff member does each task herself while you watch - you type nothing. End with a deliberately triggered error so they see an alert and feel the calm of knowing the procedure. People do not trust what they have never seen fail.

## Support terms and the graceful close

Put support in writing before you leave: what is included (monitoring, fixes, small tweaks under 30 minutes), response time (e.g. within 24 hours, business days), monthly fee (the 10,000-25,000 F range depending on complexity), and what counts as new paid work (the phase-two list). Then close warm: deliver a one-page results summary two weeks post-launch (messages sent, hours saved), and ask for two things - a short written testimonial, and "who else do you know who drowns in this kind of work?" A happy SME owner's referral is the cheapest client acquisition on earth.

**Your task:** Produce the full handover pack for your sprint client: all three documents as PDFs, evidence of a delivered training session (photo, recording, or the client's confirmation message), and your signed support terms with monthly fee in FCFA. Request the testimonial. Commit everything - this completes the client sprint.`,
            aiPrompt:
              "This is a build lesson on professional handover: the three-document pack (owner overview, staff daily operations with screenshots, troubleshooting guide), hands-on training where the staff member drives, and written support terms (inclusions, response time, 10,000-25,000 F monthly fee, phase-two boundary). Help students draft each document from their workflow details in plain client-friendly language, and role-play the training session or testimonial ask.",
          },
        ],
      },
      {
        title: "Package It as a Business",
        description:
          "One client is a project; a repeatable offer is a business. This module turns your sprint into a productised service with fixed packages, teaches you to price and propose like a professional in the Cameroonian market, and drives you to a capstone submission strong enough to show any client, employer, or investor.",
        lessons: [
          {
            title: "Productising a Service: Fixed-Price Packages",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Explain why productised packages beat hourly billing for automation work.",
              "Design a three-tier package offer for one specific automation service.",
              "Standardise delivery with templates and checklists so each sale costs less to fulfil.",
              "Write the one-sentence pitch that names the client, the problem, and the outcome.",
            ],
            content: `Hourly billing punishes you for getting faster. The sprint you just delivered took real hours the first time - the second bakery will take half, the fifth a quarter - and under hourly billing your income shrinks as your skill grows. Productising flips it: a fixed package at a fixed price, where speed becomes pure margin.

## From project to product

Look at what you built and extract the repeatable core. If your sprint was order confirmations for a bakery, your product is "the Order Flow package for food businesses": order intake, instant customer confirmation, daily owner summary. Delivered in a fixed number of days, at a fixed price. The magic of specificity: "automation consultant" gets polite nods; "I set up automatic WhatsApp order confirmations for bakeries and restaurants - live in one week" gets "combien?". Niching to one vertical also compounds - every client teaches you the vertical's patterns, making you faster AND more credible with the next one.

## Three tiers

One package leaves money on the table. Structure three:

- **Essential** (e.g. 60,000 F) - the core flow, standard messages, email support.
- **Standard** (e.g. 100,000 F) - plus the AI responder for FAQs and one month of monitoring included.
- **Premium** (e.g. 150,000 F+) - plus the no-code dashboard app and priority support terms.

Most buyers choose the middle - design Standard as the offer you want to sell. Anchor every tier to value ("recovers the cost in unpaid invoices in the first month"), not to your hours.

## The delivery system

A product needs a factory. Build your templates once: the n8n workflow skeleton with client-specific values isolated in one place, the discovery question list, the documentation pack skeletons, the hostile-data test set, the handover checklist. Your AI assistant maintains and customises these per client in minutes. Every hour invested in templates is margin on every future sale.

**Your task:** Define your productised offer: the niche and one-sentence pitch, three tiers with FCFA prices and exact inclusions, delivery time per tier, and a list of the five delivery templates you will build (with at least the discovery list and documentation skeleton actually drafted). Commit it as your offer document.`,
            aiPrompt:
              "This lesson covers productising automation services: why fixed packages beat hourly billing, extracting a repeatable core from the client sprint, three-tier offers (roughly 60,000/100,000/150,000+ F) designed so the middle tier sells, value anchoring, niche one-sentence pitches, and delivery templates. Help students sharpen vague offers into a specific niche and pitch, and structure their tier inclusions.",
          },
          {
            title: "Pricing & Proposals for Cameroon SMEs",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Price against value and local purchasing power without racing to the bottom.",
              "Write a short proposal that closes: problem, outcome, package, price, timeline, next step.",
              "Handle the three classic objections: 'c'est cher', 'my nephew can do it', and 'we will think about it'.",
              "Structure payment terms that protect you: deposit, milestone, completion.",
            ],
            content: `Pricing is psychology plus arithmetic, and in the Cameroonian SME market both matter. Price too high with no proof and you hear silence; price too low and owners assume the work is worthless - and you burn out serving ten clients to earn what three should pay.

## The value floor and the market ceiling

Your floor: the automation's monthly value to the client (your ROI arithmetic - hours saved plus money recovered). A setup at 100,000 F that saves 50,000 F monthly pays back in two months; framed that way, it is cheap. Your ceiling: local reality - a boutique turning over 800,000 F a month will not pay 500,000 F for anything, however brilliant. The 60,000-150,000 F setup range plus 10,000-25,000 F monthly maintenance sits comfortably between floor and ceiling for typical Douala/Yaounde SMEs. Raise prices as testimonials accumulate; your third client should pay more than your first, who took a chance on you.

## The proposal that closes

One page, maximum two, in this order: **their problem in their words** (from discovery - "vous perdez 2 heures par jour a confirmer les commandes"), **the outcome** (not the technology: "every customer confirmed within a minute, automatically"), **the package** (tier, inclusions, what is NOT included), **price and payment terms**, **timeline**, and a **single next step** ("reply OK and we start Monday"). No jargon, no ten-page annexes. Draft with your AI assistant, then cut a third of the words.

## Objections, prepared

"C'est cher" - return to the arithmetic: "It costs 100,000 F once, and recovers 50,000 F every month. What is expensive is the current situation." "My nephew knows computers" - stay gracious: "Perfect - my documentation will help him. What I bring is that it works in one week, keeps working, and someone answers when it breaks." "We will think about it" - offer a smaller yes: the Essential tier, or a 15,000 F paid pilot for one week of the service. A paid pilot filters the serious from the polite.

## Payment terms

Never 100% on completion: 50% deposit to start, 50% on delivery (or 40/30/30 with a milestone for bigger builds). The deposit is commitment insurance - a client with money in refuses to let the project stall.

**Your task:** Write a complete one-page proposal for a real or realistic prospect using your productised offer, with FCFA pricing, payment terms, and single next step. Then rehearse objection handling with your AI assistant playing a tough SME owner across all three classic objections, and note what you changed after the roleplay. Commit proposal and roleplay notes.`,
            aiPrompt:
              "This lesson covers pricing and proposals for Cameroonian SMEs: value floor vs market ceiling (60,000-150,000 F setups, 10,000-25,000 F monthly maintenance as reference points), the one-page proposal structure ending in a single next step, deposit-based payment terms, and handling 'c'est cher', 'my nephew can do it', and 'we will think about it'. Roleplay as a tough but fair SME owner when students practise objections.",
          },
          {
            title: "Preparing Your Capstone Submission",
            type: "task",
            duration: "45 min",
            objectives: [
              "Assemble the complete capstone package: live workflow, documentation, demo video, business one-pager.",
              "Record a demo video that sells the outcome in under five minutes.",
              "Publish the professional narrative across the platforms from Phase 1 (GitHub, LinkedIn, Medium).",
              "Pass the external-reviewer test: a stranger can understand, run, and evaluate your work.",
            ],
            content: `Your capstone is not homework - it is the centrepiece asset of your professional life for the next year. It will be the link you send prospects, the pinned post recruiters find, the proof behind every proposal. Assemble it like the product it is.

## The package

Four components, each held to the standard "a stranger could evaluate this alone":

1. **The live system** - your workflow exported and importable, the no-code app link if applicable, with a working demo path a reviewer can trigger safely (test credentials or a sandboxed copy - never your client's live data; scrub real names and numbers from everything public).
2. **The documentation** - your handover pack, plus a technical README: architecture in one diagram, tools used, how to import and run, known limitations stated honestly. Honesty about limitations reads as seniority, not weakness.
3. **The demo video** - see below.
4. **The business one-pager** - the problem, who has it, your productised offer with FCFA pricing, results and testimonial from your sprint client, and what phase two looks like.

## The demo video that sells

Under five minutes, structured as story, not feature tour: the problem in human terms (15 seconds on the owner's daily pain), the system doing its job live - a real order flowing from WhatsApp message to confirmation to sheet to owner summary - then the numbers (hours saved, FCFA recovered, response time), then you, on camera even briefly, saying who you are and what you build. Record the screen with narration; imperfect audio with a clear story beats a silent screen recording every time. Ask your AI assistant to tighten your script, then rehearse twice and record.

## Publish the narrative

Close the loop with Phase 1: capstone repo pinned on GitHub with a compelling README, a LinkedIn post telling the client story (with permission) tagged for the African tech community, and a Medium article - "How I automated a Douala bakery's orders with n8n and AI" - walking through the build. Ship all three the same week the capstone is submitted, while the momentum is real.

**Your task:** Submit the complete capstone package: repo with importable workflow and README, documentation pack, demo video (under 5 minutes, uploaded and linked), and business one-pager. Before submitting, run the external-reviewer test: someone outside the program follows your README cold and reports where they got stuck - include their feedback and your fixes in the submission.`,
            aiPrompt:
              "This is the capstone assembly lesson: the four-component package (importable live system with scrubbed data, honest documentation with README and limitations, sub-5-minute story-structured demo video, business one-pager with FCFA pricing and testimonial), plus publishing to GitHub/LinkedIn/Medium per Phase 1. Help students script and tighten demo videos, structure READMEs for cold external reviewers, and draft the LinkedIn post and Medium article outline.",
          },
        ],
      },
    ],
  },
];

export const trackBProjects: ProjectSeed[] = [
  {
    phaseSlug: "build-studio",
    title: "WhatsApp AI Support & Orders Bot for an SME",
    description:
      "Build and deploy a WhatsApp bot for a real or realistic Cameroonian SME that answers frequently asked questions from a client-approved knowledge base, takes structured orders into a sheet or app, and hands off complaints and unknown questions to a human with a clean summary. The system must run on an official WhatsApp API provider, include guardrails and a draft-first approval option for sensitive replies, and log AI costs per conversation. You will deliver it as a client would receive it: live, documented, monitored, and demonstrated on video with real French and English test conversations. This is the flagship 'can the robot answer my WhatsApp?' product that Cameroonian SMEs ask for by name.",
    deliverables: [
      { title: "Workflow Export", ext: "ZIP" },
      { title: "Live Demo", ext: "LINK" },
      { title: "Demo Video", ext: "MP4" },
      { title: "Client Documentation", ext: "PDF" },
      { title: "Knowledge Base", ext: "PDF" },
    ],
    monetizationPotential:
      "Sells as a productised package at 80,000-150,000 F setup plus 15,000-25,000 F monthly for monitoring, knowledge-base updates, and message costs. Ten clients on maintenance alone is 150,000-250,000 F of recurring monthly income before any new setup fees.",
  },
  {
    phaseSlug: "build-studio",
    title: "Invoice & Payment-Chase Automation",
    description:
      "Build the automation every service business quietly needs: invoices generated automatically from a Google Sheet or intake form, sent to customers by email or WhatsApp, followed by a polite-then-firm reminder sequence until payment is confirmed. The system tracks payment status (semi-manual MoMo confirmation or aggregator webhook), routes disputes and bounced contacts to a visible review sheet, and sends the owner a weekly outstanding-payments summary. AI drafts the reminder messages in the customer's language with amounts and references injected from data, behind guardrails that prevent wrong-amount messages. Deliver it hardened: error workflow, retries, hostile-data tested, and documented for handover.",
    deliverables: [
      { title: "Workflow Export", ext: "ZIP" },
      { title: "Live Demo", ext: "LINK" },
      { title: "Demo Video", ext: "MP4" },
      { title: "Client Documentation", ext: "PDF" },
    ],
    monetizationPotential:
      "The classic 60,000-150,000 F setup depending on tier, plus 10,000-20,000 F monthly maintenance. Its ROI story closes deals fast: a client recovering two forgotten 15,000 F invoices per month pays back a 90,000 F setup in three months, making this the easiest first sale in your portfolio.",
  },
  {
    phaseSlug: "build-studio",
    title: "Launch a Micro-SaaS or Productised Service",
    description:
      "Turn your Track B skills into a repeatable business: either a small no-code product (for example, an order tracker or appointment-reminder tool for one niche like salons, clinics, or food businesses) or a fully productised automation service with fixed three-tier packages. Ship a landing page that states the niche, the outcome, and FCFA pricing, with a working call-to-action (form or WhatsApp link) wired into your own automation for lead follow-up. Then get it in front of at least three real potential users or buyers, collect structured feedback, and ship one iteration based on what you learned. The deliverable is not just the product - it is documented evidence of a launch loop: offer, real user contact, feedback, improvement.",
    deliverables: [
      { title: "Live Product / Landing Page", ext: "LINK" },
      { title: "Demo Video", ext: "MP4" },
      { title: "Offer & Pricing One-Pager", ext: "PDF" },
      { title: "Launch & Feedback Report", ext: "PDF" },
    ],
    monetizationPotential:
      "A niche micro-SaaS at 5,000-15,000 F per client per month reaches 100,000-300,000 F monthly recurring revenue at 20 clients, while a productised service closing two Standard packages a month generates around 200,000 F plus growing maintenance income. Either path scales on templates and reputation rather than hours worked.",
  },
];
