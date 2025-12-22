# GOV-023: Policy Editor - Docker Testing Guide

**Date:** December 2024  
**Environment:** Docker containers running

---

## 🐳 Docker Environment Status

**Frontend Container:** `stratagem-frontend-1`
- **Status:** Up 11 hours
- **Port:** 3000 (localhost:3000)
- **URL:** http://localhost:3000

**Backend Container:** `stratagem-backend-1`
- **Status:** Up 11 hours
- **Port:** 3001 (localhost:3001)

---

## 🚀 Testing Steps (Docker)

### Step 1: Verify Dependencies Installed

Since we just added Tiptap packages, we need to install them in the Docker container:

```bash
# Option 1: Install in running container (hot reload)
docker-compose exec frontend npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-image --legacy-peer-deps

# Option 2: Rebuild container (if needed)
docker-compose up -d --build frontend
```

### Step 2: Access the Application

1. **Frontend URL:** http://localhost:3000
2. **Navigate to:** Governance > Policies
   - Direct URL: http://localhost:3000/dashboard/governance/policies

### Step 3: Test Rich Text Editor

1. Login to the application
2. Navigate to: `/dashboard/governance/policies`
3. Click "Add Policy" button
4. Go to "Content" tab
5. Verify rich text editor loads with toolbar
6. Test formatting buttons

### Step 4: Test Template Selection

1. In Content tab, find template selector above editor
2. Click dropdown
3. Verify all 10 templates appear
4. Select a template
5. Verify content loads
6. Verify title auto-fills

---

## 🔧 Docker Commands for Testing

### Check Frontend Logs
```bash
docker-compose logs -f frontend
```

### Install Packages in Container
```bash
docker-compose exec frontend npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-image --legacy-peer-deps
```

### Restart Frontend (if needed)
```bash
docker-compose restart frontend
```

### Check Container Status
```bash
docker-compose ps frontend
```

### Access Container Shell
```bash
docker-compose exec frontend sh
```

### Check if Tiptap is Installed
```bash
docker-compose exec frontend npm list @tiptap/react
```

---

## 🧪 Browser Testing Steps

### 1. Open Browser
- Navigate to: http://localhost:3000
- Login if required

### 2. Navigate to Policy Editor
- Go to: Governance > Policies
- Or direct: http://localhost:3000/dashboard/governance/policies

### 3. Create New Policy
- Click "Add Policy" button
- Fill Basic Information tab
- Switch to "Content" tab

### 4. Test Rich Text Editor
- Verify toolbar appears
- Test Bold, Italic buttons
- Create a list
- Add a link
- Type formatted text

### 5. Test Template Selection
- Find template dropdown
- Select "Information Security Policy"
- Verify content loads
- Verify title updates
- Edit content
- Save policy

---

## 🐛 Troubleshooting

### Issue: Rich Text Editor Not Loading

**Check:**
```bash
# Check if packages are installed
docker-compose exec frontend npm list @tiptap/react

# Install if missing
docker-compose exec frontend npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-image --legacy-peer-deps

# Check browser console for errors
```

### Issue: Templates Not Appearing

**Check:**
```bash
# Verify template file exists
docker-compose exec frontend ls -la src/lib/policy-templates.ts

# Check frontend logs
docker-compose logs frontend | grep -i error
```

### Issue: Page Not Loading

**Check:**
```bash
# Verify container is running
docker-compose ps frontend

# Check logs
docker-compose logs frontend --tail 50

# Restart if needed
docker-compose restart frontend
```

---

## ✅ Quick Test Checklist

- [ ] Frontend accessible at http://localhost:3000
- [ ] Can navigate to Governance > Policies
- [ ] "Add Policy" button works
- [ ] Content tab shows rich text editor
- [ ] Toolbar buttons work
- [ ] Template dropdown appears
- [ ] Templates load correctly
- [ ] Content saves successfully

---

## 🎯 Expected Behavior

1. **Rich Text Editor:**
   - Toolbar visible with formatting buttons
   - Typing works smoothly
   - Formatting applies correctly
   - Content displays with proper styling

2. **Template Selector:**
   - Dropdown shows all 10 templates
   - Template names and descriptions visible
   - Selecting template loads content
   - Title auto-fills

3. **Form Integration:**
   - All tabs work
   - Content persists when switching tabs
   - Save/Load works correctly

---

**Ready to test in Docker!** 🐳







