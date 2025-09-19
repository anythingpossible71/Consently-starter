import { PrismaClient } from '@prisma/client'
import { generateId } from '@/lib/utils/ulid'

const prisma = new PrismaClient()

async function seedForms() {
  console.log('🌱 Seeding forms data...')

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

  // Clear existing forms
  await prisma.formResponse.deleteMany({ where: { deleted_at: null } })
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
      }),
      fields: {
        create: [
          {
            id: generateId(),
            index: 0,
            type: "text",
            config: JSON.stringify({
              id: generateId(),
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              helpText: "",
              required: true,
              showLabel: true,
              requiredErrorMessage: "Please enter your full name"
            })
          },
          {
            id: generateId(),
            index: 1,
            type: "email",
            config: JSON.stringify({
              id: generateId(),
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email address",
              helpText: "",
              required: true,
              showLabel: true,
              requiredErrorMessage: "Please enter a valid email address"
            })
          },
          {
            id: generateId(),
            index: 2,
            type: "phone",
            config: JSON.stringify({
              id: generateId(),
              type: "phone",
              label: "Phone Number",
              placeholder: "Enter your phone number",
              helpText: "",
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
            })
          },
          {
            id: generateId(),
            index: 3,
            type: "textarea",
            config: JSON.stringify({
              id: generateId(),
              type: "textarea",
              label: "Message",
              placeholder: "Enter your message here...",
              helpText: "",
              required: true,
              showLabel: true,
              requiredErrorMessage: "Please enter your message"
            })
          }
        ]
      }
    }
  })

  console.log(`✅ Created form: ${contactForm.title}`)

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
      }),
      fields: {
        create: [
          {
            id: generateId(),
            index: 0,
            type: "text",
            config: JSON.stringify({
              id: generateId(),
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              helpText: "",
              required: true,
              showLabel: true,
              requiredErrorMessage: "Please enter your full name"
            })
          },
          {
            id: generateId(),
            index: 1,
            type: "email",
            config: JSON.stringify({
              id: generateId(),
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email address",
              helpText: "",
              required: true,
              showLabel: true,
              requiredErrorMessage: "Please enter a valid email address"
            })
          },
          {
            id: generateId(),
            index: 2,
            type: "phone",
            config: JSON.stringify({
              id: generateId(),
              type: "phone",
              label: "Phone Number",
              placeholder: "Enter your phone number",
              helpText: "",
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
            })
          },
          {
            id: generateId(),
            index: 3,
            type: "multiple-choice",
            config: JSON.stringify({
              id: generateId(),
              type: "multiple-choice",
              label: "Dietary Requirements",
              helpText: "Please let us know about any dietary restrictions",
              required: false,
              showLabel: true,
              options: ["None", "Vegetarian", "Vegan", "Gluten-free", "Other"],
              requiredErrorMessage: "Please select an option"
            })
          },
          {
            id: generateId(),
            index: 4,
            type: "textarea",
            config: JSON.stringify({
              id: generateId(),
              type: "textarea",
              label: "Special Requests",
              placeholder: "Any special requests or accommodations needed?",
              helpText: "",
              required: false,
              showLabel: true,
              requiredErrorMessage: "This field is required"
            })
          }
        ]
      }
    }
  })

  console.log(`✅ Created form: ${eventForm.title}`)

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
      }),
      fields: {
        create: [
          {
            id: generateId(),
            index: 0,
            type: "multiple-choice",
            config: JSON.stringify({
              id: generateId(),
              type: "multiple-choice",
              label: "How satisfied are you?",
              helpText: "Please rate your overall satisfaction",
              required: true,
              showLabel: true,
              options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
              requiredErrorMessage: "Please select your satisfaction level"
            })
          },
          {
            id: generateId(),
            index: 1,
            type: "checkboxes",
            config: JSON.stringify({
              id: generateId(),
              type: "checkboxes",
              label: "What did you like most?",
              helpText: "Select all that apply",
              required: false,
              showLabel: true,
              options: ["Product Quality", "Customer Service", "Price", "Delivery Speed", "Website Experience"],
              requiredErrorMessage: "Please select at least one option"
            })
          },
          {
            id: generateId(),
            index: 2,
            type: "textarea",
            config: JSON.stringify({
              id: generateId(),
              type: "textarea",
              label: "Additional Comments",
              placeholder: "Please share any additional feedback...",
              helpText: "",
              required: false,
              showLabel: true,
              requiredErrorMessage: "This field is required"
            })
          },
          {
            id: generateId(),
            index: 3,
            type: "text",
            config: JSON.stringify({
              id: generateId(),
              type: "text",
              label: "Your Name (Optional)",
              placeholder: "Enter your name",
              helpText: "",
              required: false,
              showLabel: true,
              requiredErrorMessage: "Please enter your name"
            })
          },
          {
            id: generateId(),
            index: 4,
            type: "email",
            config: JSON.stringify({
              id: generateId(),
              type: "email",
              label: "Email (Optional)",
              placeholder: "Enter your email address",
              helpText: "We'll use this to follow up if needed",
              required: false,
              showLabel: true,
              requiredErrorMessage: "Please enter a valid email address"
            })
          }
        ]
      }
    }
  })

  console.log(`✅ Created form: ${feedbackForm.title}`)

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

  console.log('🎉 Forms seeding completed!')
}

// Run the seeding function
seedForms()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export default seedForms
