import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/permissions'
import { AppContainer } from "@/components/form-builder/app-container"
import { prisma } from "@/lib/prisma"

export default async function FormsPage() {
  // Check authentication
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin?callbackUrl=/forms')
  }

  // Fetch forms on the server side for the authenticated user
  try {
    const forms = await prisma.form.findMany({
      where: { 
        user_id: user.id,
        deleted_at: null 
      },
      include: {
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
    
    // Transform the data
    const transformedForms = forms.map(form => {
      const config = JSON.parse(form.config)
      
      return {
        id: form.id,
        title: form.title,
        description: form.description,
        status: form.status,
        createdAt: new Date(form.created_at),
        updatedAt: new Date(form.updated_at),
        responseCount: form._count.responses,
        shareUrl: form.share_url,
        config,
        fields: [] // For now, skip the fields
      }
    })
    
    return <AppContainer initialForms={transformedForms} user={user} />
  } catch (error) {
    console.error('Error fetching forms on server:', error)
    return <AppContainer initialForms={[]} user={user} />
  }
}
