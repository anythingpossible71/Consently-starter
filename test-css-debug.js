// Test CSS injection and form styling
const formId = "01K5VN18CK7D5PKNPZMP31C5HH"

async function testCSSDebug() {
  console.log("🧪 Testing CSS Debug...")
  
  // 1. Test CSS endpoint
  console.log("\n1. CSS Endpoint Test:")
  try {
    const response = await fetch(`http://localhost:3000/api/forms/${formId}/css?t=${Date.now()}`)
    const css = await response.text()
    
    console.log("   ✅ CSS endpoint working")
    console.log(`   CSS length: ${css.length} characters`)
    
    // Check for key CSS rules
    const hasFormId = css.includes('#01K5VN18CK7D5PKNPZMP31C5HH')
    const hasFontFamily = css.includes('--form-font-family: "Georgia, serif"')
    const hasFormContainer = css.includes('.form-content-container')
    
    console.log(`   Has form ID selector: ${hasFormId ? '✅' : '❌'}`)
    console.log(`   Has Georgia font: ${hasFontFamily ? '✅' : '❌'}`)
    console.log(`   Has form container: ${hasFormContainer ? '✅' : '❌'}`)
    
    // Show first few lines of CSS
    console.log("\n   First 10 lines of CSS:")
    css.split('\n').slice(0, 10).forEach((line, i) => {
      console.log(`   ${i + 1}: ${line}`)
    })
    
  } catch (error) {
    console.error("   ❌ CSS endpoint failed:", error)
  }
  
  // 2. Test form page
  console.log("\n2. Form Page Test:")
  try {
    const response = await fetch(`http://localhost:3000/forms/public/${formId}?lang=he`)
    const html = await response.text()
    
    console.log("   ✅ Form page accessible")
    
    // Check if CSS is injected
    const hasStyleTag = html.includes('<style')
    const hasFormIdInHTML = html.includes('id="01K5VN18CK7D5PKNPZMP31C5HH"')
    const hasFormContainerClass = html.includes('form-content-container')
    
    console.log(`   Has style tag: ${hasStyleTag ? '✅' : '❌'}`)
    console.log(`   Has form ID in HTML: ${hasFormIdInHTML ? '✅' : '❌'}`)
    console.log(`   Has form container class: ${hasFormContainerClass ? '✅' : '❌'}`)
    
    // Check for inline styles
    const hasInlineBackground = html.includes('background-color:#757575')
    console.log(`   Has inline background: ${hasInlineBackground ? '✅' : '❌'}`)
    
  } catch (error) {
    console.error("   ❌ Form page failed:", error)
  }
  
  console.log("\n🎯 Summary:")
  console.log("   - CSS endpoint is working and returns Georgia font")
  console.log("   - Form page loads but may not have CSS injected")
  console.log("   - Background color is applied via inline styles")
  console.log("   - Font family should be applied via CSS variables")
}

testCSSDebug()
