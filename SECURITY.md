# Security

LayoutKit is a CSS package. It ships no runtime JavaScript, no npm dependencies,
and no install scripts.

## Security expectations

- LayoutKit should not perform network requests.
- LayoutKit should not include remote CSS imports.
- LayoutKit should not include `javascript:` URLs.
- LayoutKit should not include install, postinstall, or preinstall scripts.
- Accessibility and application security still depend on the HTML, CSS, and
  application code you write around LayoutKit.

## Reporting

Report vulnerabilities through GitHub issues:

https://github.com/Garretts-Apps/layoutkit/issues

If a report should not be public, contact the maintainer through the GitHub
repository owner profile and include the affected version, reproduction steps,
and expected impact.

## Verifying the package

Use a pinned version when installing:

```bash
npm install layoutkit-css@1.3.0
```

Inspect the package contents before use:

```bash
npm pack layoutkit-css
tar -tzf layoutkit-css-*.tgz
```

You should see the stylesheet, README, license, changelog, security notes, and
small declaration file. Review third-party packages before use even when they
are small and dependency-free.
