# Hosting notes

Things about this Firebase Hosting site that are not obvious from `firebase.json`,
and that cost real debugging time to find. Read before changing hosting config.

## The `/r` referral redirect

`https://swipcall.com/r` is the link the app puts in a "send to colleague" message
(`src/services/referral-link.ts` in the app repo, `REFERRAL_BASE_URL`). The lead
itself rides in the URL fragment after `#`, which never reaches this server. The
path only has to do one thing: when the receiver does NOT have the app, land them
on the Play listing with an install-referrer so AppsFlyer attributes the install.

### Firebase re-encodes `%` in a redirect destination. There is no escape.

The canonical Play install-referrer URL percent-encodes the `=` inside the
`referrer` value:

```
https://play.google.com/store/apps/details?id=com.swipcall.app&referrer=utm_source%3Dreferral
```

Putting that string in `destination` does NOT work. Measured against the hosting
emulator:

| `destination` contains | `Location:` header contains |
|---|---|
| `utm_source%3Dreferral`   | `utm_source%253Dreferral`   |
| `utm_source%253Dreferral` | `utm_source%25253Dreferral` |
| `utm_source=referral`     | `utm_source=referral`       |

Firebase percent-encodes every literal `%`, and pre-escaping just gets escaped
again. With `%253D` on the wire, Play decodes the `referrer` value to the literal
text `utm_source%3Dreferral` instead of `utm_source=referral`, and the campaign
attribution is wrong.

So the config deliberately uses a **raw `=`**. Query-string parsing splits each
pair on the FIRST `=`, so `referrer=utm_source=referral` yields exactly the value
`utm_source=referral`. This works for a single referrer parameter. If a second one
is ever needed, the `&` between them cannot be expressed this way and the redirect
has to move to a static page or a function.

### Two other measured behaviours

- The incoming query string is appended to the destination. `/r?a=1` produces
  `...&referrer=utm_source=referral&a=1`. With no incoming query you get a bare
  trailing `&`, which every parser ignores.
- The emulator does **not** hot-reload `firebase.json`. Restart it after every
  config edit or you will test the old rules and believe them.

## `/.well-known/assetlinks.json` is generated, not stored

The site answers this path with HTTP 200 and body `[]` even though no such file
exists in `public/`. Firebase Hosting generates it from the Android apps
registered in the Firebase project. It is empty because the project's Android app
has no SHA-256 certificate fingerprints registered yet.

**Preferred fix is in the console, not in this repo:** add both fingerprints under
Firebase Console -> Project settings -> Your apps -> the `com.swipcall.app`
Android app -> Add fingerprint. Both are needed:

- the local debug signing key, for testing;
- the Play app-signing key, from Play Console -> Test and release -> App
  integrity -> App signing key certificate.

The ready-to-paste content and the debug fingerprint live in the app repo at
`docs/referral-e2e.md`.

### If the console route ever fails, mind this trap

A static `public/.well-known/assetlinks.json` overrides the generated one, BUT the
`ignore` list in `firebase.json` contains `**/.*`, which matches `.well-known` and
silently excludes the whole directory from the deploy. Taking the static route
means removing or narrowing that pattern first, otherwise the file appears to be
committed and deployed while the live site keeps serving the generated `[]`.
