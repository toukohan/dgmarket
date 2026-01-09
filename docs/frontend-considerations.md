# Frontend considerations – Seller Dashboard

This document captures frontend design considerations for the **seller dashboard** in the Disc Golf Marketplace. It is intended as a living reference when implementing and evolving product management UI (create, edit, list).

---

## 1. Server state vs UI state

Keep a strict separation between:

### Server state

* Seller products list
* Single product data
* Create / update / delete mutations

### UI state

* Is the create/edit form open
* Which product is being edited
* Form input values
* Loading and error flags

**Rule:** Never mix UI state with server state in the same abstraction.

---

## 2. Product state ownership

At the current stage, product state should live close to where it is used:

* Prefer **component-local state** inside `ProductList`
* Lift state later if needed (context or server-state library)

Avoid premature global state.

---

## 3. Authentication & API client assumptions

The `@dgmarket/api-client`:

* Sends cookies automatically
* Handles access token refresh via interceptors
* Retries failed requests after successful refresh

Frontend components should:

* Assume requests may transparently retry
* Never manually refresh tokens
* Never attach auth headers themselves

---

## 4. Hard auth failure handling

There are two different 401 scenarios:

1. **Access token expired** → refresh succeeds → request retries
2. **Refresh token invalid / revoked** → refresh fails → user must be logged out

Frontend code must treat refresh failure as a **hard auth failure**.

**Rule:**

* If the API client indicates auth expiration, clear user state and redirect to login.

---

## 5. Loading products after login

Products should only be fetched when a user is authenticated.

Guidelines:

* Fetch products after `user` becomes available
* Clear product state when `user` becomes `null`
* Handle auth-expired errors by logging out

---

## 6. Create vs Edit product flow

Use **one form component** for both create and edit.

Recommended API:

* `POST /products` → create
* `PUT /products/:id` → update

Form component responsibilities:

* Accept mode: `create | edit`
* Accept initial values for edit
* Call the correct API endpoint

Avoid duplicating form logic.

---

## 7. Mutation strategy

Use **pessimistic updates** initially:

* Submit form
* Wait for API response
* Update local product list using returned product

Avoid optimistic updates until UX requirements demand it.

---

## 8. Error handling

Frontend should:

* Disable submit buttons while requests are pending
* Display server-provided error messages
* Preserve form state on validation failure

Frontend should not:

* Retry mutations on its own
* Swallow API errors silently

---

## 9. Component responsibilities

Recommended structure:

* `ProductList`

  * Owns products array
  * Owns which product is being edited
* `ProductRow`

  * Pure display
  * Emits edit events
* `ProductForm`

  * Handles create/edit
  * Emits success and cancel events

Each component should have a single responsibility.

---

## 10. Logout & session expiry

Important edge cases:

* User logs out → clear product state
* Session expires → API client fails refresh → logout
* User changes (future) → reload products

**Rule:** Product state is invalid when auth state changes.

---

## 11. Avoided patterns (for now)

Do **not** introduce prematurely:

* Redux or similar global stores
* App-level Axios interceptors
* Product-specific logic inside shared packages
* Complex form libraries without clear need

---

## 12. Future-proofing notes

The current setup allows future migration to server-state libraries (e.g. TanStack Query) without architectural changes, because:

* Auth refresh is centralized
* Requests are idempotent on retry
* Cookies handle credentials implicitly

---

*Last updated: 2026-01-09*
