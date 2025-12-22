# GOV-023: Quick Testing Guide (Docker)

**Status:** ✅ Dependencies Installed in Docker  
**Frontend URL:** http://localhost:3000  
**Container:** stratagem-frontend-1 (Up)

---

## ✅ Ready to Test!

### What's Done:
1. ✅ Tiptap packages installed in Docker container
2. ✅ Frontend running on port 3000
3. ✅ All components created and integrated
4. ✅ 10 policy templates available

---

## 🧪 Quick Test Steps

### 1. Access the Application
- **URL:** http://localhost:3000
- Login if required

### 2. Navigate to Policy Editor
- Click: **Governance** → **Policies**
- Or go to: http://localhost:3000/dashboard/governance/policies

### 3. Test Rich Text Editor
1. Click **"Add Policy"** button
2. Fill Basic Information (Policy Type, Title, etc.)
3. Go to **"Content"** tab
4. **Verify:**
   - Rich text editor appears with toolbar
   - Toolbar has: Bold, Italic, Lists, Link, Image, Undo, Redo buttons
   - You can type text
   - Formatting buttons work

### 4. Test Template Selection
1. In Content tab, look for **Template dropdown** above the editor
2. Click the dropdown
3. **Verify:** All 10 templates appear:
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

4. Select **"Information Security Policy"**
5. **Verify:**
   - Content loads into editor
   - Title field auto-fills
   - All formatting preserved (headings, lists)
   - You can edit the content

### 5. Test Saving
1. Edit the template content (add/change text)
2. Format some text (make it bold)
3. Click **"Save"** or **"Create"** button
4. **Verify:** Policy saves successfully
5. Edit the saved policy
6. **Verify:** Content loads with all formatting preserved

---

## 🎯 What to Look For

### ✅ Rich Text Editor Works If:
- Toolbar appears at top of editor
- Formatting buttons are clickable
- Text formatting works (bold, italic, lists)
- Content displays with proper styling
- No console errors in browser DevTools

### ✅ Template Selection Works If:
- Dropdown shows all 10 templates
- Selecting template loads content
- Title auto-fills with template name
- Content has proper formatting (headings, lists)
- Confirmation dialog appears when replacing existing content

### ✅ Form Integration Works If:
- Can switch between tabs
- Content persists when switching tabs
- Save button works
- Policies list updates after save
- Can edit and reload policies

---

## 🐛 If Something Doesn't Work

### Check Browser Console:
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

### Check Docker Logs:
```bash
docker-compose logs frontend --tail 50
```

### Restart Frontend:
```bash
docker-compose restart frontend
```

### Verify Packages:
```bash
docker-compose exec frontend npm list @tiptap/react
```

---

## 📋 Test Results Template

```
Test Date: ___________
Tester: ___________

Rich Text Editor:
- Toolbar appears: ✅/❌
- Formatting works: ✅/❌
- Content saves: ✅/❌

Template Selection:
- Templates appear: ✅/❌
- Template loads: ✅/❌
- Title auto-fills: ✅/❌

Overall: ✅ Working / ❌ Issues Found

Issues:
1. ___________
2. ___________
```

---

**Everything is installed and ready!** Go to http://localhost:3000 to test! 🚀







