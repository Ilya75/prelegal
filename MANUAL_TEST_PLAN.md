# Manual Test Plan — Prelegal Mutual NDA Creator

## How to Run

Start the dev server:
```
cd frontend && npm install && npm run dev
```
Open http://localhost:3000 in your browser.

---

## TC-001  Page loads without errors

**Steps:**
1. Open http://localhost:3000
2. Open browser DevTools console

**Expected:** Page renders the two-panel layout with no console errors or warnings.

---

## TC-002  Form panel is scrollable, preview panel is scrollable

**Steps:**
1. Scroll within the left (form) panel
2. Scroll within the right (preview) panel

**Expected:** Each panel scrolls independently. The header stays fixed at the top.

---

## TC-003  Default form values pre-populate the preview

**Steps:**
1. Load the page without changing anything

**Expected:**
- Preview shows today's date (formatted, e.g. "April 20, 2026") highlighted
- Preview shows "1 year(s)" for MNDA term (expires selected with ☑)
- Preview shows "1 year(s)" for confidentiality (years selected with ☑)
- Preview shows the default purpose text highlighted
- Preview shows "[Fill in state]" placeholder for Governing Law
- Preview shows "[Fill in city or county and state]" placeholder for Jurisdiction

---

## TC-004  Purpose field updates preview live

**Steps:**
1. Clear the Purpose textarea
2. Type "Exploring a partnership opportunity"

**Expected:** The Cover Page Purpose section in the preview updates to show "Exploring a partnership opportunity" highlighted in amber.

---

## TC-005  Effective Date field updates preview live

**Steps:**
1. Set Effective Date to 2025-07-04

**Expected:** Preview shows "July 4, 2025" highlighted in amber.

---

## TC-006  Clearing Effective Date reverts to placeholder

**Steps:**
1. Set a date in the Effective Date field
2. Clear the field (if browser allows)

**Expected:** Preview shows "[Effective Date]" in grey italic.

---

## TC-007  MNDA Term — expires radio with year selection

**Steps:**
1. Ensure "Expires after" radio is selected
2. Change the year count to 5

**Expected:**
- Preview shows ☑ next to "Expires 5 year(s) from Effective Date"
- Preview shows ☐ next to "Continues until terminated"
- Standard Terms section shows "5 year(s) from the Effective Date" highlighted

---

## TC-008  MNDA Term — until_terminated radio

**Steps:**
1. Select "Continues until terminated" radio

**Expected:**
- Preview shows ☑ next to "Continues until terminated"
- Preview shows ☐ next to "Expires [X year(s)]"
- The year count number input is disabled (greyed out)
- Standard Terms section shows "the date when terminated in accordance with its terms" highlighted

---

## TC-009  Term of Confidentiality — years selection

**Steps:**
1. Ensure the years radio is selected
2. Change the year count to 7

**Expected:**
- Preview shows ☑ next to "7 year(s) from Effective Date"
- Preview shows ☐ next to "In perpetuity"
- Standard Terms shows "7 year(s) from the Effective Date" highlighted

---

## TC-010  Term of Confidentiality — in perpetuity selection

**Steps:**
1. Select "In perpetuity" radio

**Expected:**
- Preview shows ☑ next to "In perpetuity."
- Preview shows ☐ next to the years option
- The years number input is disabled
- Standard Terms shows "in perpetuity" highlighted

---

## TC-011  Governing Law field updates preview and standard terms

**Steps:**
1. Type "California" in the Governing Law field

**Expected:**
- Preview shows "California" highlighted in the Cover Page governing law row
- Standard Terms section shows "California" highlighted wherever the Governing Law placeholder appeared

---

## TC-012  Jurisdiction field updates preview

**Steps:**
1. Type "Los Angeles, CA" in the Jurisdiction field

**Expected:**
- Preview shows "Los Angeles, CA" highlighted in the Cover Page jurisdiction row

---

## TC-013  Party 1 fields populate the signature table

**Steps:**
1. Fill in Party 1: Company = "Acme Corp", Name = "Jane Doe", Title = "CEO", Address = "jane@acme.com"

**Expected:**
- Signature table header shows "Acme Corp" highlighted
- Print Name row shows "Jane Doe"
- Title row shows "CEO"
- Notice Address row shows "jane@acme.com"

---

## TC-014  Party 2 fields populate the signature table

**Steps:**
1. Fill in Party 2: Company = "Beta Inc", Name = "John Smith", Title = "CTO", Address = "john@beta.io"

**Expected:**
- Signature table header shows "Beta Inc" highlighted
- Print Name row shows "John Smith"
- Title row shows "CTO"
- Notice Address row shows "john@beta.io"

---

## TC-015  Empty party fields show generic placeholders

**Steps:**
1. Leave all party fields blank

**Expected:**
- Signature table shows "PARTY 1" and "PARTY 2" in grey for company headers
- Name, Title, Address cells are empty (no placeholder text in cells)

---

## TC-016  MNDA Modifications section is hidden by default

**Steps:**
1. Load the page without filling in Modifications

**Expected:** The "MNDA Modifications" section does not appear in the preview.

---

## TC-017  MNDA Modifications appear in preview when filled

**Steps:**
1. Type "Section 12(b) is deleted." in the Modifications textarea

**Expected:**
- A new "MNDA Modifications" section appears in the Cover Page preview
- The modifications text is displayed highlighted in amber

---

## TC-018  Download PDF — button is visible and enabled

**Steps:**
1. Load the page

**Expected:** "Download PDF" button is visible in the header, not disabled.

---

## TC-019  Download PDF — generates a file

**Steps:**
1. Fill in Party 1 Company = "Acme Corp", Party 2 Company = "Beta Inc", Governing Law = "Delaware"
2. Click "Download PDF"

**Expected:**
- Button briefly shows "Generating…" with a spinner
- After a few seconds, a file named `mutual-nda.pdf` is downloaded
- The button returns to "Download PDF" and is re-enabled
- Opening the PDF shows both the Cover Page and Standard Terms with entered values highlighted

---

## TC-020  Download PDF — PDF includes both panels

**Steps:**
1. Fill in all fields with distinct values
2. Download the PDF
3. Open the downloaded PDF

**Expected:**
- PDF starts with the Mutual NDA Cover Page (title, purpose, dates, parties, signature table)
- A "Standard Terms" separator appears
- The Common Paper standard terms follow, with form values highlighted

---

## TC-021  Placeholder text is grey/italic in preview

**Steps:**
1. Leave Governing Law blank
2. Observe the preview

**Expected:** "[Fill in state]" text appears in grey italics, not in amber highlight.

---

## TC-022  Filled values use amber highlight in preview

**Steps:**
1. Enter "Delaware" in Governing Law

**Expected:** "Delaware" appears with an amber/yellow highlight background in the preview.

---

## TC-023  Standard Terms placeholders are replaced by form values

**Steps:**
1. Enter "Delaware" in Governing Law
2. Scroll to the Standard Terms section of the preview

**Expected:** Every `coverpage_link` span in the standard terms has been replaced. "Delaware" appears highlighted wherever Governing Law was referenced. No grey `[coverpage_link]` spans are visible.

---

## TC-024  Full form completion — all placeholders resolved

**Steps:**
1. Fill in every field:
   - Purpose, Effective Date, MNDA Term, Confidentiality Term
   - Governing Law, Jurisdiction
   - Party 1 and Party 2 (all four sub-fields)

**Expected:**
- No grey italic placeholder text remains in the preview
- Every Cover Page section shows amber-highlighted values
- Standard Terms section shows highlighted values for all substituted fields

---

## TC-025  Browser back/refresh resets form to defaults

**Steps:**
1. Fill in several form fields
2. Refresh the page (F5)

**Expected:** The form resets to its default state (today's date, default purpose, no party details). There is no client-side persistence.

---

## TC-026  Responsive layout — large viewport

**Steps:**
1. Open at 1440 × 900

**Expected:** Two-panel layout is visible side by side. Both panels are usable without horizontal scrolling.

---

## TC-027  Responsive layout — 1024px width

**Steps:**
1. Resize browser to 1024px wide

**Expected:** Both panels still visible. No content is cut off.

---

## TC-028  Special characters in form fields do not break the preview

**Steps:**
1. Enter `John "JJ" O'Brien & Associates` in Party 1 company
2. Enter `State (CA) — Western District` in Jurisdiction

**Expected:** Preview renders the special characters correctly. No HTML escaping issues (no `&amp;`, `&quot;` visible to the user).

---

## TC-029  Very long text in purpose field

**Steps:**
1. Paste 500+ characters into the Purpose field

**Expected:** Preview renders the full text, wrapping appropriately. Layout does not break.

---

## TC-030  Standard Terms markdown is rendered as formatted text

**Steps:**
1. Scroll to the Standard Terms section of the preview

**Expected:** Headings are bold/larger, paragraphs are spaced, tables have borders. Raw markdown syntax (`#`, `**`, `|`) is not visible.
