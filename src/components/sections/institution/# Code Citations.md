# Code Citations

## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```


## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```


## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```


## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```


## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```


## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```


## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```


## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```


## License: unknown
https://github.com/trujic1000/kotach-car-trader/blob/118e97e06b675d33cf0582124abdf8a34da3916d/studio/schemas/faq.js

```


This is a solid architecture. Your current setup is *almost* there but needs a few adjustments to match this per-page, CMS-driven approach. Here's what needs to change:

---

## What's Right Already

✅ FAQ schema in Sanity with a `page` field  
✅ `FAQSchema` component accepts `items` as props  
✅ `FAQSection` fetches from Sanity with hardcoded fallback  

## What Needs to Change

| Issue | Current State | Target State |
|-------|--------------|--------------|
| FAQ is a standalone document | Separate `faq` documents with a `page` selector | FAQ is an **embeddable array field** on blog posts, landing pages, etc. |
| Hardcoded fallback | Falls back to `src/data/faq.ts` | No fallback — if Sanity has no FAQs, render nothing |
| Global FAQ data file | `src/data/faq.ts` exists | Remove it — single source of truth is Sanity |
| `llms.txt` FAQ section | Static text | Keep as-is (this is for LLM crawlers, not Google schema) |
| Blog posts | No FAQ support | Optional FAQ field on blog schema |

---

## Implementation

### Step 1: Create a reusable FAQ object type in Sanity

````typescript
// filepath: c:\Users\OLUWATO2\clari-web\sanity\schemas\objects\faqItem.ts
import { defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      
```

