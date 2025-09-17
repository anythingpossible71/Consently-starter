import { PrismaClient } from '@prisma/client'
import { generateId } from '@/lib/utils/ulid'

const prisma = new PrismaClient()

async function seedFormBuilder() {
  console.log('🌱 Seeding form builder data...')

  // Clear existing form builder data
  await prisma.formTemplate.deleteMany({ where: { deleted_at: null } })
  await prisma.formFieldTemplate.deleteMany({ where: { deleted_at: null } })
  await prisma.formFieldProperty.deleteMany({ where: { deleted_at: null } })
  await prisma.formFieldType.deleteMany({ where: { deleted_at: null } })
  await prisma.formTheme.deleteMany({ where: { deleted_at: null } })

  // Create form field types
  const fieldTypes = [
    // Input Fields
    {
      type: 'text',
      name: 'Text Input',
      description: 'Single line text entry',
      icon: 'type',
      category: 'input',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Text Input"',
          display_name: 'Field Label',
          description: 'The label displayed above the input field',
          input_type: 'text'
        },
        {
          property_key: 'placeholder',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Placeholder Text',
          description: 'Hint text shown inside the input field',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"This field is required"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    {
      type: 'email',
      name: 'Email',
      description: 'Email address with validation',
      icon: 'mail',
      category: 'input',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Email Address"',
          display_name: 'Field Label',
          description: 'The label displayed above the input field',
          input_type: 'text'
        },
        {
          property_key: 'placeholder',
          property_type: 'string',
          is_required: false,
          default_value: '"Enter your email address"',
          display_name: 'Placeholder Text',
          description: 'Hint text shown inside the input field',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"Please enter a valid email address"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    {
      type: 'phone',
      name: 'Phone',
      description: 'Phone number input with country support',
      icon: 'phone',
      category: 'input',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Phone Number"',
          display_name: 'Field Label',
          description: 'The label displayed above the input field',
          input_type: 'text'
        },
        {
          property_key: 'placeholder',
          property_type: 'string',
          is_required: false,
          default_value: '"Enter your phone number"',
          display_name: 'Placeholder Text',
          description: 'Hint text shown inside the input field',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'phoneSettings',
          property_type: 'object',
          is_required: false,
          default_value: '{"format":"national","defaultCountryCode":"US","showCountrySelector":true,"enableValidation":true,"validationMessage":"Please enter a valid phone number"}',
          display_name: 'Phone Settings',
          description: 'Configuration for phone number formatting and validation',
          input_type: 'object'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"Please enter a valid phone number"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    {
      type: 'textarea',
      name: 'Long Text',
      description: 'Multi-line text area',
      icon: 'align-left',
      category: 'input',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Message"',
          display_name: 'Field Label',
          description: 'The label displayed above the input field',
          input_type: 'text'
        },
        {
          property_key: 'placeholder',
          property_type: 'string',
          is_required: false,
          default_value: '"Enter your message here..."',
          display_name: 'Placeholder Text',
          description: 'Hint text shown inside the input field',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"This field is required"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    // Selection Fields
    {
      type: 'multiple-choice',
      name: 'Multiple Choice',
      description: 'Radio buttons (select one)',
      icon: 'circle',
      category: 'selection',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Choose an option"',
          display_name: 'Field Label',
          description: 'The label displayed above the options',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'options',
          property_type: 'array',
          is_required: true,
          default_value: '["Option 1","Option 2","Option 3"]',
          display_name: 'Options',
          description: 'List of available options to choose from',
          input_type: 'array'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"Please select an option"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    {
      type: 'checkboxes',
      name: 'Checkboxes',
      description: 'Multiple selection options',
      icon: 'check-square',
      category: 'selection',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Select all that apply"',
          display_name: 'Field Label',
          description: 'The label displayed above the options',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'options',
          property_type: 'array',
          is_required: true,
          default_value: '["Option 1","Option 2","Option 3"]',
          display_name: 'Options',
          description: 'List of available options to choose from',
          input_type: 'array'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"Please select at least one option"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    {
      type: 'agreement',
      name: 'Agreement',
      description: 'Single checkbox for terms and conditions',
      icon: 'check',
      category: 'selection',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"I agree to the terms and conditions"',
          display_name: 'Agreement Text',
          description: 'The text displayed next to the checkbox',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"You must agree to the terms and conditions"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    // Media Fields
    {
      type: 'file-upload',
      name: 'File Upload',
      description: 'Document/image upload',
      icon: 'upload',
      category: 'media',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Upload File"',
          display_name: 'Field Label',
          description: 'The label displayed above the upload area',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '"Click to upload or drag and drop"',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'acceptedFileTypes',
          property_type: 'string',
          is_required: false,
          default_value: '".pdf,.doc,.docx,.jpg,.jpeg,.png"',
          display_name: 'Accepted File Types',
          description: 'Comma-separated list of accepted file extensions',
          input_type: 'text'
        },
        {
          property_key: 'maxFileSize',
          property_type: 'number',
          is_required: false,
          default_value: '10485760',
          display_name: 'Max File Size (bytes)',
          description: 'Maximum file size in bytes (10MB = 10485760)',
          input_type: 'number'
        },
        {
          property_key: 'maxFiles',
          property_type: 'number',
          is_required: false,
          default_value: '1',
          display_name: 'Max Files',
          description: 'Maximum number of files that can be uploaded',
          input_type: 'number'
        },
        {
          property_key: 'allowMultipleFiles',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Allow Multiple Files',
          description: 'Whether multiple files can be uploaded',
          input_type: 'checkbox'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"Please upload a file"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    {
      type: 'signature',
      name: 'Signature',
      description: 'Electronic signature capture',
      icon: 'edit-3',
      category: 'media',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Electronic Signature"',
          display_name: 'Field Label',
          description: 'The label displayed above the signature area',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '"Click to sign with your finger, mouse, or upload signature"',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'true',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        },
        {
          property_key: 'signatureMethods',
          property_type: 'object',
          is_required: false,
          default_value: '{"draw":true,"upload":true}',
          display_name: 'Signature Methods',
          description: 'Available signature capture methods',
          input_type: 'object'
        },
        {
          property_key: 'signatureSettings',
          property_type: 'object',
          is_required: false,
          default_value: '{"showColorPicker":true,"defaultColor":"black"}',
          display_name: 'Signature Settings',
          description: 'Configuration for signature appearance',
          input_type: 'object'
        },
        {
          property_key: 'requiredErrorMessage',
          property_type: 'string',
          is_required: false,
          default_value: '"Please provide your signature"',
          display_name: 'Required Error Message',
          description: 'Custom error message when field is required but empty',
          input_type: 'text'
        }
      ]
    },
    // Layout Fields
    {
      type: 'heading',
      name: 'Heading',
      description: 'Section titles and dividers',
      icon: 'type',
      category: 'layout',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Section Heading"',
          display_name: 'Heading Text',
          description: 'The text to display as a heading',
          input_type: 'text'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the heading',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        }
      ]
    },
    {
      type: 'text-block',
      name: 'Text Block',
      description: 'Static paragraphs and information',
      icon: 'align-left',
      category: 'layout',
      properties: [
        {
          property_key: 'label',
          property_type: 'string',
          is_required: true,
          default_value: '"Information"',
          display_name: 'Text Content',
          description: 'The text content to display',
          input_type: 'textarea'
        },
        {
          property_key: 'helpText',
          property_type: 'string',
          is_required: false,
          default_value: '""',
          display_name: 'Help Text',
          description: 'Additional help text shown below the field',
          input_type: 'textarea'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        }
      ]
    },
    // Action Fields
    {
      type: 'submit',
      name: 'Submit Button',
      description: 'Form submission button',
      icon: 'send',
      category: 'action',
      properties: [
        {
          property_key: 'buttonText',
          property_type: 'string',
          is_required: true,
          default_value: '"Submit"',
          display_name: 'Button Text',
          description: 'Text displayed on the submit button',
          input_type: 'text'
        },
        {
          property_key: 'buttonIcon',
          property_type: 'string',
          is_required: false,
          default_value: '"send"',
          display_name: 'Button Icon',
          description: 'Icon displayed on the submit button',
          input_type: 'text'
        },
        {
          property_key: 'buttonStyle',
          property_type: 'string',
          is_required: false,
          default_value: '"primary"',
          display_name: 'Button Style',
          description: 'Visual style of the submit button',
          input_type: 'select',
          options: '["primary","secondary","success"]'
        },
        {
          property_key: 'required',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Required Field',
          description: 'Whether this field must be filled out',
          input_type: 'checkbox'
        },
        {
          property_key: 'showLabel',
          property_type: 'boolean',
          is_required: false,
          default_value: 'false',
          display_name: 'Show Label',
          description: 'Whether to display the field label',
          input_type: 'checkbox'
        }
      ]
    }
  ]

  // Create field types and their properties
  for (const fieldTypeData of fieldTypes) {
    const { properties, ...fieldTypeInfo } = fieldTypeData
    
    const fieldType = await prisma.formFieldType.create({
      data: {
        id: generateId(),
        ...fieldTypeInfo
      }
    })

    console.log(`✅ Created field type: ${fieldType.name}`)

    // Create properties for this field type
    for (const propertyData of properties) {
      await prisma.formFieldProperty.create({
        data: {
          id: generateId(),
          ...propertyData,
          field_type_id: fieldType.id
        }
      })
    }

    console.log(`  📝 Added ${properties.length} properties`)
  }

  // Create form themes
  const themes = [
    {
      name: 'default',
      display_name: 'Default',
      description: 'Clean and simple default theme',
      category: 'default',
      config: JSON.stringify({
        primaryColor: '#3b82f6',
        secondaryColor: '#6b7280',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        borderColor: '#d1d5db',
        borderRadius: '0.375rem',
        fontFamily: 'Inter, sans-serif'
      })
    },
    {
      name: 'modern',
      display_name: 'Modern',
      description: 'Contemporary design with rounded corners',
      category: 'modern',
      config: JSON.stringify({
        primaryColor: '#8b5cf6',
        secondaryColor: '#64748b',
        backgroundColor: '#f8fafc',
        textColor: '#0f172a',
        borderColor: '#e2e8f0',
        borderRadius: '0.75rem',
        fontFamily: 'Inter, sans-serif'
      })
    },
    {
      name: 'minimal',
      display_name: 'Minimal',
      description: 'Minimalist design with clean lines',
      category: 'minimal',
      config: JSON.stringify({
        primaryColor: '#000000',
        secondaryColor: '#6b7280',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#000000',
        borderRadius: '0rem',
        fontFamily: 'Helvetica, sans-serif'
      })
    },
    {
      name: 'corporate',
      display_name: 'Corporate',
      description: 'Professional business theme',
      category: 'corporate',
      config: JSON.stringify({
        primaryColor: '#1e40af',
        secondaryColor: '#374151',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        borderColor: '#9ca3af',
        borderRadius: '0.25rem',
        fontFamily: 'Arial, sans-serif'
      })
    }
  ]

  for (const theme of themes) {
    await prisma.formTheme.create({ 
      data: {
        id: generateId(),
        ...theme
      }
    })
    console.log(`🎨 Created theme: ${theme.display_name}`)
  }

  // Create form templates
  const templates = [
    {
      name: 'Contact Form',
      description: 'Basic contact form with name, email, and message',
      category: 'contact',
      tags: JSON.stringify(['contact', 'basic', 'communication']),
      config: JSON.stringify({
        title: 'Contact Us',
        description: 'Get in touch with us',
        fields: [
          { type: 'text', label: 'Full Name', required: true },
          { type: 'email', label: 'Email Address', required: true },
          { type: 'phone', label: 'Phone Number', required: false },
          { type: 'textarea', label: 'Message', required: true }
        ],
        submitButton: { text: 'Send Message', style: 'primary' }
      })
    },
    {
      name: 'Event Registration',
      description: 'Registration form for events and workshops',
      category: 'registration',
      tags: JSON.stringify(['event', 'registration', 'workshop']),
      config: JSON.stringify({
        title: 'Event Registration',
        description: 'Register for our upcoming event',
        fields: [
          { type: 'text', label: 'Full Name', required: true },
          { type: 'email', label: 'Email Address', required: true },
          { type: 'phone', label: 'Phone Number', required: true },
          { type: 'multiple-choice', label: 'Dietary Requirements', options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Other'], required: false },
          { type: 'textarea', label: 'Special Requests', required: false }
        ],
        submitButton: { text: 'Register Now', style: 'success' }
      })
    },
    {
      name: 'Customer Feedback',
      description: 'Collect feedback from customers',
      category: 'feedback',
      tags: JSON.stringify(['feedback', 'survey', 'customer']),
      config: JSON.stringify({
        title: 'Customer Feedback',
        description: 'Help us improve by sharing your feedback',
        fields: [
          { type: 'multiple-choice', label: 'How satisfied are you?', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], required: true },
          { type: 'checkboxes', label: 'What did you like most?', options: ['Product Quality', 'Customer Service', 'Price', 'Delivery Speed', 'Website Experience'], required: false },
          { type: 'textarea', label: 'Additional Comments', required: false },
          { type: 'text', label: 'Your Name (Optional)', required: false },
          { type: 'email', label: 'Email (Optional)', required: false }
        ],
        submitButton: { text: 'Submit Feedback', style: 'primary' }
      })
    }
  ]

  for (const template of templates) {
    await prisma.formTemplate.create({ 
      data: {
        id: generateId(),
        ...template
      }
    })
    console.log(`📋 Created template: ${template.name}`)
  }

  console.log('🎉 Form builder seeding completed!')
}

// Run the seeding function
seedFormBuilder()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export default seedFormBuilder
