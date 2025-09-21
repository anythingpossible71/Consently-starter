import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/permissions"
import { prisma } from "@/lib/prisma"
import { FormResponseViewer } from "@/components/form-builder/form-response-viewer"

interface FormResponsePageProps {
  params: Promise<{ id: string; responseId: string }>
}

export default async function FormResponsePage({ params }: FormResponsePageProps) {
  const { id, responseId } = await params
  
  // Check authentication
  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  try {
    // Get the form with fields
    const form = await prisma.form.findFirst({
      where: { 
        id,
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
        }
      }
    })

    if (!form) {
      notFound()
    }

    // Get the specific response
    const response = await prisma.formResponse.findFirst({
      where: {
        id: responseId,
        form_id: id,
        deleted_at: null
      }
    })

    if (!response) {
      notFound()
    }

    // Transform form data
    const transformedForm = {
      id: form.id,
      title: form.title,
      description: form.description,
      status: form.status,
      createdAt: new Date(form.created_at),
      updatedAt: new Date(form.updated_at),
      responseCount: 0, // Not needed for this view
      shareUrl: form.share_url,
      config: JSON.parse(form.config),
      fields: form.fields.map(field => {
        const config = JSON.parse(field.config)
        return {
          id: field.id,
          type: field.type,
          index: field.index,
          ...config
        }
      })
    }

    // Transform response data
    const responseData = JSON.parse(response.data)
    const transformedResponse = {
      id: response.id,
      createdAt: new Date(response.created_at),
      data: responseData
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {form.title}
              </h1>
              <p className="text-sm text-gray-600">
                Response submitted on {new Date(response.created_at).toLocaleString()}
              </p>
            </div>
            
            <FormResponseViewer 
              form={transformedForm}
              response={transformedResponse}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading form response:', error)
    notFound()
  }
}
