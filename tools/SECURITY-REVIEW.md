# Security remediation and Google review notes

Updated October 4, 2026.

## Confirmed warning

Google’s public [Safe Browsing report](https://transparencyreport.google.com/safe-browsing/search?url=rishirajsingh1.github.io%2FRishi-Portfolio%2F&hl=en) marked the portfolio path and its parent `rishirajsingh1.github.io` host as unsafe for deceptive content. The owner supplied Search Console’s matching description of pages that trick users into sharing personal information or installing software. Specific sample URLs were not supplied, so the original detection source is not confirmed.

HTTPS is already valid. HTTP redirects to HTTPS, and GitHub Pages sends Strict-Transport-Security. The warning is a Safe Browsing classification, not an HTTPS certificate failure.

## Remediation

### Published login demo

The public `Faceboook_login_page_clone` homepage previously displayed Facebook branding, email/phone and password inputs, and sign-in/account-creation controls without a visible educational disclaimer. The fetched source had no form submission or JavaScript, but its appearance could be mistaken for a genuine login page. It was a plausible contributor to the classification, not a proven source of Google’s detection.

With the owner’s authorization, `index.html` was replaced with an original, non-interactive educational page. The replacement:

- Identifies Rishi Raj Singh as the project author and clearly states that the project is independent of Facebook and Meta.
- Removes Facebook branding, credential fields and account controls.
- Contains no forms, executable scripts, downloads or requests for personal information.
- Uses a restrictive Content Security Policy and a `noindex, follow` directive.
- Preserves the repository and its history.

Source commit: [99a3b22](https://github.com/RishiRajSingh1/Faceboook_login_page_clone/commit/99a3b2239ea697022792f17fc4e1550c102fe07c).
Published URL: https://rishirajsingh1.github.io/Faceboook_login_page_clone/

### Portfolio

- Rewrote the personal developer portfolio and project case studies using the current resume, and refreshed the downloadable PDF.
- Removed the sound control and audio playback.
- Served pinned animation libraries locally instead of executing CDN scripts.
- Added a Content Security Policy that restricts scripts to the site’s own origin and blocks frames, plugins, base URL changes and form submissions.
- Moved executable inline theme code into a local script.
- Replaced old GitHub snapshots with live, paginated public API data. Dynamic labels use DOM text nodes instead of HTML interpolation. No credentials or API tokens are embedded.
- Kept menu and theme controls functional if animation dependencies fail to load; closed mobile menus are inert and support Escape to close.

No credential/payment forms, automatic downloads or malicious redirects were found in the inspected portfolio source. These changes do not prove that previous wording or CDN dependencies caused the classification. A surface check of other publicly accessible project homepages is not a complete audit of every URL on the host.

## Validation

- Desktop and mobile layouts, theme switching, mobile navigation, and current resume download.
- Live GitHub API counts, multi-page repositories, rate limiting, partial failures and safe rendering of untrusted language labels.
- Essential controls with animation scripts unavailable.
- JavaScript syntax, local resource paths, anchor targets, JSON-LD and Git whitespace checks.
- No JavaScript errors, local resource failures or CSP violations in the tested portfolio pages.

## Owner’s next step

Once the GitHub Pages deployments show the corrected pages, request a security review in [Search Console](https://search.google.com/search-console/security-issues). If Google supplies specific sample URLs, inspect and resolve every listed example first. The existing Google verification file is preserved.

Suggested review text, after confirming the deployed pages:

> My website is a personal software developer portfolio and collection of educational projects. On October 4, 2026, I replaced the Facebook-like login demo at https://rishirajsingh1.github.io/Faceboook_login_page_clone/ with a clearly identified, non-interactive educational page. I removed its Facebook branding, email and password inputs, and account controls. The replacement has no forms, scripts, downloads or requests for personal information. I also reviewed and updated my portfolio at https://rishirajsingh1.github.io/Rishi-Portfolio/, restricted script execution through CSP, served pinned dependencies locally and verified HTTPS, the resume download and desktop/mobile behavior. Please re-evaluate the affected URLs for the deceptive-content warning.

Google controls the classification and removal of the browser warning. Publishing these fixes does not itself clear the listing. [Google’s guidance](https://support.google.com/webmasters/answer/9044101?hl=en) says reviews may take days or weeks. No review or false-positive report has been submitted by this task; the owner will submit it.
