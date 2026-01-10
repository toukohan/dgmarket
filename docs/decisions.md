We intentionally keep UI components separate between buyer and seller apps.
These surfaces serve different users and evolve at different speeds.
Shared UI will be extracted only when duplication becomes painful.

We look to remove the types package in favor of zod schemas.

### Decision: Transaction-based testing

Resetting the database before each test was unreliable and caused inconsistent results. The test setup was changed to use BEGIN / ROLLBACK so each test runs inside its own transaction.

Tests now use an isolated database client per test, which required passing the client through the app and services. This made the dependencies clearer, even though it required some extra work with TypeScript types.

API tests were also cleaned up to only test HTTP behavior via Supertest, with service logic tested separately.

### Decision: Try a class-based approach for product service and repository

After refactoring database injection to support better test isolation, the function-based services started to require passing the database client through many layers (router → service → repository). While this worked, it made the code more verbose and harder to read.

Because of this, a class-based approach was tried for the product service and repository, injecting the database dependency once during app initialization instead of passing it through every function call. This keeps the product routes simpler and makes dependency wiring more centralized.

Only the product feature was refactored this way as a small, contained experiment. Other services remain function-based for now, and the goal is to compare ergonomics and testability before deciding whether to apply the same pattern more broadly.

The intent is to improve readability and developer experience, not to enforce an object-oriented style across the entire codebase.

## Decision: Next.js Integration

Because NodeNext modules were used to build the api and schemas package, it is required for now to build the schemas for Next to use them.