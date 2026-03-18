# 🧠 Dev Decision Engine

## 🚀 Overview

Developers don’t need more code suggestions — they need to know what to do next.

**Dev Decision Engine** is a web-based tool that transforms raw technical errors into clear, actionable decisions for development teams.

Instead of returning generic AI explanations, the system analyzes an error and provides:

* Root cause
* Business impact
* Priority level
* Suggested fix
* Immediate next actions

---

## 💡 Problem

Debugging is still chaotic:

* Errors are unclear
* Prioritization is manual
* Impact is unknown
* Teams lose time deciding what to fix first

Current AI tools (Copilots, ChatGPT) generate code or explanations, but **they don’t provide decision-making context**.

---

## 🎯 Solution

Dev Decision Engine introduces a new approach:

👉 From *“What does this error mean?”*
👉 To *“What should I do now?”*

The system converts technical issues into structured decisions, helping teams act faster and smarter.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.