# week
Week number

Some useful info about current date.

`public/` is fully deployable as static assets. Tests and tooling files are kept outside `public/`.

## Testing

Prerequisites:
- Node.js 18+ (includes `node --test`)
- npm

Run tests:

```bash
npm test
```

What this does:
- Runs `tests/date-utils.test.mjs` with Node's built-in test runner.
- Uses `TZ=America/New_York` in the test script to make DST edge-case checks deterministic.

## Ideas

## Food for though

Holiday Tracker 🇪🇪

Should support Estonian public holidays using a clean and maintainable approach (e.g. static JSON, or API with caching).
