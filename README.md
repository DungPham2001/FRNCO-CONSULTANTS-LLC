# FRNCO Consultants LLC

Static landing page (HTML / CSS / vanilla JS, no build step).

## Run locally

```bash
python3 -m http.server 5173
# open http://localhost:5173
```

Or simply open `index.html` in a browser.

## Structure

- `index.html` - page markup (Home, About, Services, Why Us, Process, FAQ, CTA, Contact, Footer)
- `css/styles.css` - styles and responsive rules (hamburger menu below 900px)
- `js/main.js` - mobile menu, active-link highlight, scroll reveal, contact form (opens the visitor's email app via `mailto:`)
- `images/` - demo photos used across the page

## Editing contact details

Email is set in `index.html` (`mailto:` links) and `CONTACT_EMAIL` at the top of `js/main.js`.
