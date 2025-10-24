// Automated test to verify the swap functionality
const puppeteer = require('puppeteer');

async function runTests() {
    console.log('🚀 Starting automated swap persistence tests...');

    try {
        const browser = await puppeteer.launch({ headless: false, devtools: true });
        const page = await browser.newPage();

        // Navigate to our test page
        await page.goto('http://localhost:8000/test_final.html');

        console.log('📄 Page loaded successfully');

        // Wait for initialization
        await page.waitForTimeout(1000);

        // Test 1: Verify initial state
        console.log('\n🧪 Test 1: Verifying initial state...');
        const initialS01 = await page.$eval('#S01_Vol', el => el.textContent);
        const initialS02 = await page.$eval('#S02_Vol', el => el.textContent);
        console.log(`Initial values - S01: ${initialS01}, S02: ${initialS02}`);

        // Test 2: Perform swap
        console.log('\n🧪 Test 2: Performing swap...');
        await page.click('button[onclick="performSwap()"]');
        await page.waitForTimeout(500);

        const swappedS01 = await page.$eval('#S01_Vol', el => el.textContent);
        const swappedS02 = await page.$eval('#S02_Vol', el => el.textContent);
        console.log(`After swap - S01: ${swappedS01}, S02: ${swappedS02}`);

        const swapWorked = (swappedS01 === initialS02) && (swappedS02 === initialS01);
        console.log(`Swap success: ${swapWorked ? '✅ PASS' : '❌ FAIL'}`);

        // Test 3: Simulate hour change (the critical test)
        console.log('\n🧪 Test 3: Simulating hour change...');
        await page.click('button[onclick="simulateHourChange()"]');
        await page.waitForTimeout(2000); // Wait for simulation to complete

        const restoredS01 = await page.$eval('#S01_Vol', el => el.textContent);
        const restoredS02 = await page.$eval('#S02_Vol', el => el.textContent);
        console.log(`After hour change - S01: ${restoredS01}, S02: ${restoredS02}`);

        const persistenceWorked = (restoredS01 === initialS02) && (restoredS02 === initialS01);
        console.log(`Persistence success: ${persistenceWorked ? '✅ PASS' : '❌ FAIL'}`);

        // Check status
        const status = await page.$eval('#status', el => el.textContent);
        console.log(`Status: ${status}`);

        // Get console logs from the page
        const logs = await page.evaluate(() => {
            return document.getElementById('log').textContent;
        });
        console.log('\n📋 Page logs:');
        console.log(logs);

        // Final result
        const allTestsPassed = swapWorked && persistenceWorked;
        console.log(`\n🎯 Final Result: ${allTestsPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);

        if (allTestsPassed) {
            console.log('✅ The swap persistence system is working correctly!');
            console.log('✅ Swaps will now persist across hour changes as requested.');
        } else {
            console.log('❌ Issues detected in the swap persistence system.');
        }

        // Keep browser open for manual inspection
        console.log('\n👀 Browser will remain open for manual inspection...');
        // await browser.close();

    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

// Check if puppeteer is available
try {
    runTests();
} catch (e) {
    console.log('⚠️ Puppeteer not available, running manual test instead...');
    console.log('Please open http://localhost:8000/test_final.html in your browser');
    console.log('1. Click "Swap S01 ↔ S02"');
    console.log('2. Click "Simulate Hour Change"');
    console.log('3. Verify the swap persists after the simulated reload');
}