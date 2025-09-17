import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/permissions'

// GET /api/forms - Get all forms for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const forms = await prisma.form.findMany({
      where: { 
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
      },
      orderBy: { created_at: 'desc' }
    })

    // Transform the data to match our frontend expectations
    const transformedForms = forms.map(form => {
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
        fields: transformedFields
      }
    })

    return NextResponse.json({ forms: transformedForms })
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/forms - Create a new form
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, config, fields } = body

    if (!title || !config) {
      return NextResponse.json(
        { error: 'Title and config are required' },
        { status: 400 }
      )
    }

    // Create the form
    const form = await prisma.form.create({
      data: {
        user_id: user.id,
        title,
        description: description || null,
        status: 'draft',
        config: JSON.stringify(config),
        share_url: null,
        response_count: 0
      }
    })

    // Create fields if provided
    if (fields && Array.isArray(fields)) {
      for (const [index, fieldData] of fields.entries()) {
        const { translations, ...fieldConfig } = fieldData
        
        const field = await prisma.formField.create({
          data: {
            form_id: form.id,
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
      message: 'Form created successfully',
      formId: form.id 
    })
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
