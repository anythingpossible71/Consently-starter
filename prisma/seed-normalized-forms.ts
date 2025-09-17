import { PrismaClient } from '@prisma/client'
import { generateId } from '@/lib/utils/ulid'

const prisma = new PrismaClient()

async function seedNormalizedForms() {
  console.log('🌱 Seeding normalized forms data...')

  // Get the first user (admin) to assign forms to
  const adminUser = await prisma.user.findFirst({
    where: { deleted_at: null },
    include: { roles: { include: { role: true } } }
  })

  if (!adminUser) {
    console.error('❌ No admin user found. Please run the main seed script first.')
    return
  }

  console.log(`✅ Found admin user: ${adminUser.email}`)

  // Clear existing normalized form data
  await prisma.formResponse.deleteMany({ where: { deleted_at: null } })
  await prisma.formFieldTranslation.deleteMany({ where: { deleted_at: null } })
  await prisma.formField.deleteMany({ where: { deleted_at: null } })
  await prisma.form.deleteMany({ where: { deleted_at: null } })

  // Form 1: Contact Form
  const contactForm = await prisma.form.create({
    data: {
      id: generateId(),
      user_id: adminUser.id,
      title: "Contact Form",
      description: "General contact form for website visitors",
      status: "published",
      response_count: 45,
      share_url: "https://forms.example.com/contact-form",
      config: JSON.stringify({
        supportedLanguages: ["en", "es", "fr"],
        mainLanguage: "en",
        title: "Contact Form",
        description: "General contact form for website visitors",
        language: "en",
        redirectUrl: "",
        enableNotifications: true,
        notificationEmail: adminUser.email,
        notificationMessage: "You have received a new response to your form 'Contact Form'. Please log in to your dashboard to view the details.",
        selectedTheme: "default",
        customTheme: null,
        customCSS: "",
        showFrame: true,
        showBackground: true,
        backgroundColor: "#ffffff",
        formWidth: "medium",
        showLogo: false,
        logoUrl: "",
        logoPosition: "center",
        logoSize: "medium",
        enableProgressBar: false,
        enableSaveAndContinue: false,
        enableAutoSave: false,
        autoSaveInterval: 30,
        enableAnalytics: false,
        trackingId: "",
        submitButton: {
          text: "Send Message",
          style: "primary",
          icon: "send"
        }
      })
    }
  })

  // Create fields for Contact Form
  const contactFields = [
    {
      index: 0,
      type: "text",
      config: JSON.stringify({
        required: true,
        showLabel: true,
        requiredErrorMessage: "Please enter your full name"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Full Name" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your full name" },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "es", property_key: "label", translated_value: "Nombre Completo" },
        { language_code: "es", property_key: "placeholder", translated_value: "Ingresa tu nombre completo" },
        { language_code: "es", property_key: "helpText", translated_value: "" },
        { language_code: "fr", property_key: "label", translated_value: "Nom Complet" },
        { language_code: "fr", property_key: "placeholder", translated_value: "Entrez votre nom complet" },
        { language_code: "fr", property_key: "helpText", translated_value: "" }
      ]
    },
    {
      index: 1,
      type: "email",
      config: JSON.stringify({
        required: true,
        showLabel: true,
        requiredErrorMessage: "Please enter a valid email address"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Email Address" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your email address" },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "es", property_key: "label", translated_value: "Dirección de Correo" },
        { language_code: "es", property_key: "placeholder", translated_value: "Ingresa tu dirección de correo" },
        { language_code: "es", property_key: "helpText", translated_value: "" },
        { language_code: "fr", property_key: "label", translated_value: "Adresse Email" },
        { language_code: "fr", property_key: "placeholder", translated_value: "Entrez votre adresse email" },
        { language_code: "fr", property_key: "helpText", translated_value: "" }
      ]
    },
    {
      index: 2,
      type: "phone",
      config: JSON.stringify({
        required: false,
        showLabel: true,
        phoneSettings: {
          format: "national",
          defaultCountryCode: "US",
          showCountrySelector: true,
          enableValidation: true,
          validationMessage: "Please enter a valid phone number"
        },
        requiredErrorMessage: "Please enter a valid phone number"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Phone Number" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your phone number" },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "es", property_key: "label", translated_value: "Número de Teléfono" },
        { language_code: "es", property_key: "placeholder", translated_value: "Ingresa tu número de teléfono" },
        { language_code: "es", property_key: "helpText", translated_value: "" },
        { language_code: "fr", property_key: "label", translated_value: "Numéro de Téléphone" },
        { language_code: "fr", property_key: "placeholder", translated_value: "Entrez votre numéro de téléphone" },
        { language_code: "fr", property_key: "helpText", translated_value: "" }
      ]
    },
    {
      index: 3,
      type: "textarea",
      config: JSON.stringify({
        required: true,
        showLabel: true,
        requiredErrorMessage: "Please enter your message"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Message" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your message here..." },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "es", property_key: "label", translated_value: "Mensaje" },
        { language_code: "es", property_key: "placeholder", translated_value: "Ingresa tu mensaje aquí..." },
        { language_code: "es", property_key: "helpText", translated_value: "" },
        { language_code: "fr", property_key: "label", translated_value: "Message" },
        { language_code: "fr", property_key: "placeholder", translated_value: "Entrez votre message ici..." },
        { language_code: "fr", property_key: "helpText", translated_value: "" }
      ]
    }
  ]

  for (const fieldData of contactFields) {
    const { translations, ...fieldInfo } = fieldData
    const field = await prisma.formField.create({
      data: {
        id: generateId(),
        form_id: contactForm.id,
        ...fieldInfo
      }
    })

    // Create translations for this field
    for (const translation of translations) {
      await prisma.formFieldTranslation.create({
        data: {
          id: generateId(),
          field_id: field.id,
          ...translation
        }
      })
    }
  }

  console.log(`✅ Created form: ${contactForm.title} with ${contactFields.length} fields`)

  // Form 2: Event Registration
  const eventForm = await prisma.form.create({
    data: {
      id: generateId(),
      user_id: adminUser.id,
      title: "Event Registration",
      description: "Registration form for upcoming conference",
      status: "published",
      response_count: 128,
      share_url: "https://forms.example.com/event-registration",
      config: JSON.stringify({
        supportedLanguages: ["en", "de", "it"],
        mainLanguage: "en",
        title: "Event Registration",
        description: "Registration form for upcoming conference",
        language: "en",
        redirectUrl: "",
        enableNotifications: true,
        notificationEmail: adminUser.email,
        notificationMessage: "You have received a new response to your form 'Event Registration'. Please log in to your dashboard to view the details.",
        selectedTheme: "modern",
        customTheme: null,
        customCSS: "",
        showFrame: true,
        showBackground: true,
        backgroundColor: "#f8fafc",
        formWidth: "medium",
        showLogo: false,
        logoUrl: "",
        logoPosition: "center",
        logoSize: "medium",
        enableProgressBar: true,
        enableSaveAndContinue: true,
        enableAutoSave: true,
        autoSaveInterval: 30,
        enableAnalytics: false,
        trackingId: "",
        submitButton: {
          text: "Register Now",
          style: "success",
          icon: "check"
        }
      })
    }
  })

  // Create fields for Event Registration
  const eventFields = [
    {
      index: 0,
      type: "text",
      config: JSON.stringify({
        required: true,
        showLabel: true,
        requiredErrorMessage: "Please enter your full name"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Full Name" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your full name" },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "de", property_key: "label", translated_value: "Vollständiger Name" },
        { language_code: "de", property_key: "placeholder", translated_value: "Geben Sie Ihren vollständigen Namen ein" },
        { language_code: "de", property_key: "helpText", translated_value: "" },
        { language_code: "it", property_key: "label", translated_value: "Nome Completo" },
        { language_code: "it", property_key: "placeholder", translated_value: "Inserisci il tuo nome completo" },
        { language_code: "it", property_key: "helpText", translated_value: "" }
      ]
    },
    {
      index: 1,
      type: "email",
      config: JSON.stringify({
        required: true,
        showLabel: true,
        requiredErrorMessage: "Please enter a valid email address"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Email Address" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your email address" },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "de", property_key: "label", translated_value: "E-Mail-Adresse" },
        { language_code: "de", property_key: "placeholder", translated_value: "Geben Sie Ihre E-Mail-Adresse ein" },
        { language_code: "de", property_key: "helpText", translated_value: "" },
        { language_code: "it", property_key: "label", translated_value: "Indirizzo Email" },
        { language_code: "it", property_key: "placeholder", translated_value: "Inserisci il tuo indirizzo email" },
        { language_code: "it", property_key: "helpText", translated_value: "" }
      ]
    },
    {
      index: 2,
      type: "phone",
      config: JSON.stringify({
        required: true,
        showLabel: true,
        phoneSettings: {
          format: "national",
          defaultCountryCode: "US",
          showCountrySelector: true,
          enableValidation: true,
          validationMessage: "Please enter a valid phone number"
        },
        requiredErrorMessage: "Please enter a valid phone number"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Phone Number" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your phone number" },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "de", property_key: "label", translated_value: "Telefonnummer" },
        { language_code: "de", property_key: "placeholder", translated_value: "Geben Sie Ihre Telefonnummer ein" },
        { language_code: "de", property_key: "helpText", translated_value: "" },
        { language_code: "it", property_key: "label", translated_value: "Numero di Telefono" },
        { language_code: "it", property_key: "placeholder", translated_value: "Inserisci il tuo numero di telefono" },
        { language_code: "it", property_key: "helpText", translated_value: "" }
      ]
    },
    {
      index: 3,
      type: "multiple-choice",
      config: JSON.stringify({
        required: false,
        showLabel: true,
        options: ["None", "Vegetarian", "Vegan", "Gluten-free", "Other"],
        requiredErrorMessage: "Please select an option"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Dietary Requirements" },
        { language_code: "en", property_key: "helpText", translated_value: "Please let us know about any dietary restrictions" },
        { language_code: "de", property_key: "label", translated_value: "Diätanforderungen" },
        { language_code: "de", property_key: "helpText", translated_value: "Bitte teilen Sie uns eventuelle Diätbeschränkungen mit" },
        { language_code: "it", property_key: "label", translated_value: "Requisiti Dietetici" },
        { language_code: "it", property_key: "helpText", translated_value: "Facci sapere di eventuali restrizioni dietetiche" }
      ]
    },
    {
      index: 4,
      type: "textarea",
      config: JSON.stringify({
        required: false,
        showLabel: true,
        requiredErrorMessage: "This field is required"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Special Requests" },
        { language_code: "en", property_key: "placeholder", translated_value: "Any special requests or accommodations needed?" },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "de", property_key: "label", translated_value: "Besondere Wünsche" },
        { language_code: "de", property_key: "placeholder", translated_value: "Besondere Wünsche oder Unterbringungsanforderungen?" },
        { language_code: "de", property_key: "helpText", translated_value: "" },
        { language_code: "it", property_key: "label", translated_value: "Richieste Speciali" },
        { language_code: "it", property_key: "placeholder", translated_value: "Richieste speciali o sistemazioni necessarie?" },
        { language_code: "it", property_key: "helpText", translated_value: "" }
      ]
    }
  ]

  for (const fieldData of eventFields) {
    const { translations, ...fieldInfo } = fieldData
    const field = await prisma.formField.create({
      data: {
        id: generateId(),
        form_id: eventForm.id,
        ...fieldInfo
      }
    })

    // Create translations for this field
    for (const translation of translations) {
      await prisma.formFieldTranslation.create({
        data: {
          id: generateId(),
          field_id: field.id,
          ...translation
        }
      })
    }
  }

  console.log(`✅ Created form: ${eventForm.title} with ${eventFields.length} fields`)

  // Form 3: Customer Feedback
  const feedbackForm = await prisma.form.create({
    data: {
      id: generateId(),
      user_id: adminUser.id,
      title: "Customer Feedback",
      description: "Collect feedback from customers",
      status: "draft",
      response_count: 0,
      share_url: null,
      config: JSON.stringify({
        supportedLanguages: ["en", "ar", "he"],
        mainLanguage: "en",
        title: "Customer Feedback",
        description: "Collect feedback from customers",
        language: "en",
        redirectUrl: "",
        enableNotifications: true,
        notificationEmail: adminUser.email,
        notificationMessage: "You have received a new response to your form 'Customer Feedback'. Please log in to your dashboard to view the details.",
        selectedTheme: "minimal",
        customTheme: null,
        customCSS: "",
        showFrame: true,
        showBackground: true,
        backgroundColor: "#ffffff",
        formWidth: "medium",
        showLogo: false,
        logoUrl: "",
        logoPosition: "center",
        logoSize: "medium",
        enableProgressBar: false,
        enableSaveAndContinue: false,
        enableAutoSave: false,
        autoSaveInterval: 30,
        enableAnalytics: false,
        trackingId: "",
        submitButton: {
          text: "Submit Feedback",
          style: "primary",
          icon: "send"
        }
      })
    }
  })

  // Create fields for Customer Feedback
  const feedbackFields = [
    {
      index: 0,
      type: "multiple-choice",
      config: JSON.stringify({
        required: true,
        showLabel: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
        requiredErrorMessage: "Please select your satisfaction level"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "How satisfied are you?" },
        { language_code: "en", property_key: "helpText", translated_value: "Please rate your overall satisfaction" },
        { language_code: "ar", property_key: "label", translated_value: "ما مدى رضاك؟" },
        { language_code: "ar", property_key: "helpText", translated_value: "يرجى تقييم رضاك العام" },
        { language_code: "he", property_key: "label", translated_value: "כמה אתה מרוצה?" },
        { language_code: "he", property_key: "helpText", translated_value: "אנא דרג את שביעות הרצון הכללית שלך" }
      ]
    },
    {
      index: 1,
      type: "checkboxes",
      config: JSON.stringify({
        required: false,
        showLabel: true,
        options: ["Product Quality", "Customer Service", "Price", "Delivery Speed", "Website Experience"],
        requiredErrorMessage: "Please select at least one option"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "What did you like most?" },
        { language_code: "en", property_key: "helpText", translated_value: "Select all that apply" },
        { language_code: "ar", property_key: "label", translated_value: "ما الذي أعجبك أكثر؟" },
        { language_code: "ar", property_key: "helpText", translated_value: "اختر كل ما ينطبق" },
        { language_code: "he", property_key: "label", translated_value: "מה הכי אהבת?" },
        { language_code: "he", property_key: "helpText", translated_value: "בחר את כל מה שחל" }
      ]
    },
    {
      index: 2,
      type: "textarea",
      config: JSON.stringify({
        required: false,
        showLabel: true,
        requiredErrorMessage: "This field is required"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Additional Comments" },
        { language_code: "en", property_key: "placeholder", translated_value: "Please share any additional feedback..." },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "ar", property_key: "label", translated_value: "تعليقات إضافية" },
        { language_code: "ar", property_key: "placeholder", translated_value: "يرجى مشاركة أي ملاحظات إضافية..." },
        { language_code: "ar", property_key: "helpText", translated_value: "" },
        { language_code: "he", property_key: "label", translated_value: "הערות נוספות" },
        { language_code: "he", property_key: "placeholder", translated_value: "אנא שתף כל משוב נוסף..." },
        { language_code: "he", property_key: "helpText", translated_value: "" }
      ]
    },
    {
      index: 3,
      type: "text",
      config: JSON.stringify({
        required: false,
        showLabel: true,
        requiredErrorMessage: "Please enter your name"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Your Name (Optional)" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your name" },
        { language_code: "en", property_key: "helpText", translated_value: "" },
        { language_code: "ar", property_key: "label", translated_value: "اسمك (اختياري)" },
        { language_code: "ar", property_key: "placeholder", translated_value: "أدخل اسمك" },
        { language_code: "ar", property_key: "helpText", translated_value: "" },
        { language_code: "he", property_key: "label", translated_value: "השם שלך (אופציונלי)" },
        { language_code: "he", property_key: "placeholder", translated_value: "הזן את שמך" },
        { language_code: "he", property_key: "helpText", translated_value: "" }
      ]
    },
    {
      index: 4,
      type: "email",
      config: JSON.stringify({
        required: false,
        showLabel: true,
        requiredErrorMessage: "Please enter a valid email address"
      }),
      translations: [
        { language_code: "en", property_key: "label", translated_value: "Email (Optional)" },
        { language_code: "en", property_key: "placeholder", translated_value: "Enter your email address" },
        { language_code: "en", property_key: "helpText", translated_value: "We'll use this to follow up if needed" },
        { language_code: "ar", property_key: "label", translated_value: "البريد الإلكتروني (اختياري)" },
        { language_code: "ar", property_key: "placeholder", translated_value: "أدخل عنوان بريدك الإلكتروني" },
        { language_code: "ar", property_key: "helpText", translated_value: "سنستخدم هذا للمتابعة إذا لزم الأمر" },
        { language_code: "he", property_key: "label", translated_value: "אימייל (אופציונלי)" },
        { language_code: "he", property_key: "placeholder", translated_value: "הזן את כתובת האימייל שלך" },
        { language_code: "he", property_key: "helpText", translated_value: "נשתמש בזה למעקב אם נדרש" }
      ]
    }
  ]

  for (const fieldData of feedbackFields) {
    const { translations, ...fieldInfo } = fieldData
    const field = await prisma.formField.create({
      data: {
        id: generateId(),
        form_id: feedbackForm.id,
        ...fieldInfo
      }
    })

    // Create translations for this field
    for (const translation of translations) {
      await prisma.formFieldTranslation.create({
        data: {
          id: generateId(),
          field_id: field.id,
          ...translation
        }
      })
    }
  }

  console.log(`✅ Created form: ${feedbackForm.title} with ${feedbackFields.length} fields`)

  // Add some sample responses to the published forms
  const sampleResponses = [
    // Responses for Contact Form
    {
      form_id: contactForm.id,
      data: JSON.stringify({
        "Full Name": "John Doe",
        "Email Address": "john.doe@example.com",
        "Phone Number": "+1-555-123-4567",
        "Message": "I'm interested in learning more about your services. Can you please send me more information?"
      }),
      ip_address: "192.168.1.100",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
      form_id: contactForm.id,
      data: JSON.stringify({
        "Full Name": "Jane Smith",
        "Email Address": "jane.smith@example.com",
        "Phone Number": "+1-555-987-6543",
        "Message": "I have a question about your pricing plans. Could someone contact me?"
      }),
      ip_address: "192.168.1.101",
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    },
    // Responses for Event Registration
    {
      form_id: eventForm.id,
      data: JSON.stringify({
        "Full Name": "Alice Johnson",
        "Email Address": "alice.johnson@example.com",
        "Phone Number": "+1-555-456-7890",
        "Dietary Requirements": "Vegetarian",
        "Special Requests": "I need wheelchair access to the venue"
      }),
      ip_address: "192.168.1.102",
      user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15"
    },
    {
      form_id: eventForm.id,
      data: JSON.stringify({
        "Full Name": "Bob Wilson",
        "Email Address": "bob.wilson@example.com",
        "Phone Number": "+1-555-321-0987",
        "Dietary Requirements": "None",
        "Special Requests": ""
      }),
      ip_address: "192.168.1.103",
      user_agent: "Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0"
    }
  ]

  for (const responseData of sampleResponses) {
    await prisma.formResponse.create({
      data: {
        id: generateId(),
        ...responseData
      }
    })
  }

  console.log(`✅ Created ${sampleResponses.length} sample responses`)

  console.log('🎉 Normalized forms seeding completed!')
}

// Run the seeding function
seedNormalizedForms()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export default seedNormalizedForms
