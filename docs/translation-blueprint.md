# 🌍 Translation Blueprint for Form Builder

This document provides a comprehensive blueprint for translating the Form Builder application into multiple languages, using Hebrew as the reference implementation.

## 📋 Translation Structure

### 1. Translation Files

#### `data/form-translations.json`
Contains form-specific translations including:
- Field types and descriptions
- Form elements (titles, buttons, placeholders)
- Validation messages
- File upload messages
- Signature component text
- Success messages
- Template names

#### `data/ui-translations.json`
Contains UI-specific translations including:
- Form builder interface elements
- Settings panel labels
- Button text and icons
- Tooltips and help text
- Error messages
- Navigation elements

### 2. Translation Functions

#### `getFormTranslation(category, key, language)`
Used for form-specific content:
```typescript
getFormTranslation("fieldTypes", "textInput", "he") // Returns "הזנת טקסט"
getFormTranslation("validation", "thisFieldIsRequired", "he") // Returns "שדה זה נדרש"
```

#### `getUITranslation(key, language)`
Used for UI interface elements:
```typescript
getUITranslation("formBuilder", "he") // Returns "בונה טפסים"
getUITranslation("settings", "he") // Returns "הגדרות"
```

## 🎯 Complete Translation Checklist

### ✅ Form Elements (form-translations.json)

#### Field Types & Descriptions
- [x] textInput / textInputDesc
- [x] email / emailDesc
- [x] phone / phoneDesc
- [x] longText / longTextDesc
- [x] multipleChoice / multipleChoiceDesc
- [x] checkboxes / checkboxesDesc
- [x] agreement / agreementDesc
- [x] dateTime / dateTimeDesc
- [x] fileUpload / fileUploadDesc
- [x] signature / signatureDesc
- [x] heading / headingDesc
- [x] textBlock / textBlockDesc
- [x] submitButton / submitButtonDesc

#### Form Elements
- [x] untitledForm
- [x] clickToAddTitle
- [x] clickToAddDescription
- [x] enterFormTitle
- [x] enterFormDescription
- [x] submitForm
- [x] submitting
- [x] option
- [x] agreeToTerms

#### Validation Messages
- [x] thisFieldIsRequired
- [x] pleaseSelectAnOption
- [x] pleaseUploadAFile
- [x] pleaseProvideSignature
- [x] pleaseFillRequiredField
- [x] requiredFieldError

#### File Upload
- [x] clickToUpload
- [x] fileTypes
- [x] filesUploaded
- [x] dropFilesHere
- [x] maximumFiles

#### Signature Component
- [x] electronicSignature
- [x] clickToSign
- [x] signatureCaptured
- [x] signatureRecorded
- [x] highResolution
- [x] legallyCompliant
- [x] timestamped
- [x] clickToSignButton

#### Success Messages
- [x] formSubmittedSuccessfully
- [x] thankYouSubmission
- [x] formSubmitted
- [x] thankYouSubmissionReceived
- [x] goBack
- [x] closeWindow
- [x] noButton
- [x] goBackDescription
- [x] closeWindowDescription
- [x] noButtonDescription

#### Templates
- [x] yogaClassConsent
- [x] tattooConsent
- [x] serviceAgreement
- [x] basicContact
- [x] workshopRegistration

### ✅ UI Elements (ui-translations.json)

#### Core Interface
- [x] formBuilder
- [x] settings
- [x] preview
- [x] duplicate
- [x] save
- [x] publish
- [x] editForm
- [x] addFields
- [x] quickStartTemplates

#### Form Configuration
- [x] formSettings
- [x] fieldProperties
- [x] formConfiguration
- [x] formTitle
- [x] description
- [x] language
- [x] addLanguage

#### Field Properties
- [x] fieldLabel
- [x] placeholderText
- [x] helpText
- [x] requiredField
- [x] showLabel
- [x] options
- [x] addOption
- [x] buttonText
- [x] buttonIcon
- [x] buttonStyle

#### Rich Text Editor
- [x] richTextProperties
- [x] editInFullScreen
- [x] richTextContent
- [x] enterRichTextContent
- [x] textBlockPlaceholder

#### Buttons & Actions
- [x] send
- [x] check
- [x] arrow
- [x] primary
- [x] success
- [x] secondary

#### Help & Tooltips
- [x] helpTextTooltip
- [x] helpTextPlaceholder

#### Error Handling
- [x] unknownFieldType
- [x] requiredErrorMessage

#### Navigation & Layout
- [x] logout
- [x] menu
- [x] home
- [x] newForm
- [x] refresh
- [x] myForms
- [x] manageYourForms

#### Form Management
- [x] searchForms
- [x] totalForms
- [x] published
- [x] totalResponses
- [x] draft
- [x] edit
- [x] copyLink
- [x] openForm
- [x] viewResponses
- [x] responses
- [x] response
- [x] noResponses
- [x] delete

#### Empty States
- [x] noFormsFound
- [x] noForms
- [x] tryDifferentSearch
- [x] createFirstForm
- [x] createForm
- [x] noFieldsAdded
- [x] addFieldsToSee
- [x] selectFieldToEdit

#### Notifications
- [x] notifications
- [x] emailNotifications
- [x] enableEmailNotifications
- [x] notificationEmail
- [x] notificationEmailPlaceholder
- [x] notificationMessage
- [x] notificationMessagePlaceholder
- [x] notificationMessageHelp

#### Date & Time
- [x] datePlaceholder

#### Post-Submit Settings
- [x] thankYouMessage
- [x] postSubmitTitle
- [x] postSubmitMessage
- [x] postSubmitButtonAction
- [x] postSubmitButtonText

#### Language Management
- [x] changeLanguage
- [x] languageChangeWarning
- [x] cancel
- [x] continue

## 🔧 Implementation Guidelines

### 1. RTL Language Support
For right-to-left languages like Hebrew and Arabic:
- Use `isRTL(language)` function to detect RTL languages
- Apply `dir="rtl"` and `className` adjustments
- Use `space-x-reverse` for spacing in RTL layouts

### 2. Component Integration
Each component should:
- Accept `language` prop
- Use appropriate translation function
- Handle RTL layout adjustments
- Provide fallback to English if translation missing

### 3. Translation Function Usage
```typescript
// For form content
const label = getFormTranslation("fieldTypes", "textInput", language)

// For UI elements
const title = getUITranslation("formBuilder", language)

// For validation messages
const errorMsg = getFormTranslation("validation", "thisFieldIsRequired", language)
```

### 4. Rich Text Content
For text blocks and rich content:
- Store content in `richTextContent` field
- Use `textBlockPlaceholder` for default content
- Sync between rich text editor and field display

### 5. Error Message Templates
Use placeholder replacement for dynamic content:
```typescript
// Template: "Maximum {count} files"
const message = getFormTranslation("fileUpload", "maximumFiles", language)
  .replace("{count}", maxFiles.toString())
```

## 🌐 Language Implementation Steps

### Step 1: Add Language to AVAILABLE_LANGUAGES
Update `components/form-builder/homepage.tsx` and `components/form-builder/properties-panel.tsx`:
```typescript
{ code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" }
```

### Step 2: Create Translation Files
Copy existing English translations and translate to target language:
```bash
# Copy structure
cp data/form-translations.json data/form-translations-[LANG].json
cp data/ui-translations.json data/ui-translations-[LANG].json
```

### Step 3: Update Translation Loaders
Ensure translation functions can load the new language files.

### Step 4: Test All Components
- Form builder interface
- Field properties panel
- Form preview and submission
- File upload and signature components
- Error messages and validation

### Step 5: RTL Adjustments (if needed)
For RTL languages:
- Test layout adjustments
- Verify text direction
- Check icon and button positioning

## 📝 Quality Assurance Checklist

### Translation Quality
- [ ] All text is culturally appropriate
- [ ] Technical terms are consistently translated
- [ ] No hardcoded English text remains
- [ ] Grammar and spelling are correct

### Technical Implementation
- [ ] All translation functions work correctly
- [ ] RTL layout adjustments function properly
- [ ] No console errors or warnings
- [ ] Form submission works in target language

### User Experience
- [ ] Interface feels natural in target language
- [ ] Text fits properly in UI components
- [ ] Navigation is intuitive
- [ ] Error messages are clear and helpful

## 🚀 Deployment Considerations

### Environment Variables
Set appropriate language defaults:
```env
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

### Build Optimization
- Include only needed language files in build
- Optimize translation loading for performance

### Monitoring
- Track language usage analytics
- Monitor for missing translation errors
- Collect user feedback on translation quality

## 📚 Reference Implementation

The Hebrew (he) translation serves as the complete reference implementation with:
- ✅ All 47 supported languages in language selector
- ✅ Complete form and UI translations
- ✅ Proper RTL layout support
- ✅ Rich text editor integration
- ✅ File upload and signature components
- ✅ Validation and error handling
- ✅ Form builder interface

Use this implementation as the template for adding additional languages to the system.
