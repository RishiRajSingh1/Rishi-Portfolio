# Pinned browser dependencies

These are the same versions previously loaded by the portfolio from CDNs. They are served locally so the site's Content Security Policy can restrict executable scripts to its own origin. Upstream notices remain in the distributed files. Only line endings and trailing whitespace have been normalized.

| File | Source | SHA-256 |
| --- | --- | --- |
| `gsap-3.12.5.min.js` | https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js | `a992e24e9726b97cf7320b0a88d2262459c9a11cb919e6d9765dd6eb88bbeead` |
| `ScrollTrigger-3.12.5.min.js` | https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js | `ea9680c2d0fd4c190ea719233b066e7a1f53bbeec8403076c775e849d8beeff1` |
| `lenis-1.1.13.min.js` | https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js | `b2958f142f832f0d5e547cdef77e6fadfce16bea60982fc8bbf50395a2439df8` |

GSAP and ScrollTrigger: https://gsap.com/standard-license/ (license link included in upstream distribution).
Lenis: MIT; see `LENIS-LICENSE.txt`.

When updating a dependency, verify its source, retain its license, update this table and rerun the browser checks.
