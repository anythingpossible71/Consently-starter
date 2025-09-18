import { getForm } from "@/app/actions/forms"
import { notFound } from "next/navigation"
import { FormViewer } from "@/components/form-builder/form-viewer"

interface PublicFormPageProps {
  params: {
    id: string
  }
  searchParams: {
    lang?: string
  }
}

export default async function PublicFormPage({ params, searchParams }: PublicFormPageProps) {
  const { id } = await params
  const searchParamsData = await searchParams
  const language = searchParamsData.lang || 'en'
  
  // Get the form data
  const result = await getForm(id)
  
  if (!result.success || !result.form) {
    notFound()
  }
  
  const form = result.form
  
  // Check if the requested language is supported
  const supportedLanguages = form.config.supportedLanguages || ['en']
  if (!supportedLanguages.includes(language)) {
    // Redirect to main language if requested language is not supported
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Language Not Supported</h1>
          <p className="text-gray-600 mb-4">
            The requested language "{language}" is not available for this form.
          </p>
          <a 
            href={`/forms/public/${id}`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            View in Main Language
          </a>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <FormViewer 
        form={form} 
        language={language}
        supportedLanguages={supportedLanguages}
      />
    </div>
  )
}

export async function generateMetadata({ params, searchParams }: PublicFormPageProps) {
  const { id } = await params
  const searchParamsData = await searchParams
  const language = searchParamsData.lang || 'en'
  
  const result = await getForm(id)
  
  if (!result.success || !result.form) {
    return {
      title: 'Form Not Found'
    }
  }
  
  const form = result.form
  
  return {
    title: `${form.title} - Form`,
    description: form.description || `Fill out the ${form.title} form`,
  }
}
