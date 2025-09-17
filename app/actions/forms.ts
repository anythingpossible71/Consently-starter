'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/permissions'
import { generateId } from '@/lib/utils/ulid'
import { revalidatePath } from 'next/cache'

export async function getForms() {
  try {
    console.log('getForms called')
    // For now, get the first user (admin) to test - bypass authentication
    const adminUser = await prisma.user.findFirst({
      where: { deleted_at: null }
    })
    if (!adminUser) {
      throw new Error('No users found')
    }
    console.log('Using admin user:', adminUser.email)
      
      const forms = await prisma.form.findMany({
        where: { 
          user_id: adminUser.id,
          deleted_at: null 
        },
        include: {
          fields: {
            where: { deleted_at: null },
            include: {
              translations: {
                where: { deleted_at: null }
              }
            },
            orderBy: { index: 'asc' }
          },
          _count: {
            select: {
              responses: {
                where: { deleted_at: null }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' }
      })

      // Transform the data to match our frontend expectations
      const transformedForms = forms.map(form => {
        const config = JSON.parse(form.config)
        
        return {
          id: form.id,
          title: form.title,
          description: form.description,
          status: form.status,
          createdAt: form.created_at,
          updatedAt: form.updated_at,
          responseCount: form._count.responses,
          shareUrl: form.share_url,
          config,
          fields: form.fields.map(field => ({
            id: field.id,
            type: field.type,
            index: field.index,
            ...JSON.parse(field.config)
          }))
        }
      })

    return { success: true, forms: transformedForms }
  } catch (error) {
    console.error('Error fetching forms:', error)
    return { success: false, forms: [], error: 'Failed to fetch forms' }
  }
}

export async function getForm(formId: string) {
  try {
    console.log('getForm called for ID:', formId)
    // For now, get the first user (admin) to test - bypass authentication
    const adminUser = await prisma.user.findFirst({
      where: { deleted_at: null }
    })
    if (!adminUser) {
      throw new Error('No users found')
    }
    
    const form = await prisma.form.findFirst({
      where: { 
        id: formId,
        user_id: adminUser.id,
        deleted_at: null 
      },
      include: {
        fields: {
          where: { deleted_at: null },
          include: {
            translations: {
              where: { deleted_at: null }
            }
          },
          orderBy: { index: 'asc' }
        }
      }
    })

    if (!form) {
      return { success: false, error: 'Form not found' }
    }

    const config = JSON.parse(form.config)
    
    // Transform fields with translations
    const transformedFields = form.fields.map(field => {
      const fieldConfig = JSON.parse(field.config)
      
      // Build translations object
      const translations: Record<string, Record<string, string>> = {}
      field.translations.forEach(translation => {
        if (!translations[translation.language_code]) {
          translations[translation.language_code] = {}
        }
        translations[translation.language_code][translation.property_key] = translation.translated_value
      })

      return {
        id: field.id,
        type: field.type,
        index: field.index,
        ...fieldConfig,
        translations
      }
    })

    const transformedForm = {
      id: form.id,
      title: form.title,
      description: form.description,
      status: form.status,
      createdAt: form.created_at,
      updatedAt: form.updated_at,
      shareUrl: form.share_url,
      config,
      fields: transformedFields
    }

    return { success: true, form: transformedForm }
  } catch (error) {
    console.error('Error fetching form:', error)
    return { success: false, error: 'Failed to fetch form' }
  }
}

export async function saveForm(formData: {
  id?: string
  title: string
  description?: string
  config: any
  fields: any[]
}) {
  try {
    // For now, get the first user (admin) to test - bypass authentication
    const adminUser = await prisma.user.findFirst({
      where: { deleted_at: null }
    })
    if (!adminUser) {
      throw new Error('No users found')
    }

    const { id, title, description, config, fields } = formData

    if (id) {
      // Update existing form
      await prisma.$transaction(async (tx) => {
        // Update the form
        await tx.form.update({
          where: { id },
          data: {
            title,
            description: description || null,
            status: 'published', // Always publish when saving
            config: JSON.stringify(config),
            updated_at: new Date()
          }
        })

        // Delete existing fields and translations
        await tx.formFieldTranslation.deleteMany({
          where: {
            field: {
              form_id: id
            }
          }
        })
        
        await tx.formField.deleteMany({
          where: {
            form_id: id
          }
        })

        // Create new fields
        for (const [index, fieldData] of fields.entries()) {
          const { translations, ...fieldConfig } = fieldData
          
          const field = await tx.formField.create({
            data: {
              id: generateId(),
              form_id: id,
              index,
              type: fieldData.type,
              config: JSON.stringify(fieldConfig)
            }
          })

          // Create translations if provided
          if (translations) {
            for (const [languageCode, languageTranslations] of Object.entries(translations)) {
              for (const [propertyKey, translatedValue] of Object.entries(languageTranslations as Record<string, string>)) {
                await tx.formFieldTranslation.create({
                  data: {
                    id: generateId(),
                    field_id: field.id,
                    language_code: languageCode,
                    property_key: propertyKey,
                    translated_value: translatedValue
                  }
                })
              }
            }
          }
        }
      })

      revalidatePath('/forms')
      return { success: true, message: 'Form published successfully', formId: id }
    } else {
      // Create new form
      const form = await prisma.$transaction(async (tx) => {
        // Create the form
        const newForm = await tx.form.create({
          data: {
            id: generateId(),
            user_id: adminUser.id,
            title,
            description: description || null,
            status: 'published', // Always publish when saving
            config: JSON.stringify(config),
            share_url: null,
            response_count: 0
          }
        })

        // Create fields
        for (const [index, fieldData] of fields.entries()) {
          const { translations, ...fieldConfig } = fieldData
          
          const field = await tx.formField.create({
            data: {
              id: generateId(),
              form_id: newForm.id,
              index,
              type: fieldData.type,
              config: JSON.stringify(fieldConfig)
            }
          })

          // Create translations if provided
          if (translations) {
            for (const [languageCode, languageTranslations] of Object.entries(translations)) {
              for (const [propertyKey, translatedValue] of Object.entries(languageTranslations as Record<string, string>)) {
                await tx.formFieldTranslation.create({
                  data: {
                    id: generateId(),
                    field_id: field.id,
                    language_code: languageCode,
                    property_key: propertyKey,
                    translated_value: translatedValue
                  }
                })
              }
            }
          }
        }

        return newForm
      })

      revalidatePath('/forms')
      return { success: true, message: 'Form published successfully', formId: form.id }
    }
  } catch (error) {
    console.error('Error saving form:', error)
    return { success: false, message: 'Failed to save form' }
  }
}

export async function deleteForm(formId: string) {
  try {
    // For now, get the first user (admin) to test - bypass authentication
    const adminUser = await prisma.user.findFirst({
      where: { deleted_at: null }
    })
    if (!adminUser) {
      throw new Error('No users found')
    }

    // Check if form exists and belongs to user
    const existingForm = await prisma.form.findFirst({
      where: { 
        id: formId,
        user_id: adminUser.id,
        deleted_at: null 
      }
    })

    if (!existingForm) {
      throw new Error('Form not found')
    }

    // Soft delete the form and all related data
    await prisma.$transaction(async (tx) => {
      // Soft delete form fields and translations
      await tx.formFieldTranslation.updateMany({
        where: {
          field: {
            form_id: formId
          }
        },
        data: {
          deleted_at: new Date()
        }
      })

      await tx.formField.updateMany({
        where: {
          form_id: formId
        },
        data: {
          deleted_at: new Date()
        }
      })

      // Soft delete form responses
      await tx.formResponse.updateMany({
        where: {
          form_id: formId
        },
        data: {
          deleted_at: new Date()
        }
      })

      // Soft delete the form
      await tx.form.update({
        where: { id: formId },
        data: {
          deleted_at: new Date()
        }
      })
    })

    revalidatePath('/forms')
    return { success: true, message: 'Form deleted successfully' }
  } catch (error) {
    console.error('Error deleting form:', error)
    return { success: false, message: 'Failed to delete form' }
  }
}
