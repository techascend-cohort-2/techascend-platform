// Track A: AI-Powered Software Engineering
// Phase 3 "core-skills" (9 weeks, 10 Aug - 9 Oct 2026) and
// Phase 4 "build-studio" (6 weeks, 12 Oct - 20 Nov 2026).
// Seed content consumed by prisma/seed.ts.

import type { PhaseContent, ProjectSeed } from "./types";

export const trackAContent: PhaseContent[] = [
  {
    phaseSlug: "core-skills",
    modules: [
      // ─────────────────────────────────────────────────────────────
      // Module 1: Web Foundations
      // ─────────────────────────────────────────────────────────────
      {
        title: "Web Foundations: HTML, CSS & the Browser",
        description:
          "Build real web pages from scratch: semantic HTML, modern CSS layout with flexbox and grid, responsive design for the phones your clients actually use, and publishing to the world with GitHub Pages.",
        lessons: [
          {
            title: "Semantic HTML: Structure That Means Something",
            type: "ai",
            duration: "30 min",
            objectives: [
              "Explain what semantic HTML is and why it matters for accessibility and SEO.",
              "Use header, nav, main, section, article and footer to structure a page.",
              "Choose the correct element (button vs link, heading levels) for each job.",
              "Use an AI assistant to review your HTML structure and explain its suggestions.",
            ],
            content: `HTML is the skeleton of every website you will ever build or bill for. Semantic HTML means choosing tags that describe *what content is*, not just how it looks. A screen reader, Google's crawler, and your AI assistant all read your tags to understand your page — so \`<nav>\` for navigation and \`<button>\` for actions beats a page full of \`<div>\`s every time.

## The core semantic elements

Every well-structured page follows roughly this shape:

\`\`\`html
<header>
  <nav>...site links...</nav>
</header>
<main>
  <section id="menu">
    <h2>Our Breads</h2>
    <article>...one bread...</article>
  </section>
</main>
<footer>...contact, opening hours...</footer>
\`\`\`

Imagine you are building a site for **Boulangerie Bonapriso**, a bakery in Douala. The menu is a \`<section>\`, each pastry is an \`<article>\`, the phone number lives in the \`<footer>\`. When Google indexes that page, semantic structure helps the bakery show up when someone searches "bakery near Bonapriso" — that is real business value you can explain to a paying client.

## Headings and hierarchy

Use exactly one \`<h1>\` per page (the page's main topic), then \`<h2>\` for sections, \`<h3>\` inside those. Never pick a heading level because of its size — that is CSS's job.

## Working with your AI assistant

Paste your HTML into Claude or ChatGPT and ask: "Review this HTML for semantic correctness and accessibility. Explain every change you suggest." Do not accept edits you cannot explain. The habit you are building this week — generate, verify, understand — is the core of AI-native engineering and the reason clients will trust you.

**Your task:** Create a file \`index.html\` for a one-page site for a real or imagined local business (a bakery, salon, or repair shop). It must use \`<header>\`, \`<nav>\`, \`<main>\`, at least two \`<section>\`s, and \`<footer>\`, with a sensible heading hierarchy. Ask your AI assistant to review it, apply the changes you agree with, and commit the file to a new GitHub repository called \`web-foundations\`.`,
            aiPrompt:
              "This lesson covers semantic HTML: header/nav/main/section/article/footer, heading hierarchy, and why semantics matter for accessibility and SEO. Use a Douala bakery site as the running example. Steer the student towards explaining WHY each tag is correct, not just copying AI-suggested markup.",
          },
          {
            title: "CSS Layout: Flexbox & Grid",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Link a stylesheet and apply the box model (margin, padding, border) deliberately.",
              "Lay out navigation bars and card rows with flexbox.",
              "Build a two-dimensional page layout with CSS grid.",
              "Decide when to reach for flexbox versus grid.",
            ],
            content: `CSS turns your skeleton into something a client will pay for. Today's layout tools — flexbox and grid — replaced years of hacks, and you only need a handful of properties to do 90% of professional layout work.

## Flexbox: one direction at a time

Flexbox arranges children along a single axis (a row or a column). It is perfect for navigation bars, button groups, and rows of cards:

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between; /* push logo left, links right */
  align-items: center;
  gap: 1rem;
}
\`\`\`

Memorise the big three: \`justify-content\` (main axis), \`align-items\` (cross axis), \`gap\` (space between children). For the Boulangerie Bonapriso site, the header logo and links sit in one flex row; the three product cards sit in another with \`flex-wrap: wrap\` so they stack on small screens.

## Grid: rows AND columns together

Grid controls two dimensions at once — ideal for whole-page layouts and photo galleries:

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
\`\`\`

\`1fr\` means "one fair share of the available space". \`repeat(3, 1fr)\` gives three equal columns without a single pixel calculation.

## Which one when?

A simple rule that will rarely fail you: content in a line (nav, toolbar, card row) → flexbox; a full two-dimensional arrangement (page shell, gallery, dashboard) → grid. When stuck, describe your desired layout to your AI assistant in plain words ("three cards per row, stacking to one column on phones") and study the CSS it produces — then change one value at a time in DevTools to prove you understand it.

**Your task:** Style your business site from the previous lesson: a flexbox header with logo left and links right, and a grid of at least three product or service cards. Take a screenshot, then commit \`styles.css\` to your \`web-foundations\` repo with a clear commit message.`,
            aiPrompt:
              "This lesson covers CSS flexbox (justify-content, align-items, gap) and grid (grid-template-columns, fr units) for the bakery site started in lesson 1. If the student is confused, have them describe the layout in plain words first, then map each phrase to a property. Encourage experimenting in browser DevTools.",
          },
          {
            title: "Responsive Design: Build for the Phones People Actually Use",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Explain why mobile-first design matters in the Cameroonian and wider African market.",
              "Use the viewport meta tag and relative units (rem, %, vw) correctly.",
              "Write media queries that adapt a layout from phone to desktop.",
              "Test a page at multiple screen sizes using browser DevTools device mode.",
            ],
            content: `In Cameroon, most of your users will open your site on an Android phone, often on a patchy MTN or Orange connection. A site that only looks good on a laptop is a site that fails the people paying for it. Responsive design means one codebase that adapts to every screen — and "mobile-first" means you write the phone styles first, then enhance for bigger screens.

## The non-negotiable first line

Inside \`<head>\`, always include:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1" />
\`\`\`

Without it, phones pretend to be desktops and shrink everything to unreadable size.

## Relative units over pixels

Prefer \`rem\` for font sizes and spacing (it scales with the user's settings), and percentages or \`fr\` for widths. \`max-width: 65ch\` keeps paragraphs readable; \`width: 100%\` on images stops them overflowing on small screens.

## Media queries: enhance upwards

Write your default CSS for phones. Then add breakpoints for larger screens:

\`\`\`css
.cards { display: grid; grid-template-columns: 1fr; gap: 1rem; }

@media (min-width: 700px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
\`\`\`

One column on a phone, three on a laptop — the bakery's customers get a clean experience either way.

## Test like a professional

Open DevTools (F12), toggle device mode, and check your page at 360px (a common Android width), 768px, and 1280px. Also throttle the network to "Slow 3G" and watch how heavy images hurt load time — compress them before shipping. When something breaks at a size, paste the CSS into your AI assistant with the exact symptom ("cards overflow at 360px wide") and compare its diagnosis with what you see in DevTools.

**Your task:** Make your business site fully responsive: it must look correct at 360px, 768px and 1280px with no horizontal scrolling. Commit the changes, and add screenshots of all three widths to your repo in a \`screenshots/\` folder.`,
            aiPrompt:
              "This lesson covers mobile-first responsive design: viewport meta tag, rem/percentage units, min-width media queries, DevTools device mode. Emphasise the Cameroon reality of Android phones and slow connections. Help the student debug specific breakpoints rather than rewriting whole stylesheets.",
          },
          {
            title: "Publish It: GitHub Pages & Your First Live URL",
            type: "task",
            duration: "30 min",
            objectives: [
              "Deploy a static site to GitHub Pages from a repository.",
              "Explain what happens between pushing a commit and the site updating.",
              "Write a short, client-friendly README for a website project.",
              "Share a live URL professionally on LinkedIn or X.",
            ],
            content: `A site on your laptop earns nothing. A site with a public URL is a portfolio piece, a sales tool, and proof to clients that you finish what you start. GitHub Pages hosts static sites (HTML, CSS, JavaScript — no server code) for free, straight from your repository.

## Deploying in four steps

1. Push your \`web-foundations\` repo to GitHub (you learned this in Phase 2).
2. On GitHub, open **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, select \`main\` and the root folder, and save.
4. Wait a minute, then visit \`https://YOUR-USERNAME.github.io/web-foundations/\`.

Every future push to \`main\` redeploys automatically. That push-to-publish loop is your first taste of a deployment pipeline — the same idea powers professional teams shipping to millions of users.

## When it does not work

The two classic failures: your homepage file is not named exactly \`index.html\`, or your links use absolute paths like \`/styles.css\` that break under the project subpath (use relative paths like \`./styles.css\`). If the page is blank or unstyled, open DevTools, check the Console and Network tabs for 404s, and give your AI assistant the exact error text — precise errors get precise answers.

## Make it presentable

Add a \`README.md\`: one sentence on what the site is, the live URL, and one screenshot. Clients and recruiters judge repositories in about ten seconds; a clean README with a working link passes that test.

## Tell the world

Remember Phase 1: visibility compounds. A short LinkedIn post — "I built and deployed my first responsive website. Live here: [URL]. Built with semantic HTML, flexbox and grid." — starts the public track record that brings your first freelance enquiries. In Cameroon, simple business sites like this one sell for 50,000–150,000 FCFA; you now have the core skill.

**Your task:** Deploy your business site to GitHub Pages, confirm the live URL works on your own phone, add a README with the URL and a screenshot, and post the link on LinkedIn or X. Submit the live URL and the post link.`,
            aiPrompt:
              "This lesson is a deployment task: publishing the student's static site via GitHub Pages. Common issues are missing index.html, absolute asset paths breaking under the project subpath, and caching. Walk them through Settings → Pages, and insist they verify the live URL on a real phone before submitting.",
          },
        ],
      },
      // ─────────────────────────────────────────────────────────────
      // Module 2: JavaScript for Builders
      // ─────────────────────────────────────────────────────────────
      {
        title: "JavaScript for Builders",
        description:
          "The programming language of the web, learned by building: variables, functions and control flow, data structures, DOM manipulation, and talking to real APIs with fetch — with an AI assistant as your debugging partner throughout.",
        lessons: [
          {
            title: "Variables, Functions & Control Flow",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Declare variables with const and let and explain when to use each.",
              "Write and call functions with parameters and return values.",
              "Use if/else and comparison operators to make decisions in code.",
              "Run JavaScript in the browser console and in a script file.",
            ],
            content: `HTML and CSS describe a page; JavaScript makes it *do* things — calculate a price, validate a form, respond to a click. This lesson gives you the three building blocks behind every program you will ever write: storing values, packaging logic into functions, and making decisions.

## Variables: const by default

\`\`\`js
const deliveryFee = 1000;    // won't be reassigned
let total = 0;               // will change as items are added
\`\`\`

Use \`const\` unless you know the value must change — it prevents a whole family of bugs. (You will see \`var\` in old tutorials; do not use it.)

## Functions: name a piece of logic

\`\`\`js
function orderTotal(pricePerLoaf, quantity) {
  const subtotal = pricePerLoaf * quantity;
  return subtotal + deliveryFee;
}

console.log(orderTotal(500, 4)); // 3000
\`\`\`

A function takes inputs (parameters), does work, and \`return\`s a result. If Boulangerie Bonapriso sells loaves at 500 FCFA with a 1,000 FCFA delivery fee, this function prices any order — one piece of logic, reused everywhere.

## Control flow: decisions

\`\`\`js
function deliveryMessage(total) {
  if (total >= 10000) {
    return "Free delivery!";
  } else {
    return "Delivery: 1000 FCFA";
  }
}
\`\`\`

Note \`===\` for comparison (never a single \`=\`, which assigns). Conditions plus functions plus variables: that combination is most of programming.

## Learn it the AI-native way

Type these examples yourself into the browser console (F12 → Console) — typing builds memory that pasting never will. Then ask your AI assistant for five small exercises ("write a function that…") and solve them *before* looking at its solutions. When your answer differs, ask it to compare the two approaches and explain the trade-offs.

**Your task:** Write a file \`pricing.js\` with two functions: \`orderTotal(pricePerItem, quantity)\` and \`deliveryMessage(total)\` (free delivery at or above 10,000 FCFA). Test both in the console with at least three different orders, and commit the file with a screenshot of your console output.`,
            aiPrompt:
              "This lesson introduces const/let, functions with parameters and return values, and if/else, using FCFA-priced bakery order calculations as examples. Generate small practice exercises on request, but make the student attempt each one before revealing a solution. Watch for = vs === confusion.",
          },
          {
            title: "Arrays, Objects & Loops",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Model real-world data with arrays and objects, including nesting.",
              "Access and update properties with dot and bracket notation.",
              "Iterate with for...of and transform data with map and filter.",
              "Combine these tools to answer questions about a dataset.",
            ],
            content: `Real applications are mostly data plus transformations. A bakery's menu, a clinic's appointments, a shop's orders — in JavaScript these become arrays of objects, and your job is to loop over them, filter them, and reshape them.

## Objects: labelled data

\`\`\`js
const product = {
  name: "Pain au chocolat",
  price: 600,
  inStock: true,
};
console.log(product.price); // 600
\`\`\`

## Arrays of objects: real datasets

\`\`\`js
const menu = [
  { name: "Baguette", price: 350, inStock: true },
  { name: "Croissant", price: 500, inStock: false },
  { name: "Pain au chocolat", price: 600, inStock: true },
];
\`\`\`

This shape — an array of similar objects — is what nearly every API on the internet returns. Get comfortable with it now and Module 4's databases will feel familiar.

## Loops and transformations

\`\`\`js
for (const item of menu) {
  console.log(item.name + " - " + item.price + " FCFA");
}

const available = menu.filter((item) => item.inStock);
const names = menu.map((item) => item.name);
\`\`\`

\`filter\` keeps items that pass a test; \`map\` transforms each item into something new. These two methods appear in almost every React component you will write in Module 3, so invest the practice time now.

## Reading data aloud

A powerful habit: before writing code, say the question in plain words — "I want the names of in-stock items under 600 FCFA" — then translate word by word: *in-stock under 600* is a \`filter\`, *names* is a \`map\`. If your chain of methods misbehaves, \`console.log\` after each step, or paste the code and the actual output into your AI assistant and ask it to trace the data through each stage.

**Your task:** Create \`menu.js\` with an array of at least six products (name, price, inStock, category). Write code that (1) prints every product, (2) builds an array of in-stock products, (3) builds an array of just the names of products under 500 FCFA. Commit the file with the console output in a comment at the bottom.`,
            aiPrompt:
              "This lesson covers arrays, objects, for...of, filter and map with a bakery menu dataset. Teach the 'say the question in plain words, then translate' technique. If students struggle with arrow functions inside filter/map, unpack them into named functions first.",
          },
          {
            title: "The DOM & Events: Making Pages Interactive",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Explain what the DOM is and how JavaScript reaches into it.",
              "Select elements with querySelector and update their content and classes.",
              "Handle clicks and form input with addEventListener.",
              "Render an array of data into HTML dynamically.",
            ],
            content: `The DOM (Document Object Model) is the browser's live, in-memory version of your HTML. JavaScript can reach into it, read it, and change it — which is how a static page becomes an application.

## Selecting and changing elements

\`\`\`js
const heading = document.querySelector("h1");
heading.textContent = "Fresh bread, every morning";

const orderBtn = document.querySelector("#order-btn");
orderBtn.classList.add("highlighted");
\`\`\`

\`querySelector\` uses the same selectors as CSS — knowledge you already have. Use \`textContent\` for text (safe) rather than \`innerHTML\` for anything a user typed (which risks script injection).

## Events: responding to the user

\`\`\`js
orderBtn.addEventListener("click", () => {
  document.querySelector("#status").textContent = "Order received!";
});
\`\`\`

Everything interactive on the web — menus, carts, form validation — is event listeners updating the DOM. That is the whole trick.

## Rendering data into the page

Combine this with Module 2's arrays and your menu data can draw its own HTML:

\`\`\`js
const list = document.querySelector("#menu-list");
for (const item of menu) {
  const li = document.createElement("li");
  li.textContent = item.name + " - " + item.price + " FCFA";
  list.appendChild(li);
}
\`\`\`

Change the array, re-run the loop, and the page updates. Hold onto this idea — *UI as a function of data* — because React (Module 3) is built entirely on it.

## Debugging DOM code

The most common beginner error is \`null\`: your script ran before the element existed. Put your \`<script>\` tag at the end of \`<body>\` (or use the \`defer\` attribute). When an event listener seems dead, \`console.log("clicked")\` inside it first — confirm the listener fires before debugging what it does. Describe stuck moments to your AI assistant with the exact error and the relevant HTML, not just "it doesn't work".

**Your task:** Add interactivity to your business site: render your \`menu.js\` products into the page as cards using JavaScript, and add a button per product that shows "Added to order" plus a running order total in FCFA. Commit and push so it deploys to your GitHub Pages URL.`,
            aiPrompt:
              "This lesson covers DOM selection (querySelector), events (addEventListener), and rendering an array of products into the page. The recurring bug is scripts running before the DOM loads — check script placement/defer first. Reinforce 'UI as a function of data' as preparation for React.",
          },
          {
            title: "Fetch, JSON & Debugging with AI",
            type: "task",
            duration: "45 min",
            objectives: [
              "Explain what an API is and read JSON confidently.",
              "Fetch data from a public API with async/await.",
              "Handle loading and error states so failures don't break the page.",
              "Run a disciplined AI-assisted debugging loop on a real bug.",
            ],
            content: `Almost every app you will be paid to build talks to an API: mobile money confirmations, weather data, product catalogues, AI models. The browser's \`fetch\` function is how JavaScript makes those calls, and JSON is the format the data arrives in.

## JSON: JavaScript's data format

JSON looks like the objects and arrays you already know — \`{ "name": "Baguette", "price": 350 }\` — just with quoted keys. When you can read JavaScript objects, you can read JSON.

## Fetching data

\`\`\`js
async function loadUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const users = await response.json();
    renderUsers(users);
  } catch (error) {
    document.querySelector("#status").textContent =
      "Could not load data. Check your connection and retry.";
  }
}
\`\`\`

\`await\` pauses until the network answers. The \`try/catch\` matters enormously in our context: on a 3G connection in Bafoussam, requests *will* fail sometimes, and professional code shows a helpful message instead of a blank screen.

## The AI debugging loop

When code breaks, follow this exact loop rather than guessing:

1. **Read the error yourself** — Console tab, note the message and line number.
2. **Inspect reality** — Network tab: did the request happen? What status? What body?
3. **Brief your assistant** — paste the code, the exact error, and what you expected. Precise briefs get precise fixes.
4. **Understand before applying** — ask "why did this fix work?" until you could explain it to a classmate.

Engineers who skip step 4 stay dependent; engineers who do it get faster every week. That difference is what separates a 50,000 FCFA freelancer from a 500,000 FCFA one.

**Your task:** Build a page \`directory.html\` that fetches users from jsonplaceholder.typicode.com/users and renders each as a card (name, email, city). It must show "Loading..." while fetching and a friendly error message if the request fails (test by disabling your network in DevTools). Deploy it on your GitHub Pages site and submit the live URL.`,
            aiPrompt:
              "This lesson covers fetch with async/await, JSON, loading/error states, and a four-step AI debugging loop (read error, check Network tab, brief precisely, understand the fix). Refuse to hand over fixes until the student has shared the exact error text and what the Network tab shows.",
          },
        ],
      },
      // ─────────────────────────────────────────────────────────────
      // Module 3: React & Modern Frontend
      // ─────────────────────────────────────────────────────────────
      {
        title: "React & Modern Frontend",
        description:
          "The most in-demand frontend library in the world, taught project-first: components, props, state, real forms and lists, and a deployed React app on Vercel by the end of the module.",
        lessons: [
          {
            title: "Components & Props: Thinking in React",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Scaffold a React project with Vite and navigate its structure.",
              "Write function components that return JSX.",
              "Pass data into components with props.",
              "Break a page design into a sensible component tree.",
            ],
            content: `React is the library behind Facebook, Airbnb, Jumia's storefront and thousands of the job posts you will apply to. Its core idea is one you already met: UI is a function of data. Instead of manually poking the DOM, you describe what the page should look like for the current data, and React updates the browser for you.

## Start a project with Vite

\`\`\`bash
npm create vite@latest bakery-app -- --template react
cd bakery-app
npm install
npm run dev
\`\`\`

Vite gives you a dev server with instant reload. The file that matters first is \`src/App.jsx\`.

## Components: functions that return UI

\`\`\`jsx
function ProductCard({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{price} FCFA</p>
    </div>
  );
}

function App() {
  return (
    <main>
      <ProductCard name="Baguette" price={350} />
      <ProductCard name="Croissant" price={500} />
    </main>
  );
}
\`\`\`

JSX looks like HTML inside JavaScript — with two differences you will hit immediately: \`className\` instead of \`class\`, and curly braces \`{}\` to embed JavaScript values.

## Props: data flowing down

\`ProductCard\` is written once and reused with different props, exactly like a function is reused with different arguments. This is why teams love React: build a card, a button, a navbar once; use them everywhere.

## Thinking in components

Take any page — the bakery site, WhatsApp Web, your bank's app — and draw boxes around repeated or self-contained pieces: Header, ProductList, ProductCard, Footer. That sketch *is* your component tree. Do this on paper before coding; ask your AI assistant to critique your breakdown ("is ProductList doing too much?") before you write a line.

**Your task:** Scaffold \`bakery-app\` with Vite. Build \`Header\`, \`ProductCard\` and \`Footer\` components, and render at least four ProductCards with different props from an array using map. Push the project to a new GitHub repository.`,
            aiPrompt:
              "This lesson introduces React with Vite: function components, JSX (className, curly braces), and props, rebuilding the bakery site as components. Common early errors: forgetting to return JSX, class vs className, and missing key props when mapping. Encourage sketching the component tree before coding.",
          },
          {
            title: "State & Events: Apps That Respond",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Explain what state is and how it differs from props.",
              "Use the useState hook to store and update values.",
              "Handle clicks and input changes with event handlers in JSX.",
              "Trace a state update from event to re-render.",
            ],
            content: `Props flow *into* a component; state lives *inside* it and changes over time — a cart total, a form field, an open/closed menu. When state changes, React re-renders the component with the new values. That single loop (event → state update → re-render) is the engine of every React app.

## useState

\`\`\`jsx
import { useState } from "react";

function OrderCounter({ price }) {
  const [quantity, setQuantity] = useState(0);

  return (
    <div>
      <p>{quantity} loaves - {quantity * price} FCFA</p>
      <button onClick={() => setQuantity(quantity + 1)}>Add</button>
      <button onClick={() => setQuantity(Math.max(0, quantity - 1))}>
        Remove
      </button>
    </div>
  );
}
\`\`\`

Two rules that prevent 80% of beginner bugs:

1. **Never mutate state directly.** \`quantity = 5\` does nothing visible; only \`setQuantity(5)\` triggers a re-render.
2. **The displayed value is *derived* from state.** You do not update the total on screen — you update \`quantity\`, and the total \`{quantity * price}\` recomputes itself.

## Events in JSX

Handlers attach right in the markup: \`onClick\`, \`onChange\`, \`onSubmit\`. Pass a function, do not call it: \`onClick={handleAdd}\` not \`onClick={handleAdd()}\` — the second runs immediately on render, a classic trap.

## Trace before you trust

When AI generates a stateful component for you, trace it aloud before accepting: "User clicks Add → \`setQuantity(1)\` → React re-renders → paragraph shows 1 loaf, 350 FCFA." If you cannot narrate the loop, you do not own the code yet — ask your assistant to walk through the render cycle step by step until you can.

**Your task:** Add a working cart to \`bakery-app\`: each ProductCard gets Add/Remove buttons, and a CartSummary component shows the total item count and total price in FCFA, updating live. Commit with a short note in the README explaining where the state lives and why.`,
            aiPrompt:
              "This lesson covers useState and event handling: the event → setState → re-render loop, never mutating state directly, deriving displayed values from state. Use the bakery cart as the example. Make students narrate a full update cycle aloud before accepting AI-generated component code.",
          },
          {
            title: "Lists, Forms & Conditional UI",
            type: "ai",
            duration: "45 min",
            objectives: [
              "Render dynamic lists with map and stable keys.",
              "Build controlled form inputs bound to state.",
              "Show, hide and swap UI with conditional rendering.",
              "Lift state up when two components need the same data.",
            ],
            content: `Real product interfaces are made of exactly three patterns: lists of data, forms that collect input, and UI that appears or changes based on conditions. Master these and you can build the front end of a booking system, a shop, or a dashboard.

## Lists with keys

\`\`\`jsx
{products.map((p) => (
  <ProductCard key={p.id} name={p.name} price={p.price} />
))}
\`\`\`

The \`key\` tells React which card is which between re-renders. Use a stable id, never the array index, or reordering will cause strange bugs.

## Controlled forms

In React, the input's value lives in state and every keystroke updates it:

\`\`\`jsx
const [customerName, setCustomerName] = useState("");

<input
  value={customerName}
  onChange={(e) => setCustomerName(e.target.value)}
  placeholder="Your name"
/>
\`\`\`

Because state always holds the current value, validating, clearing or submitting the form is trivial — one source of truth.

## Conditional rendering

\`\`\`jsx
{cart.length === 0 ? (
  <p>Your basket is empty.</p>
) : (
  <CartSummary items={cart} />
)}
{isSubmitted && <p>Order received! We will call you to confirm.</p>}
\`\`\`

Empty states, success messages, loading spinners — all conditional rendering. Clients notice this polish immediately; it is the difference between a demo and a product.

## Lifting state up

When the ProductCards and the CartSummary both need the cart, the cart state must live in their *shared parent* (App) and flow down as props, with handler functions passed down for children to call. This "lift state to the common ancestor" move is the most important architectural habit in React — ask your AI assistant to review where your state lives and justify its placement.

**Your task:** Add an order form to \`bakery-app\` (name, phone, quarter/neighbourhood) with controlled inputs, a validation message if the phone number is empty, and a confirmation message on submit that summarises the cart in FCFA. Empty carts must show a friendly empty state. Commit and push.`,
            aiPrompt:
              "This lesson covers list rendering with stable keys, controlled form inputs, conditional rendering (empty states, success messages), and lifting state up to a shared parent. The bakery order form is the running example. Challenge students to justify where each piece of state lives.",
          },
          {
            title: "Build & Deploy: Vite to Vercel",
            type: "task",
            duration: "45 min",
            objectives: [
              "Explain what a production build is and run one with Vite.",
              "Deploy a React app to Vercel connected to a GitHub repository.",
              "Verify a deployment on a real phone and fix what breaks.",
              "Present a deployed app professionally in the README and online.",
            ],
            content: `Time to ship. Vercel is the industry-standard host for React apps: it connects to your GitHub repository, builds on every push, and serves your app on a fast global network — free at your scale. From today, "done" means "deployed".

## Production builds

\`npm run dev\` runs a development server; \`npm run build\` produces an optimised \`dist/\` folder — minified, bundled, ready for real users on slow connections. Run the build locally first: if it fails on your machine, it will fail on Vercel, and the local error message is easier to read.

## Deploying

1. Push your latest \`bakery-app\` to GitHub.
2. Sign in at vercel.com **with your GitHub account**.
3. Click **Add New → Project**, import \`bakery-app\`.
4. Vercel auto-detects Vite. Accept the defaults and click **Deploy**.

Two minutes later you have a URL like \`bakery-app-yourname.vercel.app\` — and every push to \`main\` now deploys automatically. This is continuous deployment, the same workflow used by professional teams, and being fluent in it is a genuine line on your CV.

## The real test

Open the URL on your own phone, on mobile data — not just your laptop on Wi-Fi. Check: does it load in reasonable time? Do images render? Does the order form work with the phone keyboard? Fix what you find; this habit of testing in your users' real conditions will set you apart with clients whose customers are all on Android + 3G.

## Package the win

Update the README: one-line description, live URL, screenshot, tech stack (React, Vite, Vercel), and what you would build next. Then post the link publicly. A deployed React app with a clean repo is a legitimate portfolio piece — comparable freelance builds for small businesses in Douala or Yaoundé bill from 150,000 to 400,000 FCFA.

**Your task:** Deploy \`bakery-app\` to Vercel, test it on a real phone and fix at least one issue you find, polish the README (description, live URL, screenshot, stack), and post the live link on LinkedIn or X. Submit the live URL, the repo URL and the post link.`,
            aiPrompt:
              "This lesson is a deployment task: npm run build, importing the GitHub repo into Vercel, and verifying on a real phone. Debug build failures locally first — the Vercel log usually mirrors the local error. Insist the student tests on mobile data and fixes at least one real issue before submitting.",
          },
        ],
      },
      // ─────────────────────────────────────────────────────────────
      // Module 4: Backend, APIs & Databases
      // ─────────────────────────────────────────────────────────────
      {
        title: "Backend, APIs & Databases",
        description:
          "Go full-stack: run JavaScript on the server with Node.js, design and build a REST API with Express, store real data in PostgreSQL, and wire it all together with authentication basics.",
        lessons: [
          {
            title: "Node.js & npm: JavaScript Beyond the Browser",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Explain what Node.js is and how server-side JS differs from browser JS.",
              "Initialise a project with npm and manage dependencies via package.json.",
              "Write and run a Node script that reads a file and processes data.",
              "Use npm scripts to standardise how a project is run.",
            ],
            content: `So far your JavaScript has run inside a browser. Node.js runs the same language on a server — or your laptop's terminal — where it can read files, talk to databases, and answer HTTP requests. One language across the whole stack is why JavaScript developers are so employable: you already know the syntax; today you learn the new environment.

## What changes outside the browser

No \`document\`, no \`window\`, no DOM. Instead you get file access, network servers, and \`process\` (environment variables, arguments). Check your install with \`node --version\` (from your Phase 2 environment setup), then try the REPL: type \`node\`, then any JavaScript.

## npm: the package manager

\`\`\`bash
mkdir bakery-api && cd bakery-api
npm init -y
npm install express
\`\`\`

\`npm init -y\` creates \`package.json\` — your project's identity card: name, dependencies, scripts. \`npm install\` downloads packages into \`node_modules/\` (never commit that folder; your \`.gitignore\` should exclude it — \`package.json\` plus \`package-lock.json\` lets anyone recreate it with one command).

## Your first Node script

\`\`\`js
// stats.js
const fs = require("fs");
const orders = JSON.parse(fs.readFileSync("orders.json", "utf8"));
const revenue = orders.reduce((sum, o) => sum + o.total, 0);
console.log("Orders: " + orders.length + ", Revenue: " + revenue + " FCFA");
\`\`\`

Run it with \`node stats.js\`. Small scripts like this are quietly lucrative: a script that turns a shop's messy order export into a daily revenue summary is a service SMEs will pay for, long before you build them a full app.

## npm scripts

Add \`"start": "node stats.js"\` under \`"scripts"\` in package.json, and \`npm start\` runs it. Every professional project you join will define its commands this way.

**Your task:** Create the \`bakery-api\` project with npm, write \`orders.json\` containing at least five orders (id, customer, items, total) and a \`stats.js\` that prints order count, total revenue in FCFA, and the largest single order. Add an npm start script, a .gitignore excluding node_modules, and push to GitHub.`,
            aiPrompt:
              "This lesson introduces Node.js and npm: package.json, installing dependencies, .gitignore for node_modules, and a file-reading script computing revenue stats in FCFA. Clarify browser-vs-Node environment differences when confusion appears (no document/window). Frame small data scripts as a real early income opportunity.",
          },
          {
            title: "Building a REST API with Express",
            type: "ai",
            duration: "45 min",
            objectives: [
              "Explain REST conventions: resources, HTTP methods and status codes.",
              "Build GET and POST endpoints with Express, including route parameters.",
              "Parse JSON request bodies and validate input.",
              "Test endpoints with a REST client and read server logs.",
            ],
            content: `An API is a contract: send this request, get that response. In Module 2 you *consumed* APIs with fetch; today you *build* one. Express is Node's most-used web framework — minimal, everywhere in job adverts, and simple enough to learn in an afternoon.

## REST in one paragraph

Organise your API around resources (nouns): \`/products\`, \`/orders\`. Use HTTP methods as verbs: GET reads, POST creates, PUT/PATCH updates, DELETE removes. Answer with status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error. Follow these conventions and any developer — or AI assistant — can use your API without a meeting.

## A working API

\`\`\`js
const express = require("express");
const app = express();
app.use(express.json()); // parse JSON bodies

let products = [
  { id: 1, name: "Baguette", price: 350 },
  { id: 2, name: "Croissant", price: 500 },
];

app.get("/products", (req, res) => res.json(products));

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== "number") {
    return res.status(400).json({ error: "name and price required" });
  }
  const product = { id: products.length + 1, name, price };
  products.push(product);
  res.status(201).json(product);
});

app.listen(3000, () => console.log("API on http://localhost:3000"));
\`\`\`

Notice the validation in POST: never trust incoming data. A 400 with a clear message is professional; a crash is not.

## Testing it

Use the Thunder Client extension in VS Code (or curl) to hit each endpoint. GET \`/products\`, GET \`/products/99\` (expect 404), POST with a body, POST with a *bad* body (expect 400). Testing the failure paths is what separates engineers from tutorial-followers. When something misbehaves, your terminal's server logs are your first stop — add \`console.log\` in the handler and re-send the request.

**Your task:** Extend \`bakery-api\` with an \`/orders\` resource: GET /orders, GET /orders/:id, and POST /orders (validating that items is a non-empty array and phone is present). Include a \`requests.http\` or Thunder Client collection showing all endpoints tested, including the error cases. Push to GitHub.`,
            aiPrompt:
              "This lesson covers building a REST API with Express: resource routes, GET/POST, route params, express.json(), input validation, and status codes (200/201/400/404). Students test with Thunder Client or curl. Push them to test failure paths (404s, invalid bodies), not just happy paths.",
          },
          {
            title: "SQL & PostgreSQL Fundamentals",
            type: "ai",
            duration: "45 min",
            objectives: [
              "Explain why applications use databases instead of files or memory.",
              "Design simple tables with appropriate types, primary and foreign keys.",
              "Write SELECT, INSERT, UPDATE and DELETE with WHERE clauses.",
              "Join two tables to answer a real business question.",
            ],
            content: `Your Express API loses all its data on every restart, because arrays live in memory. Real applications keep data in a database — and PostgreSQL is the one you should learn: free, rock-solid, and the default choice of startups worldwide. SQL, its query language, has been a bankable skill for forty years and will outlive every framework in this course.

## Tables: spreadsheets with rules

\`\`\`sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

\`PRIMARY KEY\` uniquely identifies each row; \`REFERENCES\` (a foreign key) links an order to its product and stops you recording an order for a product that does not exist. The database enforces these rules even when your code has bugs — that is the point.

## The four core statements

\`\`\`sql
INSERT INTO products (name, price) VALUES ('Baguette', 350);
SELECT * FROM products WHERE price < 500 ORDER BY price;
UPDATE products SET price = 400 WHERE id = 1;
DELETE FROM orders WHERE id = 7;
\`\`\`

Golden rule: write the \`WHERE\` clause *first* when updating or deleting. An UPDATE without WHERE changes every row — a mistake made once and remembered forever.

## Joins: the superpower

"Which products earn the most revenue?" needs both tables:

\`\`\`sql
SELECT p.name, SUM(p.price * o.quantity) AS revenue
FROM orders o
JOIN products p ON p.id = o.product_id
GROUP BY p.name
ORDER BY revenue DESC;
\`\`\`

Translating a business question into a JOIN is a skill clients pay real money for. Practise by asking your AI assistant to generate questions about your schema, writing the SQL yourself, then comparing — and always run its SQL suggestions against your own database to verify before trusting them.

**Your task:** Install PostgreSQL locally (or create a free Neon or Supabase database), create the products and orders tables, insert at least five products and eight orders, and write four queries: all orders with product names, revenue per product, orders from the last day, and the top-spending customer. Save them in \`queries.sql\` and push it to your repo.`,
            aiPrompt:
              "This lesson covers PostgreSQL fundamentals: CREATE TABLE with primary/foreign keys, INSERT/SELECT/UPDATE/DELETE, WHERE clauses, and JOIN with GROUP BY for revenue questions on a bakery schema. Warn hard about UPDATE/DELETE without WHERE. Have students verify AI-generated SQL by running it, not by reading it.",
          },
          {
            title: "Connecting API to Database + Auth Basics",
            type: "task",
            duration: "45 min",
            objectives: [
              "Query PostgreSQL from Express using parameterised queries.",
              "Keep secrets in environment variables, out of Git.",
              "Explain SQL injection and how parameterised queries prevent it.",
              "Describe how JWT-based authentication protects an endpoint.",
            ],
            content: `Today the pieces click together: your Express API stops using in-memory arrays and starts reading and writing PostgreSQL. This endpoint-to-database wiring is the everyday work of backend development — and of most freelance backend contracts.

## Querying from Node

\`\`\`js
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id");
  res.json(result.rows);
});

app.post("/orders", async (req, res) => {
  const { customerName, productId, quantity } = req.body;
  const result = await pool.query(
    "INSERT INTO orders (customer_name, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    [customerName, productId, quantity]
  );
  res.status(201).json(result.rows[0]);
});
\`\`\`

Those \`$1, $2, $3\` placeholders are **parameterised queries** — non-negotiable. Gluing user input into SQL strings enables SQL injection, the attack that has emptied real databases. Any AI-generated code that concatenates input into SQL must be rejected on sight; make checking for this part of your code-review reflex.

## Secrets stay out of Git

The database URL contains a password, so it lives in a \`.env\` file loaded via \`process.env\` — and \`.env\` goes straight into \`.gitignore\`. Committing credentials to GitHub is one of the most common (and most Googleable) beginner disasters; do not join that club.

## Auth in one idea: JWT

How does an API know who is calling? At login, the server verifies the password and signs a **JWT** (JSON Web Token) — a tamper-evident string encoding the user's id. The client sends it back on every request in the \`Authorization: Bearer <token>\` header; middleware verifies the signature and rejects intruders with 401. You will implement full auth in the Build Studio; for now, be able to draw the flow — login, token issued, token sent, token verified — on paper, because interviewers in Douala and remote screenings alike love this question.

**Your task:** Convert \`bakery-api\` so GET /products, GET /orders and POST /orders all use PostgreSQL with parameterised queries, secrets in \`.env\` (with a committed \`.env.example\`), and errors returning proper status codes. Test all endpoints with Thunder Client, and add a short AUTH.md explaining the JWT flow in your own words with a simple diagram. Push everything.`,
            aiPrompt:
              "This lesson connects Express to PostgreSQL with the pg Pool, parameterised queries ($1 placeholders), .env secrets, and the conceptual JWT flow (login → token → Authorization header → verify middleware). Reject any code that concatenates user input into SQL. The deliverable includes an AUTH.md explaining JWT in the student's own words.",
          },
        ],
      },
      // ─────────────────────────────────────────────────────────────
      // Module 5: AI-Assisted Engineering Practice
      // ─────────────────────────────────────────────────────────────
      {
        title: "AI-Assisted Engineering Practice",
        description:
          "Turn AI assistance from a crutch into a superpower: prompt patterns for code, critical review of AI output, professional testing and debugging workflows, and the Git collaboration habits real teams run on.",
        lessons: [
          {
            title: "Pair-Programming with an AI Assistant",
            type: "ai",
            duration: "35 min",
            objectives: [
              "Structure coding prompts with context, constraints and expected output.",
              "Apply core prompt patterns: spec-first, example-driven, step-decomposition.",
              "Keep control of architecture while delegating implementation details.",
              "Recognise when AI assistance is hurting rather than helping.",
            ],
            content: `You have used AI assistants throughout this programme. Now we make the collaboration professional. The difference between a beginner and an AI-native engineer is not *whether* they use AI — it is *who is driving*. You set the architecture, the constraints and the standards; the assistant types fast.

## Anatomy of a good coding prompt

Weak: "make a booking form in react".

Strong: "I'm building a clinic booking app in React (Vite). Write a BookingForm component with controlled inputs for patient name, phone (Cameroon format, 9 digits starting with 6), and preferred date. On submit, POST to /api/bookings and show inline validation errors. Match the code style of the component I'm pasting below. Don't add any libraries."

The strong prompt has the three ingredients that matter: **context** (stack, purpose, existing code), **constraints** (validation rules, no new libraries, style to match), **expected output** (one component, specific behaviour).

## Three patterns to practise

1. **Spec-first**: describe behaviour precisely before asking for code — writing the spec often reveals you had not decided what you wanted.
2. **Example-driven**: paste one component you like and ask for the next one "in this style". Consistency across a codebase is a mark of professionalism.
3. **Step-decomposition**: for anything non-trivial, first ask "list the steps to implement X, no code yet", edit the plan yourself, then request code step by step. You stay the architect.

## Anti-patterns to catch in yourself

Pasting an error and applying the fix without reading it. Accepting a 200-line generation you cannot summarise. Re-prompting five times instead of thinking for two minutes. The test is simple and brutal: *could you explain every line to a client or interviewer?* If not, stop and close the gap — in Cameroon's growing tech scene, interviews increasingly probe whether you understand your own portfolio.

**Your task:** Take one feature you built this phase and re-implement a small part of it using the step-decomposition pattern: save the prompt, the AI's plan, your edits to the plan, and the final code in a file \`ai-pairing-log.md\` in your repo, ending with three sentences on what you would prompt differently next time.`,
            aiPrompt:
              "This lesson teaches professional prompting for code: context + constraints + expected output, and the spec-first, example-driven, and step-decomposition patterns. When the student practises on you, critique their prompt structure before answering it, and refuse to produce large code dumps without an agreed plan.",
          },
          {
            title: "Reading & Reviewing AI-Generated Code",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Read unfamiliar code systematically: entry points, data flow, side effects.",
              "Apply a review checklist covering correctness, security and edge cases.",
              "Spot the characteristic failure modes of AI-generated code.",
              "Decide deliberately whether to accept, edit or reject a generation.",
            ],
            content: `AI assistants produce code that *looks* right at a glance — confident, well-formatted, plausibly named. Your professional value increasingly lies in being the human who can tell whether it *is* right. Reviewing code is a learnable skill, and you will use it on AI output daily and on teammates' pull requests for the rest of your career.

## How to read code you didn't write

Do not read top to bottom like a novel. Instead: (1) find the entry point — the function that gets called first; (2) follow one concrete input through the code, saying the values aloud ("a POST arrives with quantity: 2..."); (3) note every side effect — database writes, network calls, state changes. Ten minutes of tracing beats an hour of skimming.

## A practical review checklist

- **Correctness**: does it handle the empty case? The wrong-type case? What happens with quantity 0, a 5,000,000 FCFA order, a name containing an apostrophe?
- **Security**: any user input concatenated into SQL or HTML? Secrets hard-coded? Missing auth checks on sensitive routes?
- **Honesty**: does it *actually* do what was asked, or something adjacent that passes a quick glance?
- **Fit**: does it match the project's existing patterns, or import three new libraries nobody agreed to?

## AI-specific failure modes

Learn these patterns; you will see all of them: **hallucinated APIs** (methods or packages that do not exist — always check the docs for unfamiliar imports); **silently swallowed errors** (empty catch blocks that hide failures); **over-engineering** (a class hierarchy where a function would do); **stale idioms** (outdated React patterns from old training data); and **fake completeness** (a TODO or a stub hidden in the middle of otherwise finished-looking code).

## The verdict

Every review ends in a decision: accept, edit, or reject-and-reprompt. Practise saying *why* in one sentence — that sentence is exactly what you will write on teammates' pull requests in Lesson 4 and in every job you hold.

**Your task:** Prompt your AI assistant for a moderately complex function (for example: "validate and normalise a Cameroonian phone number, handling +237, spaces and common typos"). Review it against the checklist above and write \`code-review.md\` documenting at least three genuine issues or improvements you found, the questions you asked, and your final verdict with the corrected code.`,
            aiPrompt:
              "This lesson teaches systematic review of AI-generated code: tracing data flow, a correctness/security/honesty/fit checklist, and AI failure modes (hallucinated APIs, swallowed errors, over-engineering, hidden stubs). For the task, deliberately generate code with 2-3 subtle flaws and let the student find them; confirm or correct their findings afterwards.",
          },
          {
            title: "Testing & Debugging Workflows",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Explain why automated tests matter and what makes a good test case.",
              "Write unit tests for pure functions with Vitest.",
              "Use AI to propose edge cases, then verify tests actually catch bugs.",
              "Apply a systematic debugging method: reproduce, isolate, fix, verify.",
            ],
            content: `Tests are how professionals change code without fear — and how you verify AI-generated code at scale instead of eyeballing it. A test is just code that calls your code and checks the answer. Once written, it re-checks your entire project in seconds, every time, forever.

## Your first tests with Vitest

Vitest is the standard test runner for Vite projects (\`npm install -D vitest\`, then add \`"test": "vitest"\` to your scripts):

\`\`\`js
// orderTotal.test.js
import { describe, it, expect } from "vitest";
import { orderTotal } from "./orderTotal.js";

describe("orderTotal", () => {
  it("adds delivery fee below the free-delivery threshold", () => {
    expect(orderTotal(500, 4)).toBe(3000);
  });
  it("gives free delivery at 10000 FCFA or more", () => {
    expect(orderTotal(500, 20)).toBe(10000);
  });
  it("rejects negative quantities", () => {
    expect(() => orderTotal(500, -1)).toThrow();
  });
});
\`\`\`

Run \`npm test\` and watch them pass. Notice the third test: the *unhappy path*. Beginners test that things work; professionals test that things fail correctly.

## AI as your edge-case generator

Ask your assistant: "List 10 edge cases for a function that computes bakery order totals with a free-delivery threshold." It will suggest cases you missed — zero quantity, huge orders, decimal prices. But **verify your tests test something**: deliberately break the function (change \`>=\` to \`>\`) and confirm a test fails. A test suite that never fails is decoration.

## Debugging as a method

When a bug appears, resist the urge to change things at random. The professional loop: **Reproduce** it reliably (exact steps, exact input). **Isolate** — cut the problem in half repeatedly with console.log or the debugger until you can point at the line. **Fix** the cause, not the symptom. **Verify** by re-running the reproduction *and* the test suite, then write a test that would have caught it. That last step is how good engineers stop fixing the same bug twice.

**Your task:** Add Vitest to your bakery project and write at least six tests for your pricing/validation functions, including two unhappy-path tests. Break the function on purpose, screenshot the failing output, restore it, and commit tests plus screenshot with the message "add test suite".`,
            aiPrompt:
              "This lesson covers unit testing with Vitest (describe/it/expect, happy and unhappy paths) and the reproduce-isolate-fix-verify debugging loop. Encourage using AI to brainstorm edge cases, then verifying tests by deliberately breaking the code. The mantra: a test suite that never fails is decoration.",
          },
          {
            title: "Git Collaboration: Branches, PRs & Code Review",
            type: "task",
            duration: "45 min",
            objectives: [
              "Create feature branches and keep main always deployable.",
              "Open a pull request with a clear title and description.",
              "Give and receive constructive code review comments.",
              "Resolve a simple merge conflict without panic.",
            ],
            content: `Every software team on earth — from two freelancers in Buea to engineering orgs of thousands — coordinates through branches and pull requests. Employers checking your GitHub can tell within a minute whether you have actually worked this way. After today, you will have.

## The feature-branch workflow

Rule one: \`main\` always works and is always deployable. All changes happen on branches:

\`\`\`bash
git checkout -b feature/order-form
# ...commit your work in small, described steps...
git push -u origin feature/order-form
\`\`\`

Then on GitHub, open a **pull request** (PR): a proposal to merge your branch into main, with a description of *what* changed and *why*. A good PR description takes three minutes and saves your reviewer thirty: what it does, how you tested it, a screenshot if the UI changed.

## Code review: the conversation

Reviewers comment on specific lines; authors respond, push fixes, and the PR updates automatically. Review culture in one sentence: **comment on the code, never the person**, and prefer questions to commands — "What happens here if the cart is empty?" lands better than "this is wrong", and is more often useful. When reviewing, use everything from this module: trace the data flow, check unhappy paths, run the code. Your AI assistant makes a solid pre-reviewer — ask it to review your diff before you request a human — but the judgement calls stay with the humans.

## Merge conflicts, demystified

A conflict just means two branches edited the same lines. Git marks the spot with \`<<<<<<<\` and \`>>>>>>>\`; you pick or combine the versions, delete the markers, commit. That is all it is. Trigger one on purpose today so the first real one (there will be one) is boring.

**Your task:** Pair with a classmate. Each of you: (1) opens a PR from a feature branch on your own project, (2) reviews the *other's* PR leaving at least three substantive line comments, (3) responds to feedback, pushes a fix and merges. Then create and resolve a deliberate merge conflict in your own repo. Submit links to both PRs showing the review conversations.`,
            aiPrompt:
              "This lesson covers the feature-branch workflow: branches, pull requests with good descriptions, constructive line-comment review, and resolving merge conflicts. Students pair up and review each other's PRs. Help them phrase review comments as questions about the code, and de-dramatise conflict markers by walking through one calmly.",
          },
        ],
      },
    ],
  },
  {
    phaseSlug: "build-studio",
    modules: [
      // ─────────────────────────────────────────────────────────────
      // Module 1: Build Sprint
      // ─────────────────────────────────────────────────────────────
      {
        title: "Build Sprint: From Brief to Deployed Product",
        description:
          "Six weeks to a capstone that earns. This module takes you from a realistic client brief to a scoped MVP, through an AI-accelerated build, to a deployed product with documentation a non-developer can follow.",
        lessons: [
          {
            title: "Scoping an MVP from a Client Brief",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Extract functional requirements from a vague, realistic client brief.",
              "Separate must-have from nice-to-have features using MoSCoW prioritisation.",
              "Write user stories with acceptance criteria.",
              "Produce a one-page scope document a client could sign off.",
            ],
            content: `Real clients do not hand you specifications. They say things like: "I run a clinic in Bonamoussadi. Patients call all day to book and my receptionist can't cope. Can you make something?" Turning that sentence into a buildable, priceable plan is the most valuable non-coding skill in freelancing — scope well and projects finish; scope badly and they drag on until the money runs out and the relationship sours.

## From brief to requirements

Interrogate the brief (in real life, interrogate the client — politely). For the clinic: Who books — patients directly, or the receptionist? What defines a slot — doctor, time, service? What happens on a clash? How are patients notified — SMS matters more than email here? What must the clinic staff see each morning? Each answer becomes a requirement; each requirement is something you can estimate, build and test.

## MoSCoW: drawing the MVP line

Sort every feature into **Must** (booking a slot, viewing the day's bookings, preventing double-booking), **Should** (SMS confirmation, cancellation), **Could** (recurring appointments, statistics dashboard), **Won't — this version** (payments, patient records). Your MVP is the Musts, delivered excellently. Everything else is a *future phase you can sell later* — scoping small is not thinking small, it is how professionals de-risk delivery and create repeat business.

## User stories with acceptance criteria

Write each Must as: "As a receptionist, I can see today's appointments in time order, so that I can prepare for each patient." Then acceptance criteria: shows patient name, phone, time, service; empty state when no bookings; loads in under 3 seconds on a phone. Acceptance criteria are your definition of done — and your defence when scope starts creeping.

Draft with your AI assistant by pasting the raw brief and asking it to propose questions you should ask the client — then answer them yourself, in character as the clinic owner. The judgement stays yours.

**Your task:** Choose your capstone from the three project briefs (or an equivalent real client). Produce a one-page scope document: the brief in your own words, MoSCoW table, five to eight user stories with acceptance criteria for the Musts, and explicit out-of-scope items. This document requires mentor approval before you write any code.`,
            aiPrompt:
              "This lesson covers turning a vague client brief into a scoped MVP: requirement-extracting questions, MoSCoW prioritisation, and user stories with acceptance criteria, using a Douala clinic booking brief as the example. Play the client when asked, but push the student to make and justify the scope cuts themselves.",
          },
          {
            title: "Building End-to-End with an AI Workflow",
            type: "task",
            duration: "45 min",
            objectives: [
              "Convert user stories into a milestone plan with vertical slices.",
              "Run a repeatable AI-assisted build loop: plan, generate, review, test, commit.",
              "Keep the app deployed and working from day one, not just at the end.",
              "Track progress visibly and unblock yourself methodically.",
            ],
            content: `You have a signed-off scope. Now you build — and how you structure the work matters as much as how you code. The habits in this lesson are the difference between a capstone finished calmly in week five and a panic in the final weekend.

## Vertical slices, not horizontal layers

Do not spend two weeks on "the backend" before any screen exists. Build one thin slice of real functionality all the way through — form → API → database → confirmation on screen — and deploy it. For the clinic app, slice one is: patient submits a booking and it appears in a database-backed list. Ugly is fine; *end-to-end* is the point. Each slice after that adds one user story. You will always have a working product to show, which changes every mentor conversation from "trust me" to "look".

## The AI build loop

For every slice, run the same loop you trained in Phase 3:

1. **Plan**: ask your assistant to break the story into steps; edit the plan — you are the architect.
2. **Generate**: request code step by step, providing your existing files as context so the style stays consistent.
3. **Review**: apply the Module 5 checklist — trace the data, check unhappy paths, hunt hallucinated APIs.
4. **Test**: add or update tests for the new logic; run the whole suite.
5. **Commit**: small commit, clear message, push — which deploys, because...

## Deploy on day one

Set up Vercel (front end) and a hosted API + database (Render, Railway, or Supabase/Neon) in your *first* session, wired to your repo. Deployment problems found in week one cost an hour; found in week six, they cost the demo.

## Track it or lose it

Create a GitHub Project board with your user stories as issues: To do, In progress, Done. Fifteen minutes stuck on the same error? Run the debugging loop. Forty-five minutes? Write the problem up precisely (what, expected, actual, tried) and post it to your mentor channel — the write-up itself solves half of them.

**Your task:** Set up your capstone repo with a board of issues from your user stories, deploy a walking skeleton (one form, one API endpoint, one database table, live URL) and complete your first vertical slice. Submit the repo link, the board link and the live URL.`,
            aiPrompt:
              "This lesson establishes the capstone build system: vertical slices deployed from day one, the plan-generate-review-test-commit AI loop, GitHub Projects tracking, and escalation rules when stuck. Keep students slicing thin — if a task doesn't end with something visible on the live URL, help them re-slice it.",
          },
          {
            title: "Deploying + Documentation Users Can Follow",
            type: "task",
            duration: "45 min",
            objectives: [
              "Harden a deployment: environment variables, production database, custom domain basics.",
              "Write a README that gets a developer running the project in minutes.",
              "Write a plain-language user guide for a non-technical client.",
              "Verify documentation by having someone else follow it cold.",
            ],
            content: `A product nobody can run, use or maintain is not finished. This week you harden your deployment and write the two documents every professional delivery includes: one for developers, one for the client. Documentation is also quietly a sales tool — a client who receives a clear user guide refers you to other business owners.

## Production readiness pass

Work through this list on your deployed capstone: all secrets in environment variables on the host (nothing sensitive in the repo — audit your Git history, not just the current files); the production database is separate from your development one; the API rejects requests from unknown origins (CORS configured deliberately); forms validate on the server, not only the browser; and the live site works on a mid-range Android phone on mobile data, because that is your user's reality.

## The developer README

Structure that works, in order: project name and one-sentence pitch; screenshot; live URL; tech stack; **Getting started** (clone, install, configure \`.env\` from \`.env.example\`, run — every command copy-pasteable); API endpoints table if relevant; and a short architecture note (three sentences on how the pieces fit). Test it the honest way: clone your own repo into a fresh folder and follow your instructions *exactly*, fixing every step where you had to improvise.

## The user guide

Now the harder audience: the clinic receptionist or bakery owner. Plain language, no jargon, one page or a short PDF with annotated screenshots: how to log in, how to perform the three most common tasks, what to do when something looks wrong, and who to contact. Write it in the language your client actually works in — for many Cameroonian SMEs that means French, and delivering both French and English versions is a professional edge your competitors will skip. AI assistants translate well, but verify the result reads naturally before shipping it.

**Your task:** Complete the production readiness pass, then produce both documents: a README a stranger can follow cold (verified via fresh clone) and a plain-language user guide with screenshots as a PDF. Swap guides with a classmate — each of you follows the other's docs and files at least two improvement issues. Submit the repo, the PDF and the issues you received.`,
            aiPrompt:
              "This lesson covers production hardening (env secrets, separate prod database, CORS, server-side validation, real-phone testing) and two documents: a copy-pasteable developer README and a plain-language client user guide, ideally bilingual French/English. Push for verification by a cold reader, not self-review.",
          },
        ],
      },
      // ─────────────────────────────────────────────────────────────
      // Module 2: Ship Like a Professional
      // ─────────────────────────────────────────────────────────────
      {
        title: "Ship Like a Professional",
        description:
          "The last 10% that clients remember: hardening against errors and edge cases, presenting your work on video like a consultant, and packaging a capstone submission that doubles as a portfolio centrepiece.",
        lessons: [
          {
            title: "Error Handling, Edge Cases & Polish",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Audit an app systematically for unhandled errors and edge cases.",
              "Design helpful failure states: messages, retries, empty states.",
              "Handle slow networks gracefully with loading and offline-aware states.",
              "Apply a final polish pass: copy, spacing, favicons, page titles.",
            ],
            content: `Users never see your elegant code; they see what happens when they type a phone number with spaces, lose signal mid-submit, or open the app before any data exists. The difference between "student project" and "product I'd pay for" lives almost entirely in these moments.

## The edge-case audit

Walk every screen of your capstone asking four questions: What if this is **empty** (no bookings yet, no search results)? What if this is **enormous** (a 60-character name, 200 orders)? What if this **fails** (API down, timeout, 500)? What if the user does something **unexpected** (double-clicks submit, pastes a date in the wrong format, presses back mid-flow)? Log every gap in a GitHub issue labelled \`polish\`. Then ask your AI assistant to attack your app: paste each screen's code and ask "list inputs and situations that would break this" — it is genuinely good at adversarial thinking, and you remain the judge of which findings matter.

## Failure states that respect the user

Every error message should say what happened and what to do next, in human words. "Error 500" is developer graffiti; "We couldn't save your booking — please check your connection and try again. Nothing was charged." is professional. Rules: never show raw stack traces or console jargon to users; disable submit buttons while a request is in flight (prevents the double-order bug that plagues real e-commerce); always offer a retry for network failures — on Cameroonian mobile networks, the retry usually succeeds.

## The polish pass

Final sweep, in one sitting: consistent spacing and alignment on every screen; every page has a real \`<title>\` and a favicon; forms submit on Enter; all placeholder text and lorem ipsum removed; dates and money formatted properly ("12,500 FCFA", not "12500"); and the whole flow tested once more on a real phone. None of these takes ten minutes; together they change how trustworthy your product feels.

**Your task:** Complete the edge-case audit (minimum eight issues filed), fix all crashes and add helpful failure and empty states for your app's three core flows, then finish the polish checklist above. Submit before/after screenshots of your three best fixes and the closed issue list.`,
            aiPrompt:
              "This lesson covers the pre-ship hardening pass: the empty/enormous/fails/unexpected audit, human-friendly error messages with retries, double-submit prevention, and a final polish checklist (titles, favicon, FCFA formatting, real-phone test). When asked, adversarially list ways a pasted screen could break, then let the student prioritise.",
          },
          {
            title: "Demo Videos & Presenting Your Work",
            type: "ai",
            duration: "40 min",
            objectives: [
              "Structure a compelling 3-minute product demo: problem, solution, proof.",
              "Record a clean screen capture with clear narration.",
              "Present technical decisions to a non-technical audience.",
              "Publish and share a demo to maximise professional visibility.",
            ],
            content: `A deployed app is your proof of skill — but a demo video is what people actually watch. Clients in Douala, remote employers in Berlin, and hiring managers skimming LinkedIn will give you ninety seconds before deciding. A tight demo multiplies every other asset you have built; it travels further than your repo ever will.

## The three-act structure

**Act 1 — the problem (30 seconds):** a real person and a real pain. "Clinics in Douala take bookings by phone. Receptionists are overwhelmed, patients wait on hold, and double-bookings upset everyone." No tech yet — make the viewer *want* the solution.

**Act 2 — the solution (90 seconds):** one continuous happy path as a real user: patient books in three taps, receptionist sees the morning list, a clash is prevented live. Narrate benefits, not implementation: say "the receptionist sees new bookings instantly", not "React re-renders on a fetch". Show FCFA amounts and Cameroonian names — authenticity reads as competence.

**Act 3 — the proof (30 seconds):** the live URL on screen, one sentence on the stack ("React, Node and PostgreSQL, deployed on Vercel"), one sentence on what is next, and how to reach you.

## Recording without expensive kit

OBS Studio (free) or Loom's free tier both work. The craft: write your script word for word first — reading a good script sounds far better than improvising; record in a quiet room, phone-earphone mic close to your mouth; capture the browser window alone at a comfortable zoom; do the whole take twice and keep the better one. Speak 20% slower than feels natural. Rehearse the click-path so the cursor never wanders. Keep it under three minutes — ruthlessly.

## Distribution is part of the job

Upload to YouTube (unlisted or public), embed the link at the top of your README, and post it on LinkedIn with a short story: the problem, what you built, what you learned, the live link. Tag TechAscend. Demo posts consistently out-perform text-only posts for inbound freelance enquiries — this is Phase 1's visibility engine, now loaded with real ammunition.

**Your task:** Script, record and publish a demo video of your capstone under three minutes following the three-act structure. Add it to your README, post it on LinkedIn, and submit the video link plus the post link.`,
            aiPrompt:
              "This lesson covers making a sub-3-minute demo video: problem/solution/proof structure, benefit-focused narration for non-technical viewers, scripted recording with OBS or Loom, and distribution via README and LinkedIn. Help students tighten scripts and translate implementation-speak into user benefits.",
          },
          {
            title: "Capstone Submission: Repo Hygiene, README & Live URL",
            type: "task",
            duration: "45 min",
            objectives: [
              "Bring a repository to professional hygiene: history, structure, secrets audit.",
              "Assemble a complete capstone submission against the rubric.",
              "Write a self-assessment identifying strengths and next steps.",
              "Position the finished capstone for income: portfolio, proposals, applications.",
            ],
            content: `This is the final gate of the Build Studio — and the moment your capstone stops being coursework and becomes an asset. Reviewers, employers and clients will all meet your work the same way: repo, README, live URL, video. Today you make that first meeting count.

## Repo hygiene checklist

Work through it top to bottom: a clear repo name and one-line description (with the live URL in the GitHub "About" field); no secrets anywhere in the history — search it with \`git log -p | grep -i\` for keys and passwords, and if you find any, rotate those credentials *now* (removing the file later does not un-leak it); no dead files, commented-out corpses or \`test2-final-FINAL\` folders; a sensible structure a stranger can navigate; issues and board tidied — close what is done, and keep the honest remainder as a public "Roadmap", which reads as professionalism, not failure; and a LICENSE file (MIT is a fine default for portfolio work).

## The submission package

Five items, all public: (1) repo URL with the verified README from last module; (2) live URL, re-tested on mobile data minutes before submitting; (3) demo video linked at the top of the README; (4) user-guide PDF; (5) a one-page self-assessment: which acceptance criteria you met, what you cut and why, the hardest bug and how you beat it, and what you would build in version two. Honest self-assessment is itself assessed — knowing your gaps is a senior trait.

## From capstone to income

Your capstone is a template for paid work. Concretely: add it to your portfolio site with a case-study writeup; identify three real businesses in your city with the same problem your capstone solves and draft a short proposal to each, quoting a realistic range (a booking system for an SME typically lands between 250,000 and 800,000 FCFA depending on scope, with 15,000–40,000 FCFA monthly for hosting and support — recurring revenue is the freelancer's safety net); and add the project to your CV and LinkedIn featured section. Phase 5 builds on exactly this groundwork.

**Your task:** Complete the hygiene checklist, assemble and submit the five-item package, and include your three-business prospect list with one drafted proposal. Your mentor will review the submission against the capstone rubric within one week.`,
            aiPrompt:
              "This lesson finalises the capstone submission: repo hygiene (secrets audit of history, structure, LICENSE, roadmap issues), the five-item package (repo, live URL, video, user guide, self-assessment), and converting the capstone into income via proposals to local businesses with realistic FCFA pricing. Review checklists item by item and pressure-test the student's proposal draft.",
          },
        ],
      },
    ],
  },
];

export const trackAProjects: ProjectSeed[] = [
  {
    phaseSlug: "build-studio",
    title: "AI Customer Support Agent for a Local Business",
    description:
      "Build and deploy an AI-powered support agent for a real or realistic local business — a Douala electronics shop, a Yaounde travel agency, or a private school fielding the same parent questions every day. The product is an embeddable chat widget backed by the business's own FAQ and policy knowledge, so the agent answers accurately about opening hours, prices, delivery zones and procedures instead of hallucinating. It must gracefully hand off to a human channel (WhatsApp or phone) when it cannot help, and log conversations so the owner can see what customers ask. Delivery includes the deployed widget on a demo business site, owner-facing documentation for updating the knowledge base, and a demo video pitched at a non-technical business owner.",
    deliverables: [
      { title: "Source Code", ext: "LINK" },
      { title: "Live URL", ext: "LINK" },
      { title: "Demo Video", ext: "MP4" },
      { title: "Documentation", ext: "PDF" },
    ],
    monetizationPotential:
      "Cameroonian SMEs pay 150,000-400,000 FCFA for a configured support agent, plus 20,000-50,000 FCFA monthly for hosting, knowledge-base updates and conversation reports. Five retained clients makes this a 100,000-250,000 FCFA monthly recurring income stream.",
    category: "Support & Ops",
    difficulty: "Intermediate",
    estimatedWeeks: "3-5 weeks",
  },
  {
    phaseSlug: "build-studio",
    title: "Booking & Orders Web App for an SME",
    description:
      "Build a full-stack booking or ordering system for a small business — clinic appointment scheduling, bakery pre-orders, salon bookings or event-space reservations. Customers browse available services or products, pick a slot or build an order, and submit with their name and phone number; the business owner gets a protected dashboard showing the day's bookings or orders, with double-booking prevented at the database level. The stack is the one you trained on: a React front end, an Express REST API, and PostgreSQL, deployed and tested on a mid-range Android phone over mobile data. Delivery includes a plain-language user guide the receptionist or shop owner can actually follow, ideally in both French and English.",
    deliverables: [
      { title: "Source Code", ext: "LINK" },
      { title: "Live URL", ext: "LINK" },
      { title: "Demo Video", ext: "MP4" },
      { title: "Documentation", ext: "PDF" },
    ],
    monetizationPotential:
      "Custom booking and order systems for Cameroonian SMEs typically bill 250,000-800,000 FCFA per build depending on scope, with 15,000-40,000 FCFA monthly for hosting and support. One clinic or restaurant client per quarter, plus retainers, is a realistic first-year freelance base.",
    category: "Build Studio",
    difficulty: "Intermediate-Advanced",
    estimatedWeeks: "4-6 weeks",
  },
  {
    phaseSlug: "build-studio",
    title: "Developer Portfolio & Open-Source Contribution",
    description:
      "Ship the asset every client and employer checks first: a fast, polished portfolio site presenting you as a professional engineer, with case studies of your TechAscend projects (problem, approach, stack, live links and screenshots) rather than a bare list of repos. Alongside it, make one genuine contribution to the wider ecosystem: either a merged pull request to an open-source project (documentation fixes and good-first-issues count) or a small published tool of your own, such as an npm package or reusable template with real documentation. The portfolio must score well on Lighthouse, work flawlessly on mobile, and link your GitHub, LinkedIn and demo videos into one coherent professional identity. This project turns your Phase 1 visibility groundwork into a client-converting machine.",
    deliverables: [
      { title: "Portfolio Live URL", ext: "LINK" },
      { title: "Source Code", ext: "LINK" },
      { title: "Merged PR or Published Tool", ext: "LINK" },
      { title: "Demo Video", ext: "MP4" },
    ],
    monetizationPotential:
      "The portfolio converts directly: freelancers with case-study portfolios command 50,000-150,000 FCFA for starter websites and 200,000+ FCFA for app work, while a visible open-source record unlocks remote junior roles paying 300,000-900,000 FCFA monthly. It is the highest-leverage marketing asset a new engineer owns.",
    category: "Build Studio",
    difficulty: "Intermediate",
    estimatedWeeks: "2-3 weeks",
  },
];
