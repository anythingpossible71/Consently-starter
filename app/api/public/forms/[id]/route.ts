import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/forms/[id] - Get a form for public viewing/submission
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('lang') || 'en'

    const form = await prisma.form.findFirst({
      where: { 
        id: params.id,
        status: 'published', // Only serve published forms
        deleted_at: null 
      },
      include: {
        fields: {
          where: { deleted_at: null },
          include: {
            translations: {
              where: { 
                deleted_at: null,
                language_code: language // Only get translations for requested language
              }
            }
          },
          orderBy: { index: 'asc' }
        }
      }
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const config = JSON.parse(form.config)
    
    // Transform fields with translations for the requested language
    const transformedFields = form.fields.map(field => {
      const fieldConfig = JSON.parse(field.config)
      
      // Build translations object for the requested language
      const translations: Record<string, string> = {}
      field.translations.forEach(translation => {
        translations[translation.property_key] = translation.translated_value
      })

      // If no translations found for requested language, try to get English fallback
      if (Object.keys(translations).length === 0 && language !== 'en') {
        // This would require another query to get English translations
        // For now, we'll return empty translations and let the frontend handle fallback
      }

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
      config,
      fields: transformedFields,
      language
    }

    return NextResponse.json({ form: transformedForm })
  } catch (error) {
    console.error('Error fetching public form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/public/forms/[id] - Submit a form response
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { data } = body

    // Check if form exists and is published
    const form = await prisma.form.findFirst({
      where: { 
        id: params.id,
        status: 'published',
        deleted_at: null 
      }
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create the form response
    const response = await prisma.formResponse.create({
      data: {
        form_id: params.id,
        data: JSON.stringify(data),
        ip_address: ip,
        user_agent: userAgent
      }
    })

    // Update form response count
    await prisma.form.update({
      where: { id: params.id },
      data: {
        response_count: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ 
      message: 'Form submitted successfully',
      responseId: response.id 
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
