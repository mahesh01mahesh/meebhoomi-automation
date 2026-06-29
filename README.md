# MeeBhoomi ROR 1B Document Automation

**Assignment Submission for Jaaga.ai Internship**

Automated retrieval of ROR 1B document from Andhra Pradesh MeeBhoomi portal.

## Overview

This project automates the process of retrieving ROR 1B documents from the Andhra Pradesh MeeBhoomi portal.

**Portal URL:** https://meebhoomi.ap.gov.in/

The automation handles the workflow from opening the portal, completing mobile OTP verification manually, navigating to the ROR 1B section, filling required details, solving simple math CAPTCHA, and submitting the form.

## Prerequisites

Before running this project, make sure you have:

- Node.js version 14 or higher installed
- npm installed
- Internet connection
- Valid mobile number for OTP verification
- Google Chrome or Chromium support through Playwright

## Installation

**Step 1:** Clone the repository
git clone https://github.com/mahesh01mahesh/meebhoomi-automation.git




**Step 2:** Go inside the project folder
cd meebhoomi-automation




**Step 3:** Install dependencies
npm install




**Step 4:** Install Playwright Chromium browser
npx playwright install chromium




## How to Run

Run the automation using:
npm start




Or directly using:
node index.js




## Usage Instructions

1. Run the script
2. A browser window will open automatically
3. Enter your mobile number manually on the MeeBhoomi portal
4. Enter the OTP received on your mobile
5. After OTP verification, the script continues automation
6. The script navigates to the ROR 1B section
7. It selects district, mandal, and village
8. It selects the ROR 1B document option
9. It solves the simple math CAPTCHA if detected
10. It submits the form
11. The browser remains open until the user closes it manually

## Features

- Automates MeeBhoomi ROR 1B document retrieval workflow
- Handles mobile OTP-based login with manual user input
- Automatically fills form details
- Handles dynamic dropdowns like district, mandal, and village
- Solves simple mathematical CAPTCHA
- Takes screenshots during important steps
- Includes error handling
- Keeps browser open for manual verification
- Uses Playwright with Node.js

## Project Structure

- **index.js** - Main automation script
- **package.json** - Project dependencies and scripts
- **README.md** - Project documentation
- **docs/technical-report.md** - Technical explanation
- **screenshots/** - Screenshots generated during execution

## Technical Details

- **Framework:** Playwright
- **Programming Language:** Node.js
- **Browser:** Chromium
- **Mode:** Non-headless browser mode
- **Reason:** OTP verification requires manual user interaction

## Workflow

1. Open MeeBhoomi portal
2. Wait for the page to load
3. User enters mobile number manually
4. User enters OTP manually
5. Script navigates to ROR 1B section
6. Script waits for form elements
7. Script selects district, mandal, village
8. Script selects ROR 1B document type
9. Script selects Entire Village option
10. Script solves CAPTCHA if possible
11. Script submits the form
12. Results page is displayed
13. Browser remains open for review

## Approach

The portal was first analyzed manually to understand the user flow, form structure, OTP verification, dropdown dependencies, and CAPTCHA behavior.

Playwright was chosen because it provides reliable browser automation, good selector support, better wait handling, and works well with modern web applications.

The automation uses a hybrid approach. Steps that can be automated are handled by the script, while secure steps like OTP verification are handled manually by the user.

## Challenges Encountered

### 1. OTP Verification
The portal requires mobile OTP verification before accessing records. Since OTP is sent to the user's mobile number, this step is handled manually.

### 2. Dynamic Dropdowns
Mandal dropdown depends on district selection, and village dropdown depends on mandal selection. The script waits for dropdown options to load before selecting values.

### 3. CAPTCHA
The portal uses a simple mathematical CAPTCHA. The script reads the page text, detects the math expression, calculates the answer, and fills it automatically.

### 4. Element Detection
Some elements may have changing or unclear selectors. Multiple selector strategies were used to improve reliability.

### 5. Page Redirects and Form Reloading
The portal may redirect back to the homepage or reload the form if authentication is incomplete or form validation fails. Additional waits and checks were added to handle this.

## Assumptions

- User has a valid mobile number for OTP verification
- User is available to manually enter OTP
- Portal is accessible and not under maintenance
- Internet connection is stable
- First available district, mandal, and village options are acceptable
- CAPTCHA is a simple mathematical expression

## Limitations

- OTP entry is manual
- The script currently selects the first available district, mandal, and village
- It processes one request at a time
- It depends on the current portal structure
- If the portal changes its UI or selectors, the script may require updates
- It does not currently download and store the final document automatically
- It does not support batch processing

## Future Improvements

- Add configuration to select specific district, mandal, and village
- Add batch processing for multiple villages
- Add document download support
- Add better logging system
- Add retry mechanism for failed requests
- Add structured output storage
- Add support for other government portals
- Improve CAPTCHA handling for more complex cases

## Error Handling

The script includes error handling for:

- Page load timeout
- Missing form elements
- Dropdown loading issues
- CAPTCHA detection failure
- Submit button detection failure
- Unexpected redirects
- Network issues

Screenshots are captured during execution and errors to help with debugging.

## Security Considerations

- Mobile number and OTP are not stored
- User enters OTP manually
- The script does not bypass authentication
- The browser runs visibly so the user can monitor the process
- Delays are added between actions to avoid overwhelming the portal

## Assignment Context

This project was developed for the **Jaaga.ai internship assignment**.

The assignment required automating one government portal. I selected Andhra Pradesh MeeBhoomi and automated the retrieval workflow for ROR 1B document.

This project demonstrates:

- Understanding of an unfamiliar government portal
- Browser automation using Playwright
- Handling OTP-based workflows
- Handling dynamic dropdowns
- CAPTCHA handling
- Error handling
- Documentation and project structure

## Author

**Mahesh**  
Internship Assignment - Jaaga.ai

## License

MIT License

---

*This project is submitted as part of the Jaaga.ai internship evaluation process.*
