# MeeBhoomi Automation – Approach & Design

## Overall Approach

1. **Portal Analysis**
   - Manually explored https://meebhoomi.ap.gov.in to understand:
     - Login via mobile + OTP
     - ROR 1B is behind authentication
     - District → Mandal → Village dependent dropdowns
     - Simple math CAPTCHA before submitting

2. **Tool Selection**
   - Used **Node.js + Playwright** because:
     - Works well with modern, JS-heavy sites
     - Good auto-waiting for elements
     - Easy screenshot capture
     - Good developer experience in JavaScript

3. **Automation Flow**
   - Open MeeBhoomi homepage
   - Let the user:
     - Enter mobile number
     - Enter OTP
   - Script then:
     - Navigates / clicks to ROR 1B page
     - Waits for form and dropdowns
     - Selects District, Mandal, Village
     - Selects ROR 1B and “Entire Village”
     - Detects and solves math CAPTCHA if possible
     - Submits the form
     - Waits for results and captures screenshots

## Challenges Encountered

1. **OTP-Based Login**
   - OTP is sent to user’s phone, so cannot be fully automated.
   - Solution: pause the script with clear console messages
     and give user time windows to enter mobile and OTP.

2. **Dynamic Dropdowns**
   - Mandal options only load after District is chosen.
   - Village options only load after Mandal is chosen.
   - Solution: implemented a helper loop that keeps checking
     the number of `<option>` items until dropdown is populated.

3. **CAPTCHA**
   - Simple math CAPTCHA like “3 + 7 = ?”.
   - Solution: read body text, use RegEx to extract the numbers,
     compute the sum, and try filling it into likely CAPTCHA inputs.
   - If automatic detection fails, the script falls back to
     a manual time window so the user can solve it.

4. **Unstable / Non-English Selectors**
   - Labels partly in Telugu, and some elements without stable IDs.
   - Solution: used multiple selector strategies:
     - Text search (e.g., contains “1B”)
     - Attribute-based (`href`, `value`)
     - Position-based (first/second `<select>`, radio buttons, etc.)

## Assumptions

- User has:
  - A valid AP mobile number
  - Access to the OTP SMS
- Portal structure stays mostly the same.
- For the demo, selecting the first non-default District/Mandal/Village
  is acceptable.
- Internet is stable while the script runs.

## Limitations

- OTP step is fully manual by design.
- CAPTCHA auto-solve relies on math expression being visible in text.
- No structured extraction of results yet (only screenshots).
- If MeeBhoomi changes its UI or element IDs, selectors may need updates.
- Currently processes one request at a time.

## Possible Future Improvements

- Accept District / Mandal / Village / account number as config or CLI args.
- Parse result tables and export JSON/CSV, not only screenshots.
- Add retry and more robust error categorization.
- Integrate external CAPTCHA solver (if allowed) for full automation.
- Wrap this as a service/API that can be called programmatically.