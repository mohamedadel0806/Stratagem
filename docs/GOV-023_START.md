# GOV-023: Policy Editor - Rich Text Editor - Starting Implementation

**Status:** 🟢 Starting Implementation  
**Task:** Add Rich Text Editor to Policy Form

---

## Current State

- ✅ Policy form exists at `frontend/src/components/governance/policy-form.tsx`
- ✅ Has tabs: Basic Information, Content, Control Objectives, Settings
- ❌ Content tab uses basic `<Textarea>` component
- ❌ No rich text editor installed
- ❌ No template selection
- ❌ No version comparison

---

## Implementation Steps

### 1. Install Rich Text Editor
- Install `@tinymce/tinymce-react` or alternative
- Choose: TinyMCE (feature-rich) or Tiptap (lightweight, open source)

### 2. Create RichTextEditor Component
- Wrapper component for TinyMCE/Tiptap
- Integrate with react-hook-form
- Configure toolbar and features

### 3. Update Policy Form
- Replace Textarea with RichTextEditor
- Ensure content field works with form

### 4. Add Template Selection
- Template dropdown/selector
- Load template content
- Apply template to editor

### 5. (Optional) Version Comparison
- Version diff view
- Side-by-side comparison

---

**Starting with Step 1: Install Rich Text Editor**







