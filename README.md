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


MIT License

---

*This project is submitted as part of the Jaaga.ai internship evaluation process.*
