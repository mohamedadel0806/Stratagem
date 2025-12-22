# How to Upload Evidence Files

## Navigation Path

1. **Login to the application**
   - Go to: `http://localhost:3000/en/login`
   - Enter your credentials

2. **Navigate to Governance → Evidence**
   - URL: `http://localhost:3000/en/dashboard/governance/evidence`
   - Or use the sidebar navigation menu

3. **Click "Add Evidence" Button**
   - Located at the top-right of the Evidence page
   - This opens the Create Evidence dialog

4. **Upload Your File**
   - In the dialog form, scroll to the "File Upload" section
   - You'll see:
     - A drag-and-drop area
     - "Download Template" link (top-right of the upload section)
     - File selection/upload controls

## Step-by-Step Upload Process

### Step 1: Fill in Basic Information
- **Evidence Identifier** (required): e.g., `EVID-2024-001`
- **Title** (required): e.g., `MFA Configuration Screenshot`
- **Description** (optional): Add details about the evidence
- **Evidence Type** (required): Select from dropdown (Policy Document, Screenshot, etc.)

### Step 2: Upload Your File

#### Option A: Drag and Drop
1. Drag your file from your computer
2. Drop it into the upload area
3. The file will appear with its name and size
4. Click the "Upload" button
5. Wait for upload to complete (green highlight when done)

#### Option B: Click to Select
1. Click "Click to upload" in the upload area
2. Select your file from the file picker
3. Click the "Upload" button
4. Wait for upload to complete

### Step 3: Complete Additional Fields
- **Collection Date**: When the evidence was collected
- **Valid From/Until**: Expiration dates if applicable
- **Confidential**: Mark if sensitive information

### Step 4: Save
- Click "Create" button to save the evidence
- The file is automatically linked to the evidence record

## Download Template

To see examples and instructions:

1. In the Evidence form, look for "Download Template" link
2. Located next to "File Upload" label (top-right)
3. Click the link to download: `evidence-template-sample.txt`
4. Open the file to see:
   - Supported file types
   - File size limits
   - Example evidence items
   - Instructions

**Direct Template URL:**
```
http://localhost:3000/uploads/evidence-template-sample.txt
```

## Supported File Types

- ✅ PDF Documents (`.pdf`)
- ✅ Word Documents (`.doc`, `.docx`)
- ✅ Excel Spreadsheets (`.xls`, `.xlsx`)
- ✅ Images (`.jpg`, `.jpeg`, `.png`, `.gif`)
- ✅ Text Files (`.txt`)
- ✅ CSV Files (`.csv`)

## File Size Limits

- **Maximum file size:** 50 MB
- Files larger than this will be rejected

## Quick Access URLs

### Development Environment
- **Evidence Page:** `http://localhost:3000/en/dashboard/governance/evidence`
- **Template File:** `http://localhost:3000/uploads/evidence-template-sample.txt`

### Production Environment
- **Evidence Page:** `https://your-domain.com/en/dashboard/governance/evidence`
- **Template File:** `https://your-domain.com/uploads/evidence-template-sample.txt`

## Visual Guide

```
┌─────────────────────────────────────────────────────┐
│  Dashboard > Governance > Evidence                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [Evidence Repository]                    [+ Add Evidence]  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Create Evidence Dialog                      │   │
│  ├──────────────────────────────────────────────┤   │
│  │                                               │   │
│  │  Evidence Identifier: [EVID-2024-001]        │   │
│  │  Title: [MFA Configuration Screenshot]       │   │
│  │  ...                                         │   │
│  │                                               │   │
│  │  File Upload              [Download Template] │   │
│  │  ┌─────────────────────────────────────────┐ │   │
│  │  │  [Upload Icon]                          │ │   │
│  │  │  Click to upload or drag and drop       │ │   │
│  │  │  PDF, DOC, XLS, JPG, PNG... (Max 50MB) │ │   │
│  │  └─────────────────────────────────────────┘ │   │
│  │                                               │   │
│  │  [Cancel]                            [Create] │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Troubleshooting

### File Not Uploading?
1. Check file size (must be < 50MB)
2. Check file type (must be supported format)
3. Check internet connection
4. Try refreshing the page

### Template Link Not Working?
- Check if file exists at: `/uploads/evidence-template-sample.txt`
- Try direct URL: `http://localhost:3000/uploads/evidence-template-sample.txt`

### Upload Button Not Appearing?
- Make sure you've selected a file first
- File should appear in the upload area before "Upload" button shows

## Need Help?

- Check the template file for detailed instructions
- Review error messages in the form
- Contact your system administrator

---

**Last Updated:** December 2024







