# GOV-023: Policy Editor - Testing Guide

**Task ID:** GOV-023  
**Status:** Ready for Testing  
**Date:** December 2024

---

## 🧪 Testing Checklist

### 1. Rich Text Editor Functionality

#### Basic Editing
- [ ] Open policy form (Create or Edit)
- [ ] Navigate to "Content" tab
- [ ] Verify rich text editor appears with toolbar
- [ ] Type basic text
- [ ] Verify placeholder shows when empty

#### Formatting Features
- [ ] Test **Bold** formatting (click Bold button or Ctrl+B)
- [ ] Test *Italic* formatting (click Italic button or Ctrl+I)
- [ ] Create a bulleted list
- [ ] Create a numbered list
- [ ] Add a link to text
- [ ] Add an image (test with valid image URL)
- [ ] Test Undo (Ctrl+Z)
- [ ] Test Redo (Ctrl+Y)

#### Content Persistence
- [ ] Create policy with formatted content
- [ ] Save policy
- [ ] Edit the same policy
- [ ] Verify all formatting is preserved
- [ ] Verify HTML is saved correctly

### 2. Template Selection

#### Template Dropdown
- [ ] Navigate to "Content" tab
- [ ] Verify template selector appears above editor
- [ ] Click template dropdown
- [ ] Verify all 8 templates are listed:
  - Information Security Policy
  - Data Privacy Policy
  - Acceptable Use Policy
  - Incident Response Policy
  - Remote Work Policy
  - Password Policy
  - Business Continuity Policy
  - Vendor Management Policy
  - Code of Conduct
  - Financial Controls Policy

#### Template Application
- [ ] Select a template from dropdown
- [ ] Verify template content loads into editor
- [ ] Verify policy title is auto-filled
- [ ] Verify all formatting is preserved (headings, lists, etc.)
- [ ] Edit template content
- [ ] Save policy

#### Template Replacement Warning
- [ ] Type some content in editor
- [ ] Select a template
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel" - verify content not replaced
- [ ] Select template again
- [ ] Click "Replace Content" - verify content is replaced

### 3. Form Integration

#### Basic Information Tab
- [ ] Fill in all basic fields
- [ ] Verify form validation works
- [ ] Switch between tabs

#### Content Tab
- [ ] Add rich text content
- [ ] Apply template
- [ ] Verify content field updates
- [ ] Navigate away and back - verify content persists in form state

#### Control Objectives Tab
- [ ] Save policy first
- [ ] Navigate to Control Objectives tab
- [ ] Verify control objectives section works

#### Settings Tab
- [ ] Configure acknowledgment settings
- [ ] Verify settings save correctly

### 4. Policy Creation Flow

#### Complete Workflow
- [ ] Click "Add Policy" button
- [ ] Fill Basic Information tab
- [ ] Go to Content tab
- [ ] Select template (e.g., "Information Security Policy")
- [ ] Verify content loads
- [ ] Edit template content as needed
- [ ] Add additional formatting
- [ ] Save policy
- [ ] Verify policy appears in list
- [ ] Edit policy
- [ ] Verify all content loads correctly

### 5. Template Content Quality

#### Check Each Template
- [ ] Information Security Policy - comprehensive security guidelines
- [ ] Data Privacy Policy - GDPR/compliance focused
- [ ] Acceptable Use Policy - IT resource usage
- [ ] Incident Response Policy - security incident handling
- [ ] Remote Work Policy - remote work guidelines
- [ ] Password Policy - authentication standards
- [ ] Business Continuity Policy - disaster recovery
- [ ] Vendor Management Policy - third-party management
- [ ] Code of Conduct - ethical standards
- [ ] Financial Controls Policy - financial procedures

### 6. Edge Cases

#### Empty Content
- [ ] Create policy with no content
- [ ] Save and verify it works
- [ ] Edit and add content

#### Large Content
- [ ] Create policy with very long content
- [ ] Test scrolling in editor
- [ ] Save and verify

#### Special Characters
- [ ] Test with special characters (Arabic, symbols)
- [ ] Verify they save correctly

#### Multiple Templates
- [ ] Create policy with Template A
- [ ] Create another policy with Template B
- [ ] Verify both work independently

---

## 📋 Sample Test Scenarios

### Scenario 1: Create Security Policy from Template
1. Navigate to Governance > Policies
2. Click "Add Policy"
3. Fill Basic Information:
   - Policy Type: "Information Security"
   - Title: "Corporate Information Security Policy"
   - Status: Draft
4. Go to Content tab
5. Select "Information Security Policy" template
6. Review loaded content
7. Edit section 3 (Policy Statement) to add company-specific details
8. Add bold formatting to key terms
9. Add a link to related policies
10. Save policy
11. Verify policy appears in list
12. Edit policy and verify content is preserved

### Scenario 2: Create Custom Policy from Scratch
1. Navigate to Governance > Policies
2. Click "Add Policy"
3. Fill Basic Information
4. Go to Content tab
5. Don't select a template
6. Type content from scratch:
   - Add heading (format as H1)
   - Add paragraphs
   - Create bulleted list
   - Add numbered list
   - Add link
7. Save policy
8. Verify all formatting saved

### Scenario 3: Replace Existing Content with Template
1. Open existing policy for editing
2. Go to Content tab
3. Verify existing content is displayed
4. Select a template
5. Confirm replacement dialog
6. Verify old content replaced
7. Save and verify

---

## 🎯 Expected Behavior

### Rich Text Editor
- Toolbar should be visible and functional
- Formatting buttons should highlight when active
- Undo/Redo should work correctly
- Links should open in dialog for URL input
- Images should open in dialog for URL input
- Content should render correctly with proper formatting

### Template Selector
- Dropdown should list all available templates
- Template descriptions should be visible
- Selecting template should load content immediately (if no existing content)
- Confirmation dialog should appear when replacing existing content
- Policy title should auto-fill with template name

### Form Integration
- All tabs should work correctly
- Content should persist when switching tabs
- Form validation should work
- Save should work correctly
- Edit should load existing content properly

---

## 🐛 Known Issues to Check

### Potential Issues
1. **Template content not loading** - Check if template ID matches
2. **Formatting lost on save** - Verify HTML is being saved correctly
3. **Editor not rendering** - Check browser console for errors
4. **Template selector not appearing** - Verify component is imported correctly

### Debugging Tips
1. Check browser console for errors
2. Verify network requests in DevTools
3. Check form state in React DevTools
4. Verify API responses contain expected data

---

## ✅ Test Results Template

```
Date: ___________
Tester: ___________

Rich Text Editor:
- Basic editing: ✅/❌
- Formatting: ✅/❌
- Content persistence: ✅/❌

Template Selection:
- Template dropdown: ✅/❌
- Template application: ✅/❌
- Replacement warning: ✅/❌

Form Integration:
- Tabs navigation: ✅/❌
- Form validation: ✅/❌
- Save/Load: ✅/❌

Issues Found:
1. ___________
2. ___________

Overall Status: ✅ Ready / ❌ Needs Fixes
```

---

## 📝 Next Steps After Testing

1. Fix any bugs found during testing
2. Gather user feedback
3. Add additional templates if needed
4. Consider adding more editor features (tables, code blocks, etc.)
5. Document any limitations or known issues

---

**Ready for testing!** 🚀





