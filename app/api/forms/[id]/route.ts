import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/permissions'

// GET /api/forms/[id] - Get a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await prisma.form.findFirst({
      where: { 
        id: params.id,
        user_id: user.id,
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
      }
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
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
      responseCount: form._count.responses,
      shareUrl: form.share_url,
      config,
      fields: transformedFields
    }

    return NextResponse.json({ form: transformedForm })
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/forms/[id] - Update a specific form
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, status, config, fields } = body

    // Check if form exists and belongs to user
    const existingForm = await prisma.form.findFirst({
      where: { 
        id: params.id,
        user_id: user.id,
        deleted_at: null 
      }
    })

    if (!existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Update the form
    const updatedForm = await prisma.form.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(config && { config: JSON.stringify(config) })
      }
    })

    // Update fields if provided
    if (fields && Array.isArray(fields)) {
      // Delete existing fields and translations
      await prisma.formFieldTranslation.deleteMany({
        where: {
          field: {
            form_id: params.id
          }
        }
      })
      
      await prisma.formField.deleteMany({
        where: {
          form_id: params.id
        }
      })

      // Create new fields
      for (const [index, fieldData] of fields.entries()) {
        const { translations, ...fieldConfig } = fieldData
        
        const field = await prisma.formField.create({
          data: {
            form_id: params.id,
            index,
            type: fieldData.type,
            config: JSON.stringify(fieldConfig)
          }
        })

        // Create translations if provided
        if (translations) {
          for (const [languageCode, languageTranslations] of Object.entries(translations)) {
            for (const [propertyKey, translatedValue] of Object.entries(languageTranslations as Record<string, string>)) {
              await prisma.formFieldTranslation.create({
                data: {
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
    }

    return NextResponse.json({ 
      message: 'Form updated successfully',
      formId: updatedForm.id 
    })
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/forms/[id] - Delete a specific form (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if form exists and belongs to user
    const existingForm = await prisma.form.findFirst({
      where: { 
        id: params.id,
        user_id: user.id,
        deleted_at: null 
      }
    })

    if (!existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Soft delete the form and all related data
    await prisma.$transaction(async (tx) => {
      // Soft delete form fields and translations
      await tx.formFieldTranslation.updateMany({
        where: {
          field: {
            form_id: params.id
          }
        },
        data: {
          deleted_at: new Date()
        }
      })

      await tx.formField.updateMany({
        where: {
          form_id: params.id
        },
        data: {
          deleted_at: new Date()
        }
      })

      // Soft delete form responses
      await tx.formResponse.updateMany({
        where: {
          form_id: params.id
        },
        data: {
          deleted_at: new Date()
        }
      })

      // Soft delete the form
      await tx.form.update({
        where: { id: params.id },
        data: {
          deleted_at: new Date()
        }
      })
    })

    return NextResponse.json({ 
      message: 'Form deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
