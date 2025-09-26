import { prisma } from '../lib/prisma'

// Default form styling variables based on current implementation
const DEFAULT_STYLING_VARIABLES = [
  // Typography Variables (10)
  { variable_name: '--form-font-family', default_value: '"Inter, system-ui, sans-serif"', description: 'Main font family for forms', category: 'typography', data_type: 'font', display_name: 'Font Family' },
  { variable_name: '--form-font-size-base', default_value: '"1rem"', description: 'Base font size', category: 'typography', data_type: 'size', display_name: 'Base Font Size' },
  { variable_name: '--form-font-size-small', default_value: '"0.875rem"', description: 'Small font size', category: 'typography', data_type: 'size', display_name: 'Small Font Size' },
  { variable_name: '--form-font-size-large', default_value: '"1.125rem"', description: 'Large font size', category: 'typography', data_type: 'size', display_name: 'Large Font Size' },
  { variable_name: '--form-font-size-heading', default_value: '"1.25rem"', description: 'Heading font size', category: 'typography', data_type: 'size', display_name: 'Heading Font Size' },
  { variable_name: '--form-font-weight-normal', default_value: '"400"', description: 'Normal font weight', category: 'typography', data_type: 'font', display_name: 'Normal Font Weight' },
  { variable_name: '--form-font-weight-medium', default_value: '"500"', description: 'Medium font weight', category: 'typography', data_type: 'font', display_name: 'Medium Font Weight' },
  { variable_name: '--form-font-weight-semibold', default_value: '"600"', description: 'Semibold font weight', category: 'typography', data_type: 'font', display_name: 'Semibold Font Weight' },
  { variable_name: '--form-font-weight-bold', default_value: '"700"', description: 'Bold font weight', category: 'typography', data_type: 'font', display_name: 'Bold Font Weight' },
  { variable_name: '--form-line-height', default_value: '"1.5"', description: 'Line height', category: 'typography', data_type: 'size', display_name: 'Line Height' },

  // Color Variables (27)
  { variable_name: '--form-primary-color', default_value: '"#2563eb"', description: 'Primary color for buttons and focus states', category: 'colors', data_type: 'color', display_name: 'Primary Color' },
  { variable_name: '--form-secondary-color', default_value: '"#64748b"', description: 'Secondary color for text and borders', category: 'colors', data_type: 'color', display_name: 'Secondary Color' },
  { variable_name: '--form-success-color', default_value: '"#10b981"', description: 'Success color for success states', category: 'colors', data_type: 'color', display_name: 'Success Color' },
  { variable_name: '--form-error-color', default_value: '"#ef4444"', description: 'Error color for error states', category: 'colors', data_type: 'color', display_name: 'Error Color' },
  { variable_name: '--form-warning-color', default_value: '"#f59e0b"', description: 'Warning color for warning states', category: 'colors', data_type: 'color', display_name: 'Warning Color' },
  { variable_name: '--form-background-color', default_value: '"#ffffff"', description: 'Main background color', category: 'colors', data_type: 'color', display_name: 'Background Color' },
  { variable_name: '--form-surface-color', default_value: '"#f8fafc"', description: 'Surface color for cards and containers', category: 'colors', data_type: 'color', display_name: 'Surface Color' },
  { variable_name: '--form-text-color', default_value: '"#1f2937"', description: 'Main text color', category: 'colors', data_type: 'color', display_name: 'Text Color' },
  { variable_name: '--form-text-secondary-color', default_value: '"#6b7280"', description: 'Secondary text color', category: 'colors', data_type: 'color', display_name: 'Secondary Text Color' },
  { variable_name: '--form-border-color', default_value: '"#e5e7eb"', description: 'Main border color', category: 'colors', data_type: 'color', display_name: 'Border Color' },
  { variable_name: '--form-border-light-color', default_value: '"#f3f4f6"', description: 'Light border color', category: 'colors', data_type: 'color', display_name: 'Light Border Color' },
  
  // Extended Color Palette
  { variable_name: '--form-blue-50', default_value: '"#eff6ff"', description: 'Blue 50 shade', category: 'colors', data_type: 'color', display_name: 'Blue 50', is_user_editable: false },
  { variable_name: '--form-blue-100', default_value: '"#dbeafe"', description: 'Blue 100 shade', category: 'colors', data_type: 'color', display_name: 'Blue 100', is_user_editable: false },
  { variable_name: '--form-blue-300', default_value: '"#93c5fd"', description: 'Blue 300 shade', category: 'colors', data_type: 'color', display_name: 'Blue 300', is_user_editable: false },
  { variable_name: '--form-blue-600', default_value: '"#2563eb"', description: 'Blue 600 shade', category: 'colors', data_type: 'color', display_name: 'Blue 600', is_user_editable: false },
  { variable_name: '--form-blue-700', default_value: '"#1d4ed8"', description: 'Blue 700 shade', category: 'colors', data_type: 'color', display_name: 'Blue 700', is_user_editable: false },
  { variable_name: '--form-blue-900', default_value: '"#1e3a8a"', description: 'Blue 900 shade', category: 'colors', data_type: 'color', display_name: 'Blue 900', is_user_editable: false },
  { variable_name: '--form-gray-50', default_value: '"#f9fafb"', description: 'Gray 50 shade', category: 'colors', data_type: 'color', display_name: 'Gray 50', is_user_editable: false },
  { variable_name: '--form-gray-100', default_value: '"#f3f4f6"', description: 'Gray 100 shade', category: 'colors', data_type: 'color', display_name: 'Gray 100', is_user_editable: false },
  { variable_name: '--form-gray-200', default_value: '"#e5e7eb"', description: 'Gray 200 shade', category: 'colors', data_type: 'color', display_name: 'Gray 200', is_user_editable: false },
  { variable_name: '--form-gray-300', default_value: '"#d1d5db"', description: 'Gray 300 shade', category: 'colors', data_type: 'color', display_name: 'Gray 300', is_user_editable: false },
  { variable_name: '--form-gray-400', default_value: '"#9ca3af"', description: 'Gray 400 shade', category: 'colors', data_type: 'color', display_name: 'Gray 400', is_user_editable: false },
  { variable_name: '--form-gray-500', default_value: '"#6b7280"', description: 'Gray 500 shade', category: 'colors', data_type: 'color', display_name: 'Gray 500', is_user_editable: false },
  { variable_name: '--form-gray-600', default_value: '"#4b5563"', description: 'Gray 600 shade', category: 'colors', data_type: 'color', display_name: 'Gray 600', is_user_editable: false },
  { variable_name: '--form-gray-700', default_value: '"#374151"', description: 'Gray 700 shade', category: 'colors', data_type: 'color', display_name: 'Gray 700', is_user_editable: false },
  { variable_name: '--form-gray-900', default_value: '"#111827"', description: 'Gray 900 shade', category: 'colors', data_type: 'color', display_name: 'Gray 900', is_user_editable: false },
  { variable_name: '--form-red-300', default_value: '"#fca5a5"', description: 'Red 300 shade', category: 'colors', data_type: 'color', display_name: 'Red 300', is_user_editable: false },
  { variable_name: '--form-red-500', default_value: '"#ef4444"', description: 'Red 500 shade', category: 'colors', data_type: 'color', display_name: 'Red 500', is_user_editable: false },
  { variable_name: '--form-green-500', default_value: '"#10b981"', description: 'Green 500 shade', category: 'colors', data_type: 'color', display_name: 'Green 500', is_user_editable: false },

  // Spacing Variables (7)
  { variable_name: '--form-spacing-1', default_value: '"0.25rem"', description: 'Extra small spacing', category: 'spacing', data_type: 'spacing', display_name: 'Spacing 1' },
  { variable_name: '--form-spacing-2', default_value: '"0.5rem"', description: 'Small spacing', category: 'spacing', data_type: 'spacing', display_name: 'Spacing 2' },
  { variable_name: '--form-spacing-3', default_value: '"0.75rem"', description: 'Medium-small spacing', category: 'spacing', data_type: 'spacing', display_name: 'Spacing 3' },
  { variable_name: '--form-spacing-4', default_value: '"1rem"', description: 'Medium spacing', category: 'spacing', data_type: 'spacing', display_name: 'Spacing 4' },
  { variable_name: '--form-spacing-6', default_value: '"1.5rem"', description: 'Large spacing', category: 'spacing', data_type: 'spacing', display_name: 'Spacing 6' },
  { variable_name: '--form-spacing-8', default_value: '"2rem"', description: 'Extra large spacing', category: 'spacing', data_type: 'spacing', display_name: 'Spacing 8' },
  { variable_name: '--form-spacing-12', default_value: '"3rem"', description: 'Huge spacing', category: 'spacing', data_type: 'spacing', display_name: 'Spacing 12' },

  // Border & Radius Variables (7)
  { variable_name: '--form-border-width', default_value: '"1px"', description: 'Standard border width', category: 'borders', data_type: 'border', display_name: 'Border Width' },
  { variable_name: '--form-border-width-2', default_value: '"2px"', description: 'Thick border width', category: 'borders', data_type: 'border', display_name: 'Border Width 2' },
  { variable_name: '--form-border-radius-sm', default_value: '"0.125rem"', description: 'Small border radius', category: 'borders', data_type: 'border', display_name: 'Border Radius Small' },
  { variable_name: '--form-border-radius', default_value: '"0.25rem"', description: 'Standard border radius', category: 'borders', data_type: 'border', display_name: 'Border Radius' },
  { variable_name: '--form-border-radius-md', default_value: '"0.375rem"', description: 'Medium border radius', category: 'borders', data_type: 'border', display_name: 'Border Radius Medium' },
  { variable_name: '--form-border-radius-lg', default_value: '"0.5rem"', description: 'Large border radius', category: 'borders', data_type: 'border', display_name: 'Border Radius Large' },
  { variable_name: '--form-border-radius-xl', default_value: '"0.75rem"', description: 'Extra large border radius', category: 'borders', data_type: 'border', display_name: 'Border Radius XL' },

  // Shadow Variables (4)
  { variable_name: '--form-shadow-sm', default_value: '"0 1px 2px 0 rgb(0 0 0 / 0.05)"', description: 'Small shadow', category: 'shadows', data_type: 'shadow', display_name: 'Small Shadow' },
  { variable_name: '--form-shadow', default_value: '"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"', description: 'Standard shadow', category: 'shadows', data_type: 'shadow', display_name: 'Shadow' },
  { variable_name: '--form-shadow-md', default_value: '"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"', description: 'Medium shadow', category: 'shadows', data_type: 'shadow', display_name: 'Medium Shadow' },
  { variable_name: '--form-shadow-lg', default_value: '"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"', description: 'Large shadow', category: 'shadows', data_type: 'shadow', display_name: 'Large Shadow' },

  // Form Container Variables (6)
  { variable_name: '--form-container-max-width', default_value: '"640px"', description: 'Maximum width of form container', category: 'container', data_type: 'size', display_name: 'Container Max Width' },
  { variable_name: '--form-container-padding', default_value: '"2rem"', description: 'Padding inside form container', category: 'container', data_type: 'spacing', display_name: 'Container Padding' },
  { variable_name: '--form-container-margin', default_value: '"20px auto"', description: 'Margin around form container', category: 'container', data_type: 'spacing', display_name: 'Container Margin' },
  { variable_name: '--form-container-background', default_value: '"#ffffff"', description: 'Background color of form container', category: 'container', data_type: 'color', display_name: 'Container Background' },
  { variable_name: '--form-show-frame', default_value: '"true"', description: 'Whether to show form frame', category: 'container', data_type: 'boolean', display_name: 'Show Frame' },
  { variable_name: '--form-show-background', default_value: '"true"', description: 'Whether to show form background', category: 'container', data_type: 'boolean', display_name: 'Show Background' },

  // Input Field Variables (11)
  { variable_name: '--form-input-padding', default_value: '"0.5rem 0.75rem"', description: 'Padding inside input fields', category: 'inputs', data_type: 'spacing', display_name: 'Input Padding' },
  { variable_name: '--form-input-border-width', default_value: '"1px"', description: 'Border width of input fields', category: 'inputs', data_type: 'border', display_name: 'Input Border Width' },
  { variable_name: '--form-input-border-color', default_value: '"#e5e7eb"', description: 'Border color of input fields', category: 'inputs', data_type: 'color', display_name: 'Input Border Color' },
  { variable_name: '--form-input-border-radius', default_value: '"0.375rem"', description: 'Border radius of input fields', category: 'inputs', data_type: 'border', display_name: 'Input Border Radius' },
  { variable_name: '--form-input-background', default_value: '"#ffffff"', description: 'Background color of input fields', category: 'inputs', data_type: 'color', display_name: 'Input Background' },
  { variable_name: '--form-input-font-size', default_value: '"1rem"', description: 'Font size of input fields', category: 'inputs', data_type: 'size', display_name: 'Input Font Size' },
  { variable_name: '--form-input-focus-border-color', default_value: '"#2563eb"', description: 'Border color when input is focused', category: 'inputs', data_type: 'color', display_name: 'Input Focus Border Color' },
  { variable_name: '--form-input-focus-box-shadow', default_value: '"0 0 0 3px rgba(37, 99, 235, 0.1)"', description: 'Box shadow when input is focused', category: 'inputs', data_type: 'shadow', display_name: 'Input Focus Shadow' },
  { variable_name: '--form-input-error-border-color', default_value: '"#ef4444"', description: 'Border color when input has error', category: 'inputs', data_type: 'color', display_name: 'Input Error Border Color' },
  { variable_name: '--form-input-error-box-shadow', default_value: '"0 0 0 3px rgba(239, 68, 68, 0.1)"', description: 'Box shadow when input has error', category: 'inputs', data_type: 'shadow', display_name: 'Input Error Shadow' },

  // Label Variables (5)
  { variable_name: '--form-label-font-size', default_value: '"1.125rem"', description: 'Font size of form labels', category: 'labels', data_type: 'size', display_name: 'Label Font Size' },
  { variable_name: '--form-label-font-weight', default_value: '"600"', description: 'Font weight of form labels', category: 'labels', data_type: 'font', display_name: 'Label Font Weight' },
  { variable_name: '--form-label-color', default_value: '"#111827"', description: 'Color of form labels', category: 'labels', data_type: 'color', display_name: 'Label Color' },
  { variable_name: '--form-label-margin-bottom', default_value: '"0.5rem"', description: 'Bottom margin of form labels', category: 'labels', data_type: 'spacing', display_name: 'Label Margin Bottom' },
  { variable_name: '--form-label-line-height', default_value: '"1.5"', description: 'Line height of form labels', category: 'labels', data_type: 'size', display_name: 'Label Line Height' },

  // Button Variables (14)
  { variable_name: '--form-button-padding', default_value: '"0.5rem 2rem"', description: 'Padding inside buttons', category: 'buttons', data_type: 'spacing', display_name: 'Button Padding' },
  { variable_name: '--form-button-border-radius', default_value: '"0.375rem"', description: 'Border radius of buttons', category: 'buttons', data_type: 'border', display_name: 'Button Border Radius' },
  { variable_name: '--form-button-font-size', default_value: '"1rem"', description: 'Font size of buttons', category: 'buttons', data_type: 'size', display_name: 'Button Font Size' },
  { variable_name: '--form-button-font-weight', default_value: '"500"', description: 'Font weight of buttons', category: 'buttons', data_type: 'font', display_name: 'Button Font Weight' },
  { variable_name: '--form-button-line-height', default_value: '"1.5"', description: 'Line height of buttons', category: 'buttons', data_type: 'size', display_name: 'Button Line Height' },
  { variable_name: '--form-button-transition', default_value: '"all 0.15s ease-in-out"', description: 'Transition for button hover effects', category: 'buttons', data_type: 'animation', display_name: 'Button Transition' },
  { variable_name: '--form-button-primary-background', default_value: '"#2563eb"', description: 'Background color of primary buttons', category: 'buttons', data_type: 'color', display_name: 'Primary Button Background' },
  { variable_name: '--form-button-primary-color', default_value: '"#ffffff"', description: 'Text color of primary buttons', category: 'buttons', data_type: 'color', display_name: 'Primary Button Color' },
  { variable_name: '--form-button-primary-hover-background', default_value: '"#1d4ed8"', description: 'Background color when primary button is hovered', category: 'buttons', data_type: 'color', display_name: 'Primary Button Hover Background' },
  { variable_name: '--form-button-primary-hover-color', default_value: '"#ffffff"', description: 'Text color when primary button is hovered', category: 'buttons', data_type: 'color', display_name: 'Primary Button Hover Color' },
  { variable_name: '--form-button-secondary-background', default_value: '"transparent"', description: 'Background color of secondary buttons', category: 'buttons', data_type: 'color', display_name: 'Secondary Button Background' },
  { variable_name: '--form-button-secondary-color', default_value: '"#374151"', description: 'Text color of secondary buttons', category: 'buttons', data_type: 'color', display_name: 'Secondary Button Color' },
  { variable_name: '--form-button-secondary-border', default_value: '"1px solid #e5e7eb"', description: 'Border of secondary buttons', category: 'buttons', data_type: 'border', display_name: 'Secondary Button Border' },
  { variable_name: '--form-button-secondary-hover-background', default_value: '"#f9fafb"', description: 'Background color when secondary button is hovered', category: 'buttons', data_type: 'color', display_name: 'Secondary Button Hover Background' },

  // Checkbox/Radio Variables (10)
  { variable_name: '--form-checkbox-size', default_value: '"1rem"', description: 'Size of checkboxes and radio buttons', category: 'controls', data_type: 'size', display_name: 'Checkbox Size' },
  { variable_name: '--form-checkbox-border-radius', default_value: '"0.25rem"', description: 'Border radius of checkboxes', category: 'controls', data_type: 'border', display_name: 'Checkbox Border Radius' },
  { variable_name: '--form-checkbox-border-width', default_value: '"1px"', description: 'Border width of checkboxes and radio buttons', category: 'controls', data_type: 'border', display_name: 'Checkbox Border Width' },
  { variable_name: '--form-checkbox-border-color', default_value: '"#e5e7eb"', description: 'Border color of checkboxes and radio buttons', category: 'controls', data_type: 'color', display_name: 'Checkbox Border Color' },
  { variable_name: '--form-checkbox-background', default_value: '"#ffffff"', description: 'Background color of checkboxes and radio buttons', category: 'controls', data_type: 'color', display_name: 'Checkbox Background' },
  { variable_name: '--form-checkbox-checked-background', default_value: '"#2563eb"', description: 'Background color when checkbox/radio is checked', category: 'controls', data_type: 'color', display_name: 'Checkbox Checked Background' },
  { variable_name: '--form-checkbox-checked-border-color', default_value: '"#2563eb"', description: 'Border color when checkbox/radio is checked', category: 'controls', data_type: 'color', display_name: 'Checkbox Checked Border Color' },
  { variable_name: '--form-checkbox-checked-color', default_value: '"#ffffff"', description: 'Text color when checkbox/radio is checked', category: 'controls', data_type: 'color', display_name: 'Checkbox Checked Color' },
  { variable_name: '--form-checkbox-hover-border-color', default_value: '"#2563eb"', description: 'Border color when checkbox/radio is hovered', category: 'controls', data_type: 'color', display_name: 'Checkbox Hover Border Color' },
  { variable_name: '--form-checkbox-focus-box-shadow', default_value: '"0 0 0 3px rgba(37, 99, 235, 0.1)"', description: 'Box shadow when checkbox/radio is focused', category: 'controls', data_type: 'shadow', display_name: 'Checkbox Focus Shadow' },

  // Phone Input Variables (6)
  { variable_name: '--form-phone-input-background', default_value: '"#ffffff"', description: 'Background color of phone input', category: 'inputs', data_type: 'color', display_name: 'Phone Input Background' },
  { variable_name: '--form-phone-input-border', default_value: '"1px solid #e5e7eb"', description: 'Border of phone input', category: 'inputs', data_type: 'border', display_name: 'Phone Input Border' },
  { variable_name: '--form-phone-input-border-radius', default_value: '"0.375rem"', description: 'Border radius of phone input', category: 'inputs', data_type: 'border', display_name: 'Phone Input Border Radius' },
  { variable_name: '--form-phone-input-padding', default_value: '"0.5rem 0.75rem"', description: 'Padding of phone input', category: 'inputs', data_type: 'spacing', display_name: 'Phone Input Padding' },
  { variable_name: '--form-phone-input-focus-border-color', default_value: '"#2563eb"', description: 'Border color when phone input is focused', category: 'inputs', data_type: 'color', display_name: 'Phone Input Focus Border Color' },
  { variable_name: '--form-phone-input-focus-box-shadow', default_value: '"0 0 0 3px rgba(37, 99, 235, 0.1)"', description: 'Box shadow when phone input is focused', category: 'inputs', data_type: 'shadow', display_name: 'Phone Input Focus Shadow' },

  // File Upload Variables (8)
  { variable_name: '--form-file-upload-border', default_value: '"2px dashed #d1d5db"', description: 'Border of file upload area', category: 'inputs', data_type: 'border', display_name: 'File Upload Border' },
  { variable_name: '--form-file-upload-border-radius', default_value: '"0.5rem"', description: 'Border radius of file upload area', category: 'inputs', data_type: 'border', display_name: 'File Upload Border Radius' },
  { variable_name: '--form-file-upload-padding', default_value: '"1.5rem"', description: 'Padding of file upload area', category: 'inputs', data_type: 'spacing', display_name: 'File Upload Padding' },
  { variable_name: '--form-file-upload-background', default_value: '"#f9fafb"', description: 'Background color of file upload area', category: 'inputs', data_type: 'color', display_name: 'File Upload Background' },
  { variable_name: '--form-file-upload-hover-background', default_value: '"#f3f4f6"', description: 'Background color when file upload area is hovered', category: 'inputs', data_type: 'color', display_name: 'File Upload Hover Background' },
  { variable_name: '--form-file-upload-drag-active-border', default_value: '"2px dashed #60a5fa"', description: 'Border when files are being dragged over upload area', category: 'inputs', data_type: 'border', display_name: 'File Upload Drag Active Border' },
  { variable_name: '--form-file-upload-drag-active-background', default_value: '"#eff6ff"', description: 'Background color when files are being dragged over upload area', category: 'inputs', data_type: 'color', display_name: 'File Upload Drag Active Background' },
  { variable_name: '--form-file-upload-error-border', default_value: '"2px dashed #fca5a5"', description: 'Border color when file upload has error', category: 'inputs', data_type: 'border', display_name: 'File Upload Error Border' },
  { variable_name: '--form-file-upload-error-background', default_value: '"#fef2f2"', description: 'Background color when file upload has error', category: 'inputs', data_type: 'color', display_name: 'File Upload Error Background' },

  // Signature Field Variables (9)
  { variable_name: '--form-signature-border', default_value: '"2px dashed #93c5fd"', description: 'Border of signature area', category: 'inputs', data_type: 'border', display_name: 'Signature Border' },
  { variable_name: '--form-signature-border-radius', default_value: '"0.5rem"', description: 'Border radius of signature area', category: 'inputs', data_type: 'border', display_name: 'Signature Border Radius' },
  { variable_name: '--form-signature-padding', default_value: '"2rem"', description: 'Padding of signature area', category: 'inputs', data_type: 'spacing', display_name: 'Signature Padding' },
  { variable_name: '--form-signature-background', default_value: '"#eff6ff"', description: 'Background color of signature area', category: 'inputs', data_type: 'color', display_name: 'Signature Background' },
  { variable_name: '--form-signature-button-border', default_value: '"1px solid #93c5fd"', description: 'Border of signature button', category: 'inputs', data_type: 'border', display_name: 'Signature Button Border' },
  { variable_name: '--form-signature-button-color', default_value: '"#1d4ed8"', description: 'Color of signature button', category: 'inputs', data_type: 'color', display_name: 'Signature Button Color' },
  { variable_name: '--form-signature-button-hover-background', default_value: '"#dbeafe"', description: 'Background color when signature button is hovered', category: 'inputs', data_type: 'color', display_name: 'Signature Button Hover Background' },
  { variable_name: '--form-signature-button-hover-border', default_value: '"1px solid #93c5fd"', description: 'Border color when signature button is hovered', category: 'inputs', data_type: 'border', display_name: 'Signature Button Hover Border' },
  { variable_name: '--form-signature-preview-border', default_value: '"1px solid #e5e7eb"', description: 'Border of signature preview', category: 'inputs', data_type: 'border', display_name: 'Signature Preview Border' },
  { variable_name: '--form-signature-preview-background', default_value: '"#ffffff"', description: 'Background color of signature preview', category: 'inputs', data_type: 'color', display_name: 'Signature Preview Background' },

  // Heading Variables (5)
  { variable_name: '--form-heading-font-size', default_value: '"1.25rem"', description: 'Font size of form headings', category: 'typography', data_type: 'size', display_name: 'Heading Font Size' },
  { variable_name: '--form-heading-font-weight', default_value: '"600"', description: 'Font weight of form headings', category: 'typography', data_type: 'font', display_name: 'Heading Font Weight' },
  { variable_name: '--form-heading-color', default_value: '"#111827"', description: 'Color of form headings', category: 'typography', data_type: 'color', display_name: 'Heading Color' },
  { variable_name: '--form-heading-margin-bottom', default_value: '"1.5rem"', description: 'Bottom margin of form headings', category: 'typography', data_type: 'spacing', display_name: 'Heading Margin Bottom' },
  { variable_name: '--form-heading-line-height', default_value: '"1.5"', description: 'Line height of form headings', category: 'typography', data_type: 'size', display_name: 'Heading Line Height' },

  // Text Block Variables (4)
  { variable_name: '--form-text-block-font-size', default_value: '"1rem"', description: 'Font size of text blocks', category: 'typography', data_type: 'size', display_name: 'Text Block Font Size' },
  { variable_name: '--form-text-block-color', default_value: '"#374151"', description: 'Color of text blocks', category: 'typography', data_type: 'color', display_name: 'Text Block Color' },
  { variable_name: '--form-text-block-line-height', default_value: '"1.5"', description: 'Line height of text blocks', category: 'typography', data_type: 'size', display_name: 'Text Block Line Height' },
  { variable_name: '--form-text-block-margin-bottom', default_value: '"1.5rem"', description: 'Bottom margin of text blocks', category: 'typography', data_type: 'spacing', display_name: 'Text Block Margin Bottom' },

  // Help Text Variables (4)
  { variable_name: '--form-help-text-font-size', default_value: '"0.75rem"', description: 'Font size of help text', category: 'typography', data_type: 'size', display_name: 'Help Text Font Size' },
  { variable_name: '--form-help-text-color', default_value: '"#6b7280"', description: 'Color of help text', category: 'typography', data_type: 'color', display_name: 'Help Text Color' },
  { variable_name: '--form-help-text-margin-top', default_value: '"0.25rem"', description: 'Top margin of help text', category: 'typography', data_type: 'spacing', display_name: 'Help Text Margin Top' },
  { variable_name: '--form-help-text-line-height', default_value: '"1.5"', description: 'Line height of help text', category: 'typography', data_type: 'size', display_name: 'Help Text Line Height' },

  // Error Message Variables (4)
  { variable_name: '--form-error-color', default_value: '"#ef4444"', description: 'Color of error messages', category: 'validation', data_type: 'color', display_name: 'Error Color' },
  { variable_name: '--form-error-font-size', default_value: '"0.875rem"', description: 'Font size of error messages', category: 'validation', data_type: 'size', display_name: 'Error Font Size' },
  { variable_name: '--form-error-margin-top', default_value: '"0.25rem"', description: 'Top margin of error messages', category: 'validation', data_type: 'spacing', display_name: 'Error Margin Top' },
  { variable_name: '--form-error-line-height', default_value: '"1.5"', description: 'Line height of error messages', category: 'validation', data_type: 'size', display_name: 'Error Line Height' },

  // RTL/LTR Direction Variables (7)
  { variable_name: '--form-direction', default_value: '"ltr"', description: 'Text direction (ltr or rtl)', category: 'layout', data_type: 'direction', display_name: 'Direction' },
  { variable_name: '--form-text-align', default_value: '"left"', description: 'Text alignment (left or right)', category: 'layout', data_type: 'direction', display_name: 'Text Align' },
  { variable_name: '--form-flex-direction', default_value: '"row"', description: 'Flex direction (row or row-reverse)', category: 'layout', data_type: 'direction', display_name: 'Flex Direction' },
  { variable_name: '--form-margin-start', default_value: '"margin-left"', description: 'Start margin property', category: 'layout', data_type: 'direction', display_name: 'Margin Start' },
  { variable_name: '--form-margin-end', default_value: '"margin-right"', description: 'End margin property', category: 'layout', data_type: 'direction', display_name: 'Margin End' },
  { variable_name: '--form-padding-start', default_value: '"padding-left"', description: 'Start padding property', category: 'layout', data_type: 'direction', display_name: 'Padding Start' },
  { variable_name: '--form-padding-end', default_value: '"padding-right"', description: 'End padding property', category: 'layout', data_type: 'direction', display_name: 'Padding End' }
]

const DEFAULT_TOKENS = [
  { token_name: '--form-font-family', default_value: '"Inter, system-ui, sans-serif"', category: 'layout', data_type: 'font', display_name: 'Font Family', description: 'Primary font family for all form text.' },
  { token_name: '--form-font-size-base', default_value: '"1rem"', category: 'layout', data_type: 'size', display_name: 'Base Font Size', description: 'Default font size for body text.' },
  { token_name: '--form-text-color', default_value: '"#1f2937"', category: 'layout', data_type: 'color', display_name: 'Body Text Color', description: 'Primary text color used across the form.' },
  { token_name: '--form-background', default_value: '"#f8fafc"', category: 'layout', data_type: 'color', display_name: 'Page Background', description: 'Page background color behind the card container.' },
  { token_name: '--form-card-background', default_value: '"#ffffff"', category: 'layout', data_type: 'color', display_name: 'Card Background', description: 'Main container background color.' },
  { token_name: '--form-card-border-radius', default_value: '"0.75rem"', category: 'layout', data_type: 'border-radius', display_name: 'Card Border Radius', description: 'Border radius for the form container.' },
  { token_name: '--form-card-shadow', default_value: '"0 10px 15px -3px rgb(15 23 42 / 0.08)"', category: 'layout', data_type: 'shadow', display_name: 'Card Shadow', description: 'Drop shadow used on the card container.' },
  { token_name: '--form-card-padding', default_value: '"2rem"', category: 'layout', data_type: 'spacing', display_name: 'Card Padding', description: 'Padding inside the form card.' },
  { token_name: '--form-gap-field', default_value: '"1.25rem"', category: 'spacing', data_type: 'spacing', display_name: 'Field Gap', description: 'Vertical space between individual fields.' },
  { token_name: '--form-gap-section', default_value: '"2.5rem"', category: 'spacing', data_type: 'spacing', display_name: 'Section Gap', description: 'Vertical space between grouped sections.' },
  { token_name: '--form-heading-size', default_value: '"1.5rem"', category: 'typography', data_type: 'size', display_name: 'Heading Size', description: 'Font size for form headings.' },
  { token_name: '--form-heading-weight', default_value: '"600"', category: 'typography', data_type: 'font', display_name: 'Heading Weight', description: 'Weight applied to headings.' },
  { token_name: '--form-heading-color', default_value: '"#0f172a"', category: 'typography', data_type: 'color', display_name: 'Heading Color', description: 'Text color for headings.' },
  { token_name: '--form-label-size', default_value: '"0.95rem"', category: 'typography', data_type: 'size', display_name: 'Label Size', description: 'Font size for field labels.' },
  { token_name: '--form-label-weight', default_value: '"600"', category: 'typography', data_type: 'font', display_name: 'Label Weight', description: 'Weight for labels above inputs.' },
  { token_name: '--form-label-color', default_value: '"#0f172a"', category: 'typography', data_type: 'color', display_name: 'Label Color', description: 'Text color used for labels.' },
  { token_name: '--form-help-color', default_value: '"#64748b"', category: 'typography', data_type: 'color', display_name: 'Help Text Color', description: 'Muted color used for help text and descriptions.' },
  { token_name: '--form-error-color', default_value: '"#ef4444"', category: 'feedback', data_type: 'color', display_name: 'Error Color', description: 'Primary error color used in states and text.' },
  { token_name: '--form-input-height', default_value: '"3rem"', category: 'inputs', data_type: 'size', display_name: 'Input Height', description: 'Height for single-line inputs.' },
  { token_name: '--form-input-background', default_value: '"#ffffff"', category: 'inputs', data_type: 'color', display_name: 'Input Background', description: 'Background color for inputs and textareas.' },
  { token_name: '--form-input-border', default_value: '"1px solid #cbd5f5"', category: 'inputs', data_type: 'border', display_name: 'Input Border', description: 'Border definition shared by inputs.' },
  { token_name: '--form-input-radius', default_value: '"0.65rem"', category: 'inputs', data_type: 'border-radius', display_name: 'Input Border Radius', description: 'Border radius applied to inputs.' },
  { token_name: '--form-input-text-color', default_value: '"#0f172a"', category: 'inputs', data_type: 'color', display_name: 'Input Text Color', description: 'Text color inside inputs and textareas.' },
  { token_name: '--form-input-placeholder-color', default_value: '"#94a3b8"', category: 'inputs', data_type: 'color', display_name: 'Placeholder Color', description: 'Placeholder text color for inputs.' },
  { token_name: '--form-input-focus-border', default_value: '"1px solid #2563eb"', category: 'inputs', data_type: 'border', display_name: 'Focus Border', description: 'Border applied while an input is focused.' },
  { token_name: '--form-input-focus-ring', default_value: '"0 0 0 3px rgba(37, 99, 235, 0.15)"', category: 'inputs', data_type: 'shadow', display_name: 'Focus Ring', description: 'Focus ring shadow used across form controls.' },
  { token_name: '--form-button-radius', default_value: '"9999px"', category: 'buttons', data_type: 'border-radius', display_name: 'Button Border Radius', description: 'Pill radius applied to primary/secondary buttons.' },
  { token_name: '--form-button-padding', default_value: '"0.75rem 1.5rem"', category: 'buttons', data_type: 'spacing', display_name: 'Button Padding', description: 'Padding used across buttons.' },
  { token_name: '--form-button-primary-bg', default_value: '"#2563eb"', category: 'buttons', data_type: 'color', display_name: 'Primary Button Background', description: 'Background color for primary actions.' },
  { token_name: '--form-button-primary-text', default_value: '"#ffffff"', category: 'buttons', data_type: 'color', display_name: 'Primary Button Text', description: 'Text color for primary actions.' },
  { token_name: '--form-button-primary-hover-bg', default_value: '"#1d4ed8"', category: 'buttons', data_type: 'color', display_name: 'Primary Button Hover Background', description: 'Hover background for primary buttons.' },
  { token_name: '--form-phone-border', default_value: '"1px solid #cbd5f5"', category: 'components', data_type: 'border', display_name: 'Phone Border', description: 'Border applied to the phone input wrapper.' },
  { token_name: '--form-file-surface', default_value: '"#f1f5f9"', category: 'components', data_type: 'color', display_name: 'File Surface', description: 'Surface color used by file upload area.' },
  { token_name: '--form-file-hover-surface', default_value: '"#e2e8f0"', category: 'components', data_type: 'color', display_name: 'File Hover Surface', description: 'Hover state surface color for file upload area.' },
  { token_name: '--form-signature-surface', default_value: '"#ecf4ff"', category: 'components', data_type: 'color', display_name: 'Signature Surface', description: 'Background color of the signature pad.' }
]

async function seedFormStylingDefaults() {
  console.log('🌱 Seeding form styling defaults...')
  
  try {
    // Clear existing defaults
    await prisma.formStylingDefault.deleteMany({})
    
    // Insert all default variables
    for (const variable of DEFAULT_STYLING_VARIABLES) {
      await prisma.formStylingDefault.upsert({
        where: {
          variable_name: variable.variable_name
        },
        update: {
          default_value: variable.default_value,
          description: variable.description,
          category: variable.category,
          data_type: variable.data_type,
          display_name: variable.display_name,
          is_user_editable: variable.is_user_editable ?? true,
          updated_at: new Date()
        },
        create: {
          variable_name: variable.variable_name,
          default_value: variable.default_value,
          description: variable.description,
          category: variable.category,
          data_type: variable.data_type,
          display_name: variable.display_name,
          is_user_editable: variable.is_user_editable ?? true
        }
      })
    }
    
    console.log(`✅ Seeded ${DEFAULT_STYLING_VARIABLES.length} form styling default variables`)
  } catch (error) {
    console.error('❌ Error seeding form styling defaults:', error)
    throw error
  }
}

async function seedFormStyleTokenDefaults() {
  console.log('🌱 Seeding simplified form style token defaults...')

  await prisma.formStyleTokenDefault.deleteMany({})

  for (const token of DEFAULT_TOKENS) {
    await prisma.formStyleTokenDefault.upsert({
      where: { token_name: token.token_name },
      update: {
        default_value: token.default_value,
        description: token.description,
        category: token.category,
        data_type: token.data_type,
        display_name: token.display_name,
        is_user_editable: true,
        updated_at: new Date()
      },
      create: {
        token_name: token.token_name,
        default_value: token.default_value,
        description: token.description,
        category: token.category,
        data_type: token.data_type,
        display_name: token.display_name,
        is_user_editable: true
      }
    })
  }

  console.log(`✅ Seeded ${DEFAULT_TOKENS.length} simplified form style token defaults`)
}

async function initializeExistingForms() {
  console.log('🔄 Initializing existing forms with default styling variables...')
  
  try {
    // Get all existing forms
    const forms = await prisma.form.findMany({
      where: { deleted_at: null }
    })
    
    console.log(`Found ${forms.length} existing forms to initialize`)
    
    // Get all default variables
    const defaults = await prisma.formStylingDefault.findMany({
      where: { is_user_editable: true } // Only user-editable variables
    })
    
    // Initialize each form with default variables
    for (const form of forms) {
      console.log(`Initializing form: ${form.title} (${form.id})`)
      
      for (const defaultVar of defaults) {
        await prisma.formStylingVariable.upsert({
          where: {
            form_id_variable_name: {
              form_id: form.id,
              variable_name: defaultVar.variable_name
            }
          },
          update: {
            variable_value: defaultVar.default_value,
            updated_at: new Date()
          },
          create: {
            form_id: form.id,
            variable_name: defaultVar.variable_name,
            variable_value: defaultVar.default_value
          }
        })
      }
    }
    
    console.log(`✅ Initialized ${forms.length} forms with default styling variables`)
  } catch (error) {
    console.error('❌ Error initializing existing forms:', error)
    throw error
  }
}

async function initializeFormsWithTokenDefaults() {
  console.log('🔄 Initializing forms with simplified tokens...')

  const forms = await prisma.form.findMany({ where: { deleted_at: null } })
  const defaults = await prisma.formStyleTokenDefault.findMany({ where: { deleted_at: null } })

  for (const form of forms) {
    for (const token of defaults) {
      await prisma.formStyleToken.upsert({
        where: {
          form_id_token_name: {
            form_id: form.id,
            token_name: token.token_name
          }
        },
        update: {
          token_value: token.default_value,
          updated_at: new Date()
        },
        create: {
          form_id: form.id,
          token_name: token.token_name,
          token_value: token.default_value
        }
      })
    }
  }

  console.log(`✅ Initialized ${forms.length} forms with simplified token defaults`)
}

async function main() {
  try {
    await seedFormStylingDefaults()
    await initializeExistingForms()
    await seedFormStyleTokenDefaults()
    await initializeFormsWithTokenDefaults()
    console.log('🎉 Form styling initialization complete!')
  } catch (error) {
    console.error('❌ Form styling initialization failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { seedFormStylingDefaults, initializeExistingForms, seedFormStyleTokenDefaults, initializeFormsWithTokenDefaults }
