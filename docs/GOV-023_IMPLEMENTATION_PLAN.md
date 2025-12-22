# GOV-023: Policy Editor - Rich Text Editor Implementation Plan

**Task ID:** GOV-023  
**Status:** Starting Implementation (60% → Targeting 100%)  
**Estimated Time:** ~16 hours  
**Priority:** P0

---

## 📋 Current Status (60% Complete)

### ✅ Already Implemented:
- Basic form structure with tabs
- Policy metadata fields
- Control objectives section (working)
- Influencer linking (working)
- Status and type fields

### ❌ Missing:
- Rich text editor (currently basic Textarea)
- Template selection
- Version comparison

---

## 🎯 Implementation Plan

### Step 1: Install Rich Text Editor Library
- [ ] Install TinyMCE or similar rich text editor
- [ ] Configure for Next.js/React
- [ ] Add necessary dependencies

### Step 2: Create Rich Text Editor Component
- [ ] Create reusable RichTextEditor component
- [ ] Integrate with react-hook-form
- [ ] Add toolbar configuration
- [ ] Support HTML content

### Step 3: Replace Textarea with Rich Text Editor
- [ ] Update policy form to use rich text editor
- [ ] Ensure content field works correctly
- [ ] Test save/load functionality

### Step 4: Add Template Selection
- [ ] Create template data structure
- [ ] Add template selector dropdown
- [ ] Implement template loading
- [ ] Add "Apply Template" functionality

### Step 5: (Optional) Version Comparison
- [ ] Create version comparison UI
- [ ] Fetch policy versions
- [ ] Display diff between versions

---

## 🔧 Technical Decisions

### Rich Text Editor Choice: **TinyMCE**

**Why TinyMCE?**
- ✅ Well-documented
- ✅ React integration available
- ✅ Extensive features
- ✅ Good accessibility
- ✅ Free tier available

**Alternative:** Tiptap (open source, headless) or Lexical (Facebook's editor)

### Template Structure
- Store templates as JSON/config
- Include default templates for common policy types
- Allow organization-specific templates

---

## 📝 Next Steps

1. Install TinyMCE for React
2. Create RichTextEditor component
3. Integrate into policy form
4. Add template selection
5. Test and verify

**Ready to start implementation!**







