import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateFormLanguages() {
  console.log('🌍 Updating forms with 3 supported languages each...')
  
  try {
    // Get all existing forms
    const forms = await prisma.form.findMany({
      where: { deleted_at: null }
    })
    
    console.log(`Found ${forms.length} forms to update`)
    
    for (const form of forms) {
      const config = JSON.parse(form.config)
      
      // Define 3 languages for each form based on the form type
      let supportedLanguages = []
      if (form.title.includes('Contact')) {
        supportedLanguages = ['en', 'es', 'fr'] // English, Spanish, French
      } else if (form.title.includes('Event')) {
        supportedLanguages = ['en', 'de', 'it'] // English, German, Italian
      } else {
        supportedLanguages = ['en', 'pt', 'ru'] // English, Portuguese, Russian
      }
      
      // Update the config with supported languages
      const updatedConfig = {
        ...config,
        supportedLanguages,
        mainLanguage: 'en' // Set English as main language
      }
      
      // Update the form
      await prisma.form.update({
        where: { id: form.id },
        data: {
          config: JSON.stringify(updatedConfig)
        }
      })
      
      console.log(`✅ Updated form "${form.title}" with languages: ${supportedLanguages.join(', ')}`)
    }
    
    console.log('🎉 All forms updated successfully!')
    
  } catch (error) {
    console.error('❌ Error updating forms:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateFormLanguages()
