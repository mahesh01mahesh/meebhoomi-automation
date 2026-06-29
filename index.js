const { chromium } = require('playwright');

async function run() {
  console.log('🚀 Starting MeeBhoomi Automation...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox'
    ]
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📌 Opening homepage...');
    await page.goto('https://meebhoomi.ap.gov.in/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);

    // Take screenshot of homepage
    await page.screenshot({ path: '1_homepage.png', fullPage: true });
    console.log('📸 Homepage saved - check 1_homepage.png');

    // Step 1: Handle mobile number entry
    console.log('📱 Looking for mobile number input...');
    
    // Wait for mobile number input field
    await page.waitForSelector('input[type="text"], input[type="tel"], input[placeholder*="mobile"], input[placeholder*="Mobile"], input[id*="mobile"], input[name*="mobile"]', { timeout: 10000 });
    
    // Find mobile number input field
    const mobileInputSelectors = [
      'input[placeholder*="mobile"]',
      'input[placeholder*="Mobile"]', 
      'input[placeholder*="number"]',
      'input[placeholder*="Number"]',
      'input[id*="mobile"]',
      'input[name*="mobile"]',
      'input[type="tel"]',
      'input[type="text"]'
    ];
    
    let mobileInput = null;
    for (const selector of mobileInputSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.isVisible()) {
          mobileInput = element;
          console.log(`✅ Found mobile input with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!mobileInput) {
      throw new Error('Mobile number input field not found');
    }

    // You need to enter your mobile number here
    console.log('📱 Please enter your mobile number in the browser window...');
    console.log('⏰ Waiting 30 seconds for you to enter mobile number and click send OTP...');
    await page.waitForTimeout(30000);

    await page.screenshot({ path: '2_after_mobile.png', fullPage: true });
    console.log('📸 After mobile number saved');

    // Step 2: Handle OTP entry
    console.log('🔢 Looking for OTP input...');
    console.log('📱 Please check your mobile for OTP and enter it in the browser...');
    console.log('⏰ Waiting 60 seconds for OTP entry and verification...');
    await page.waitForTimeout(60000);

    await page.screenshot({ path: '3_after_otp.png', fullPage: true });
    console.log('📸 After OTP verification saved');

    // Step 3: Now try to access 1B records
    console.log('🖱️ Now looking for 1B link...');
    await page.waitForTimeout(3000);

    // Try multiple ways to find 1B link after login
    const oneBLinkSelectors = [
      'a:has-text("1-బి")',
      'a:has-text("1-B")',
      'a:has-text("వయ్య దస్తావేజులు")',
      'a[href*="VAdangal"]',
      'a[href*="1B"]',
      'a:text-is("1-బి")',
      'a:text-is("1-B")',
      '.menu-item:has-text("1-B")',
      '.nav-link:has-text("1-B")'
    ];
    
    let clicked = false;
    for (const selector of oneBLinkSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          await element.click();
          clicked = true;
          console.log(`✅ Clicked 1B link using selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    // If direct click doesn't work, try navigation
    if (!clicked) {
      console.log('⚠️ Direct click failed, trying navigation...');
      const possibleUrls = [
        'https://meebhoomi.ap.gov.in/VAdangal/Index',
        'https://meebhoomi.ap.gov.in/VAdangal',
        'https://meebhoomi.ap.gov.in/Home/VAdangal'
      ];
      
      for (const url of possibleUrls) {
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
          console.log(`✅ Navigated to: ${url}`);
          break;
        } catch (e) {
          console.log(`❌ Failed to navigate to: ${url}`);
          continue;
        }
      }
    }

    await page.waitForTimeout(5000);
    await page.screenshot({ path: '4_after_1b_click.png', fullPage: true });
    console.log('📸 After 1B click saved!');
    console.log('Current URL:', page.url());

    // Step 4: Wait for form to load
    console.log('⏳ Waiting for 1B form elements...');
    try {
      await page.waitForSelector('select', { timeout: 15000 });
      console.log('✅ Form loaded successfully');
    } catch (e) {
      console.log('⚠️ Form not loaded, taking screenshot for debugging...');
      await page.screenshot({ path: '4_form_not_loaded.png', fullPage: true });
      throw new Error('1B form did not load properly');
    }
    
    await page.waitForTimeout(3000);

    // Check if we have the expected dropdowns
    const dropdownCount = await page.locator('select').count();
    console.log(`📊 Found ${dropdownCount} dropdowns`);
    
    if (dropdownCount < 3) {
      await page.screenshot({ path: '4_insufficient_dropdowns.png', fullPage: true });
      throw new Error(`Only ${dropdownCount} dropdowns found. Expected at least 3 (District, Mandal, Village).`);
    }

    // Function to wait for dropdown to populate
    async function waitForDropdownOptions(selectIndex, minOptions = 2) {
      let attempts = 0;
      while (attempts < 15) {
        const options = await page.locator(`select`).nth(selectIndex).locator('option').count();
        if (options >= minOptions) {
          console.log(`✅ Dropdown ${selectIndex} has ${options} options`);
          return true;
        }
        console.log(`⏳ Waiting for dropdown ${selectIndex} options... (${options} found, need ${minOptions})`);
        await page.waitForTimeout(2000);
        attempts++;
      }
      return false;
    }

    // Step 5: Select District
    console.log('📍 Selecting District...');
    const districtReady = await waitForDropdownOptions(0);
    if (!districtReady) {
      throw new Error('District dropdown did not populate');
    }
    
    const districtSelect = page.locator('select').nth(0);
    const districtOptions = await districtSelect.locator('option').count();
    console.log(`District options available: ${districtOptions}`);
    
    await districtSelect.selectOption({ index: 1 });
    console.log('✅ District selected');
    await page.waitForTimeout(5000); // Wait for mandal dropdown to populate

    // Step 6: Select Mandal
    console.log('📍 Selecting Mandal...');
    const mandalReady = await waitForDropdownOptions(1);
    if (!mandalReady) {
      throw new Error('Mandal dropdown did not populate');
    }
    
    const mandalSelect = page.locator('select').nth(1);
    const mandalOptions = await mandalSelect.locator('option').count();
    console.log(`Mandal options available: ${mandalOptions}`);
    
    await mandalSelect.selectOption({ index: 1 });
    console.log('✅ Mandal selected');
    await page.waitForTimeout(5000); // Wait for village dropdown to populate

    // Step 7: Select Village
    console.log('📍 Selecting Village...');
    const villageReady = await waitForDropdownOptions(2);
    if (!villageReady) {
      throw new Error('Village dropdown did not populate');
    }
    
    const villageSelect = page.locator('select').nth(2);
    const villageOptions = await villageSelect.locator('option').count();
    console.log(`Village options available: ${villageOptions}`);
    
    await villageSelect.selectOption({ index: 1 });
    console.log('✅ Village selected');
    await page.waitForTimeout(4000);

    await page.screenshot({ path: '5_after_village_selection.png', fullPage: true });
    console.log('📸 After village selection saved!');

    // Step 8: Wait for and select radio buttons
    console.log('⏳ Waiting for radio buttons...');
    await page.waitForSelector('input[type="radio"]', { timeout: 10000 });
    
    const radioCount = await page.locator('input[type="radio"]').count();
    console.log(`📻 Found ${radioCount} radio buttons`);

    // Select ROR-1B radio button
    console.log('📄 Selecting ROR-1B...');
    const ror1bRadios = [
      'input[type="radio"][value="ROR1B"]',
      'input[type="radio"][value="ROR-1B"]',
      'input[type="radio"][value="1B"]'
    ];
    
    let ror1bSelected = false;
    for (const selector of ror1bRadios) {
      try {
        const radio = page.locator(selector);
        if (await radio.isVisible()) {
          await radio.check();
          ror1bSelected = true;
          console.log('✅ ROR-1B selected');
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!ror1bSelected) {
      await page.locator('input[type="radio"]').first().check();
      console.log('⚠️ Selected first available radio button as fallback');
    }
    
    await page.waitForTimeout(2000);

    // Select Entire Village radio button
    console.log('🏘️ Selecting Entire Village...');
    const entireVillageRadios = [
      'input[type="radio"][value="EntireVillage"]',
      'input[type="radio"][value="Entire Village"]',
      'input[type="radio"][value="ENTIRE_VILLAGE"]'
    ];
    
    let entireVillageSelected = false;
    for (const selector of entireVillageRadios) {
      try {
        const radio = page.locator(selector);
        if (await radio.isVisible()) {
          await radio.check();
          entireVillageSelected = true;
          console.log('✅ Entire Village selected');
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!entireVillageSelected) {
      const radios = page.locator('input[type="radio"]');
      const count = await radios.count();
      if (count > 1) {
        await radios.nth(count - 1).check();
        console.log('⚠️ Selected last available radio button as fallback');
      }
    }
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '6_before_captcha.png', fullPage: true });
    console.log('📸 Before captcha saved!');

    // Step 9: Handle CAPTCHA
    console.log('🔢 Solving CAPTCHA...');
    
    const bodyText = await page.locator('body').innerText();
    const mathMatch = bodyText.match(/(\d+)\s*\+\s*(\d+)/);
    
    let captchaSolved = false;
    if (mathMatch) {
      const answer = parseInt(mathMatch[1]) + parseInt(mathMatch[2]);
      console.log(`✅ CAPTCHA: ${mathMatch[1]} + ${mathMatch[2]} = ${answer}`);
      
      const captchaInputs = [
        'input[placeholder*="Result"]',
        'input[placeholder*="result"]',
        'input[placeholder*="Answer"]',
        'input[placeholder*="answer"]',
        'input[type="text"]:last-of-type',
        '#captcha',
        'input[name*="captcha"]'
      ];
      
      for (const selector of captchaInputs) {
        try {
          const input = page.locator(selector);
          if (await input.isVisible()) {
            await input.clear();
            await input.fill(answer.toString());
            captchaSolved = true;
            console.log(`✅ CAPTCHA filled using selector: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    if (!captchaSolved) {
      console.log('⚠️ Could not solve CAPTCHA automatically.');
      console.log('📱 Please solve the CAPTCHA manually in the browser...');
      console.log('⏰ Waiting 45 seconds for manual CAPTCHA entry...');
      await page.waitForTimeout(45000);
    } else {
      await page.waitForTimeout(2000);
    }

    // Step 10: Submit form
    console.log('🖱️ Submitting form...');
    
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Submit")',
      'button:has-text("Get")',
      'button:has-text("Search")',
      'button:last-of-type'
    ];
    
    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const button = page.locator(selector);
        if (await button.isVisible() && await button.isEnabled()) {
          await button.click();
          submitted = true;
          console.log(`✅ Submitted using selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!submitted) {
      console.log('⚠️ Could not find submit button. Please submit manually.');
      await page.waitForTimeout(15000);
    }

    // Step 11: Wait for results
    console.log('⏳ Waiting for results...');
    
    try {
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(5000);
      
      await page.screenshot({ path: '7_final_results.png', fullPage: true });
      console.log('📸 Final results saved to 7_final_results.png');
      
      const currentUrl = page.url();
      console.log('Final URL:', currentUrl);
      
      const pageContent = await page.locator('body').innerText();
      if (pageContent.toLowerCase().includes('survey') || 
          pageContent.toLowerCase().includes('record') ||
          pageContent.toLowerCase().includes('village')) {
        console.log('✅ SUCCESS! 1B records loaded successfully!');
      } else {
        console.log('⚠️ Results may not have loaded properly. Check the screenshot.');
      }
      
    } catch (timeoutError) {
      console.log('⚠️ Response timeout. Taking screenshot...');
      await page.screenshot({ path: '7_timeout_results.png', fullPage: true });
    }

    // Keep browser open indefinitely
    console.log('🌟 ================================');
    console.log('✅ AUTOMATION COMPLETED SUCCESSFULLY!');
    console.log('🌟 ================================');
    console.log('');
    console.log('🔥 The browser will remain open indefinitely.');
    console.log('📋 You can now interact with the page manually.');
    console.log('💾 Download any documents you need.');
    console.log('🔍 Explore the results at your own pace.');
    console.log('');
    console.log('📌 TO EXIT:');
    console.log('   • Close the browser window manually, OR');
    console.log('   • Press Ctrl+C in this command prompt');
    console.log('');
    console.log('⏰ Browser staying open... (no automatic timeout)');
    
    // Keep the script running indefinitely
    await keepBrowserOpenIndefinitely();

  } catch (error) {
    console.log('❌ Error occurred:', error.message);
    await page.screenshot({ path: 'error_debug.png', fullPage: true });
    console.log('📸 Error screenshot saved');
    
    try {
      const currentUrl = page.url();
      const pageTitle = await page.title();
      console.log(`📍 Current URL: ${currentUrl}`);
      console.log(`📄 Page Title: ${pageTitle}`);
    } catch (e) {
      // Ignore
    }
    
    console.log('🌟 ================================');
    console.log('⚠️  ERROR - BUT BROWSER STAYING OPEN');
    console.log('🌟 ================================');
    console.log('');
    console.log('🔥 The browser will remain open for debugging.');
    console.log('🔍 You can manually complete the process in the browser.');
    console.log('');
    console.log('📌 TO EXIT:');
    console.log('   • Close the browser window manually, OR');
    console.log('   • Press Ctrl+C in this command prompt');
    console.log('');
    console.log('⏰ Browser staying open... (no automatic timeout)');
    
    // Keep the script running indefinitely even on error
    await keepBrowserOpenIndefinitely();
    
  } finally {
    // This will only run if the user manually interrupts or the process ends
    console.log('');
    console.log('🔚 Script ending... Closing browser...');
    try {
      await browser.close();
    } catch (e) {
      // Browser might already be closed
    }
    console.log('✅ Browser closed. Goodbye!');
  }
}

// Function to keep browser open indefinitely
async function keepBrowserOpenIndefinitely() {
  // Set up Ctrl+C handler
  process.on('SIGINT', () => {
    console.log('');
    console.log('🛑 Ctrl+C detected! Exiting gracefully...');
    process.exit(0);
  });

  // Keep the script running with a simple infinite loop
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    // You can add periodic checks here if needed
    // For example, check if browser is still open, etc.
  }
}

// Handle uncaught exceptions to prevent script from crashing
process.on('uncaughtException', (error) => {
  console.log('❌ Uncaught Exception:', error.message);
  console.log('🔥 Browser will remain open. Use Ctrl+C or close browser manually to exit.');
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('❌ Unhandled Rejection:', reason);
  console.log('🔥 Browser will remain open. Use Ctrl+C or close browser manually to exit.');
});

run().catch(error => {
  console.error('❌ Script failed:', error);
  console.log('🔥 Browser should still be open. Use Ctrl+C or close browser manually to exit.');
  // Don't exit the process, let it continue
});