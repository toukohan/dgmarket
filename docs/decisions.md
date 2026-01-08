We intentionally keep UI components separate between buyer and seller apps.
These surfaces serve different users and evolve at different speeds.
Shared UI will be extracted only when duplication becomes painful.

We look to remove the types package in favor of zod schemas.

### Decision: Transaction-based testing

Resetting the database before each test was unreliable and caused inconsistent results. The test setup was changed to use BEGIN / ROLLBACK so each test runs inside its own transaction.

Tests now use an isolated database client per test, which required passing the client through the app and services. This made the dependencies clearer, even though it required some extra work with TypeScript types.

API tests were also cleaned up to only test HTTP behavior via Supertest, with service logic tested separately.