import { AppContainer } from "@/components/form-builder/app-container"
import { prisma } from "@/lib/prisma"

export default async function FormsPage() {
  // Fetch forms on the server side
  try {
    const adminUser = await prisma.user.findFirst({
      where: { deleted_at: null }
    })
    
    if (!adminUser) {
      console.log('No users found')
      return <AppContainer initialForms={[]} />
    }
    
    const forms = await prisma.form.findMany({
      where: { 
        user_id: adminUser.id,
        deleted_at: null 
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
        responseCount: 0, // For now, skip the count
        shareUrl: form.share_url,
        config,
        fields: [] // For now, skip the fields
      }
    })
    
    return <AppContainer initialForms={transformedForms} />
  } catch (error) {
    console.error('Error fetching forms on server:', error)
    return <AppContainer initialForms={[]} />
  }
}
