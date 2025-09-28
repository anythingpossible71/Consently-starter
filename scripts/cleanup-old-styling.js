#!/usr/bin/env node

/**
 * Cleanup Old Styling System Script
 * 
 * This script identifies and updates forms that have old styling system values
 * in their config and updates them to use the new default values.
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// New default values for the styling system
const NEW_DEFAULTS = {
  backgroundColor: '#ffffff',
  formFontFamily: 'Inter, system-ui, sans-serif',
  submitButtonColor: '#2563eb',
  selectedTheme: 'default',
  customTheme: null,
  customCSS: '',
  applyCustomCSS: false
};

async function cleanupOldStyling() {
  console.log('🔍 Scanning for forms with old styling values...');
  
  try {
    // Get all forms
    const forms = await prisma.form.findMany({
      where: { deleted_at: null },
      select: { id: true, title: true, config: true }
    });

    console.log(`📊 Found ${forms.length} forms to check`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const form of forms) {
      const config = JSON.parse(form.config);
      let needsUpdate = false;
      const updates = {};

      // Check for old styling values
      if (config.backgroundColor && config.backgroundColor !== NEW_DEFAULTS.backgroundColor) {
        console.log(`  📝 Form "${form.title}" (${form.id}): backgroundColor ${config.backgroundColor} → ${NEW_DEFAULTS.backgroundColor}`);
        updates.backgroundColor = NEW_DEFAULTS.backgroundColor;
        needsUpdate = true;
      }

      if (config.formFontFamily && config.formFontFamily !== NEW_DEFAULTS.formFontFamily) {
        console.log(`  📝 Form "${form.title}" (${form.id}): formFontFamily ${config.formFontFamily} → ${NEW_DEFAULTS.formFontFamily}`);
        updates.formFontFamily = NEW_DEFAULTS.formFontFamily;
        needsUpdate = true;
      }

      if (config.submitButtonColor && config.submitButtonColor !== NEW_DEFAULTS.submitButtonColor) {
        console.log(`  📝 Form "${form.title}" (${form.id}): submitButtonColor ${config.submitButtonColor} → ${NEW_DEFAULTS.submitButtonColor}`);
        updates.submitButtonColor = NEW_DEFAULTS.submitButtonColor;
        needsUpdate = true;
      }

      if (config.selectedTheme && config.selectedTheme !== NEW_DEFAULTS.selectedTheme) {
        console.log(`  📝 Form "${form.title}" (${form.id}): selectedTheme ${config.selectedTheme} → ${NEW_DEFAULTS.selectedTheme}`);
        updates.selectedTheme = NEW_DEFAULTS.selectedTheme;
        needsUpdate = true;
      }

      if (config.customTheme !== NEW_DEFAULTS.customTheme) {
        console.log(`  📝 Form "${form.title}" (${form.id}): customTheme ${config.customTheme} → ${NEW_DEFAULTS.customTheme}`);
        updates.customTheme = NEW_DEFAULTS.customTheme;
        needsUpdate = true;
      }

      if (config.customCSS !== NEW_DEFAULTS.customCSS) {
        console.log(`  📝 Form "${form.title}" (${form.id}): customCSS ${config.customCSS} → ${NEW_DEFAULTS.customCSS}`);
        updates.customCSS = NEW_DEFAULTS.customCSS;
        needsUpdate = true;
      }

      if (config.applyCustomCSS !== NEW_DEFAULTS.applyCustomCSS) {
        console.log(`  📝 Form "${form.title}" (${form.id}): applyCustomCSS ${config.applyCustomCSS} → ${NEW_DEFAULTS.applyCustomCSS}`);
        updates.applyCustomCSS = NEW_DEFAULTS.applyCustomCSS;
        needsUpdate = true;
      }

      if (needsUpdate) {
        // Merge updates with existing config
        const updatedConfig = { ...config, ...updates };
        
        await prisma.form.update({
          where: { id: form.id },
          data: { 
            config: JSON.stringify(updatedConfig),
            updated_at: new Date()
          }
        });

        updatedCount++;
        console.log(`  ✅ Updated form "${form.title}" (${form.id})`);
      } else {
        skippedCount++;
        console.log(`  ⏭️  Form "${form.title}" (${form.id}) - no updates needed`);
      }
    }

    console.log('\n📈 Cleanup Summary:');
    console.log(`  ✅ Updated: ${updatedCount} forms`);
    console.log(`  ⏭️  Skipped: ${skippedCount} forms`);
    console.log(`  📊 Total: ${forms.length} forms`);

    if (updatedCount > 0) {
      console.log('\n🎉 Old styling values have been cleaned up!');
      console.log('💡 Forms will now show the correct default values in the style panel.');
    } else {
      console.log('\n✨ No forms needed updates - all forms are already using the new styling system!');
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupOldStyling();
