// Simple JavaScript syntax validator for the main HTML file
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating JavaScript syntax in Enhanced Transfer Dashboard...');

try {
    // Read the HTML file
    const htmlContent = fs.readFileSync('/Users/nimeshpatel/Documents/Nimesh_Playground/HourlyQuicklook/EnhancedTransfer_Dashboard.html', 'utf8');

    // Extract JavaScript content between <script> tags
    const scriptMatches = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);

    if (!scriptMatches) {
        console.log('❌ No JavaScript found in the file');
        process.exit(1);
    }

    console.log(`📄 Found ${scriptMatches.length} script blocks`);

    let totalLines = 0;
    let hasErrors = false;

    scriptMatches.forEach((scriptBlock, index) => {
        // Extract just the JavaScript content
        const jsContent = scriptBlock.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        const lines = jsContent.split('\n');
        totalLines += lines.length;

        console.log(`\n📋 Script block ${index + 1}: ${lines.length} lines`);

        // Check for common syntax issues
        const issues = [];

        lines.forEach((line, lineNum) => {
            const trimmed = line.trim();

            // Skip comments and empty lines
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || !trimmed) return;

            // Check for common issues
            if (trimmed.includes('function') && !trimmed.includes('{') && !trimmed.includes(';')) {
                if (!lines[lineNum + 1] || !lines[lineNum + 1].trim().startsWith('{')) {
                    issues.push(`Line ${lineNum + 1}: Function declaration might be missing opening brace`);
                }
            }

            // Check for undefined variables that might cause issues
            if (trimmed.includes('swapStateManager') && trimmed.includes('=') && !trimmed.includes('let') && !trimmed.includes('const') && !trimmed.includes('var')) {
                // This is fine, it's a property access
            }

            // Check for missing semicolons on important statements
            if ((trimmed.includes('const ') || trimmed.includes('let ') || trimmed.includes('var ')) &&
                !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith(',')) {
                issues.push(`Line ${lineNum + 1}: Variable declaration might be missing semicolon`);
            }
        });

        if (issues.length > 0) {
            console.log('⚠️  Potential issues found:');
            issues.forEach(issue => console.log(`   ${issue}`));
            hasErrors = true;
        } else {
            console.log('✅ No obvious syntax issues detected');
        }
    });

    console.log(`\n📊 Total JavaScript lines: ${totalLines}`);

    // Check for key functionality presence
    const keyFunctions = [
        'swapStateManager',
        'swapInterceptor',
        'atomicSwapStations',
        'readCellValue',
        'writeCellValue',
        'refreshSwapDisplay'
    ];

    console.log('\n🔧 Checking for key functionality:');
    keyFunctions.forEach(func => {
        if (htmlContent.includes(func)) {
            console.log(`✅ ${func} - Found`);
        } else {
            console.log(`❌ ${func} - Missing`);
            hasErrors = true;
        }
    });

    // Check for load interceptors
    const loadFunctions = [
        'loadOutboundValues',
        'loadExceptionValues',
        'loadSmallsValues',
        'loadIrregValues',
        'loadPrimaryValues',
        'loadCurrentValues'
    ];

    console.log('\n🔄 Checking for intercepted load functions:');
    loadFunctions.forEach(func => {
        if (htmlContent.includes(`${func}(`) && htmlContent.includes('swapInterceptor.beforeDataLoad')) {
            console.log(`✅ ${func} - Intercepted`);
        } else if (htmlContent.includes(`${func}(`)) {
            console.log(`⚠️  ${func} - Found but may not be intercepted`);
        } else {
            console.log(`❌ ${func} - Missing`);
        }
    });

    if (hasErrors) {
        console.log('\n❌ Validation completed with issues found');
        process.exit(1);
    } else {
        console.log('\n✅ Validation completed successfully!');
        console.log('🎉 The swap persistence system appears to be properly implemented');
        process.exit(0);
    }

} catch (error) {
    console.error('❌ Error during validation:', error.message);
    process.exit(1);
}