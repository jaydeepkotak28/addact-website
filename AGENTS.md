# Addact Project Guidelines & Standards (AGENTS.md)

All agents and developers working on this repository must strictly adhere to the following architecture patterns for all new and modified features:

---

## 1. 🌐 GraphQL Queries & Caching Standard
- **Always pass Cache Tags & ISR**:
  When creating or calling GraphQL queries, ALWAYS use `fetchStrapi` with explicit Next.js cache tags and a 60s revalidation fallback:
  ```ts
  const data = await fetchStrapi<ResponseType>(QUERY, variables, {
    queryName: "QueryName",
    tags: ["modelPlural", `model:${slug}`],
    revalidate: 60,
  });
  ```
- **Auto-Collection/Slug Queries**:
  Use `queryStrapiCollection` or `queryStrapiBySlug` from `@/graphql` for standard collection fetching without writing raw GraphQL strings.
- **Tagged gql**:
  Always import `gql` from `@/graphql` (`import { gql } from "@/graphql"`).

---

## 2. 🧱 Atomic UI & Layout Components
Always use the standardized generic atoms from `@/components/atoms`:
- **Sections**: Wrap all organism and section blocks in `<GenericSection variant="dark|light|..." container="main|fluid">`.
- **Media**: Use `<GenericMedia media={...} />` for all media (handles Images, HTML5 Videos, and YouTube/Vimeo embeds automatically).
- **Buttons**: Use `<GenericButton href={...} variant="primary|secondary|outline">` (handles polymorphic button/link, loading spinner, icons).
- **Grid Layouts**: Use `<GenericGrid items={...} columns={{ md: 2, lg: 3 }} renderItem={...} />`.
- **Badges/Tags**: Use `<GenericBadge label={...} variant="brand|neutral|..." dot />`.
- **Breadcrumbs**: Use `<GenericBreadcrumb />`.
- **Links**: Use `<GenericLink link={...} />` (handles polymorphic external/internal/drawer triggers).
- **RichText**: Always use `<RichText html={...} />` (DOMPurify XSS protection enabled by default).

---

## 3. 🛡️ Stability & Error Boundaries
- Every Dynamic Zone component or complex external block must be protected by `<GenericErrorBoundary componentName="...">`.
- A single component failure must never take down the entire page.

---

## 4. 🗃️ Data Normalization
- Always sanitize raw Strapi response data before passing to components using `@/lib/normalizers`:
  - `normalizeMedia(rawMedia)`
  - `normalizeLink(rawLink)`
  - `normalizeTitle(rawTitle)`
  - `normalizeCard(rawCard)`
  - `normalizeCollection(rawArray, normalizer)`

---

## 5. 🪟 Modals & Drawers
- Use the unified `useModal` hook from `@/lib` for all modals, video popups, and contact drawers:
  ```ts
  const { openModal, closeModal } = useModal();
  openModal("contact");
  openModal("video", { videoUrl });
  ```

---

## 6. ⚡ Backend (Strapi 5) Rules
- Any new collection with a URL must define a `slug` attribute.
- The revalidation service in `addact-strapi-be/src/services/revalidation.ts` automatically discovers content types, plural names, single types, and slugs.
- Never re-introduce hardcoded `switch(model)` cases in Strapi revalidation.
