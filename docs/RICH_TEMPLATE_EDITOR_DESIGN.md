# Rich Template Editor - Design Concept

## Overview
The Rich Template Editor would allow users to create visually customized reports with branding, custom layouts, and advanced formatting options.

## UI Layout

### Main Editor Interface

```
┌─────────────────────────────────────────────────────────────┐
│  Report Template: [Weekly Asset Inventory]                  │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  [Preview] [Save] [Cancel]                                  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Tabs: [Layout] [Branding] [Sections] [Charts] [Preview]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Report Layout Builder                             │    │
│  │  ────────────────────────────────────────────────  │    │
│  │                                                    │    │
│  │  ┌────────────────────────────────────────────┐  │    │
│  │  │  Header Section                            │  │    │
│  │  │  ┌─────────────┐  ┌─────────────────────┐  │  │    │
│  │  │  │ [Logo]      │  │ Company Name        │  │  │    │
│  │  │  │             │  │ Report Title        │  │  │    │
│  │  │  └─────────────┘  └─────────────────────┘  │  │    │
│  │  │  [Edit Header] [Upload Logo]              │  │    │
│  │  └────────────────────────────────────────────┘  │    │
│  │                                                    │    │
│  │  ┌────────────────────────────────────────────┐  │    │
│  │  │  Section 1: Executive Summary              │  │    │
│  │  │  [Text Block] [Chart] [Table]              │  │    │
│  │  │  ┌──────────────────────────────────────┐ │  │    │
│  │  │  │  Drag elements here                  │ │  │    │
│  │  │  │  - Text blocks                       │ │  │    │
│  │  │  │  - Data tables                       │ │  │    │
│  │  │  │  - Charts/graphs                     │ │  │    │
│  │  │  └──────────────────────────────────────┘ │  │    │
│  │  │  [Add Section] [Delete] [Move Up/Down]    │  │    │
│  │  └────────────────────────────────────────────┘  │    │
│  │                                                    │    │
│  │  ┌────────────────────────────────────────────┐  │    │
│  │  │  Section 2: Asset Details                  │  │    │
│  │  │  [Data Table with selected fields]         │  │    │
│  │  │  [Conditional Formatting Rules]            │  │    │
│  │  └────────────────────────────────────────────┘  │    │
│  │                                                    │    │
│  │  ┌────────────────────────────────────────────┐  │    │
│  │  │  Footer Section                            │  │    │
│  │  │  Generated: {date} | Page {page} of {total}│  │    │
│  │  │  [Edit Footer]                             │  │    │
│  │  └────────────────────────────────────────────┘  │    │
│  │                                                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Sidebar:                                                   │
│  ┌────────────────────┐                                    │
│  │  Elements          │                                    │
│  │  ────────────────   │                                    │
│  │  📝 Text Block     │                                    │
│  │  📊 Chart          │                                    │
│  │  📋 Table          │                                    │
│  │  📈 Summary Stats  │                                    │
│  │  🖼️  Image         │                                    │
│  │  ────────────────   │                                    │
│  │  Drag to add       │                                    │
│  └────────────────────┘                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Features Breakdown

### 1. **Layout Tab**
- **Drag-and-drop sections**: Add, reorder, delete sections
- **Section types**:
  - Header (with logo, title, date)
  - Content sections (text, tables, charts)
  - Summary sections (statistics, KPIs)
  - Footer (page numbers, disclaimers)
- **Layout options**: Single column, two columns, custom grid

### 2. **Branding Tab**
```
┌─────────────────────────────────────┐
│  Company Branding                    │
│  ─────────────────────────────────── │
│                                      │
│  Logo Upload:                        │
│  ┌─────────────┐                    │
│  │  [Logo]     │  [Upload] [Remove] │
│  │  Preview    │                    │
│  └─────────────┘                    │
│                                      │
│  Colors:                             │
│  Primary: [████] #1e40af            │
│  Secondary: [████] #64748b           │
│                                      │
│  Fonts:                              │
│  Heading: [Arial ▼]                  │
│  Body: [Arial ▼]                     │
│                                      │
│  Header Style:                       │
│  ○ Minimal  ○ Standard  ● Custom    │
│                                      │
└─────────────────────────────────────┘
```

### 3. **Sections Tab**
- **Add custom sections**:
  - Text blocks (rich text with formatting)
  - Data tables (from selected fields)
  - Summary statistics (counts, totals, averages)
  - Conditional sections (show/hide based on data)
- **Section properties**:
  - Title
  - Visibility conditions
  - Data source (which fields/filters)
  - Styling options

### 4. **Charts Tab**
```
┌─────────────────────────────────────┐
│  Add Chart                           │
│  ─────────────────────────────────── │
│                                      │
│  Chart Type:                         │
│  ○ Bar Chart  ○ Line Chart          │
│  ○ Pie Chart  ○ Area Chart          │
│                                      │
│  Data Source:                        │
│  [Select field to aggregate]        │
│                                      │
│  Group By:                           │
│  [Criticality Level ▼]              │
│                                      │
│  Chart Title:                        │
│  [Asset Distribution by Criticality] │
│                                      │
│  Position:                           │
│  [After Section 1 ▼]                │
│                                      │
└─────────────────────────────────────┘
```

### 5. **Conditional Formatting**
```
┌─────────────────────────────────────┐
│  Formatting Rules                   │
│  ─────────────────────────────────── │
│                                      │
│  Rule 1:                            │
│  IF [Criticality Level] = "High"    │
│  THEN [Background Color: Red]       │
│  [Add Rule]                         │
│                                      │
│  Rule 2:                            │
│  IF [Owner] is empty                │
│  THEN [Text Color: Orange]          │
│                                      │
└─────────────────────────────────────┘
```

### 6. **Preview Tab**
- Live preview of the report
- Shows how it will look with actual data
- Export preview (PDF/Excel)
- Print preview

## Example Report Output

```
┌─────────────────────────────────────────────────────┐
│  [Company Logo]    GRC Platform                     │
│                    Asset Inventory Report            │
│                    Generated: Dec 17, 2025         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Executive Summary                                   │
│  ─────────────────                                   │
│  Total Assets: 245                                  │
│  High Criticality: 12                               │
│  Without Owner: 8                                   │
│                                                      │
│  [Bar Chart: Assets by Type]                       │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Asset Details                                       │
│  ─────────────────                                   │
│  ┌──────────┬──────────┬──────────┬──────────┐     │
│  │ Name     │ Type     │ Owner    │ Critical │     │
│  ├──────────┼──────────┼──────────┼──────────┤     │
│  │ Asset 1  │ Server   │ John D.  │ High     │     │
│  │ Asset 2  │ Laptop   │ Jane S.  │ Medium   │     │
│  └──────────┴──────────┴──────────┴──────────┘     │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Page 1 of 3 | Generated by GRC Platform            │
└─────────────────────────────────────────────────────┘
```

## Implementation Approach

### Option 1: Form-Based Editor (Simpler)
- Tabbed interface with form fields
- Upload logo, set colors, add sections
- Configure each section with dropdowns
- Good for: Quick setup, less flexibility

### Option 2: Visual Drag-and-Drop Builder (Advanced)
- Drag elements from sidebar
- Drop into sections
- Visual WYSIWYG editing
- Good for: Full control, professional layouts

### Option 3: Hybrid Approach (Recommended)
- Form-based for basic settings (branding, colors)
- Visual builder for sections
- Template presets for quick start
- Good for: Balance of ease and power

## Technical Stack Suggestions

1. **Layout Builder**: 
   - React DnD (drag and drop)
   - Or use a library like `react-grid-layout`

2. **Chart Generation**:
   - Chart.js or Recharts for preview
   - Backend: Use same library or convert to static images

3. **PDF Generation**:
   - jsPDF (already in use)
   - Or Puppeteer for HTML-to-PDF with full styling

4. **Template Storage**:
   - Store layout as JSON in database
   - Include: sections, styling, chart configs, conditional rules

## Database Schema Addition

```typescript
{
  // Existing fields...
  
  // Rich editor fields
  layout: {
    header: {
      logoUrl: string,
      title: string,
      showDate: boolean,
      style: 'minimal' | 'standard' | 'custom'
    },
    sections: [
      {
        id: string,
        type: 'text' | 'table' | 'chart' | 'summary',
        title: string,
        position: number,
        config: {...} // type-specific config
      }
    ],
    footer: {
      text: string,
      showPageNumbers: boolean
    }
  },
  branding: {
    primaryColor: string,
    secondaryColor: string,
    logoUrl: string,
    fonts: {...}
  },
  conditionalFormatting: [
    {
      field: string,
      condition: string,
      style: {...}
    }
  ]
}
```

## User Flow

1. **Create/Edit Template** → Click "Rich Editor" tab
2. **Configure Branding** → Upload logo, set colors
3. **Add Sections** → Click "Add Section", choose type
4. **Configure Section** → Select data source, fields, styling
5. **Add Charts** → Choose chart type, configure data
6. **Set Formatting** → Add conditional rules
7. **Preview** → See live preview with sample data
8. **Save** → Template ready to use

## Benefits

- **Professional Reports**: Branded, polished output
- **Flexibility**: Custom layouts for different needs
- **Visual Insights**: Charts and graphs for better understanding
- **Consistency**: Company branding across all reports
- **Advanced Users**: Power users can create complex reports
