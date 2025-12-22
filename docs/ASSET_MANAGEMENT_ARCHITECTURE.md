# Asset Management System Architecture

## System Overview Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Next.js Frontend]
        ImportWizard[Import Wizard]
        AssetForms[Asset Forms]
        Dashboard[Dashboard & Analytics]
        ConfigUI[Field Config UI]
        IntegrationUI[Integration Management UI]
    end

    subgraph "API Layer"
        AssetAPI[Asset Controllers]
        ImportAPI[Import Endpoints]
        IntegrationAPI[Integration Endpoints]
        FieldConfigAPI[Field Config Endpoints]
        DashboardAPI[Dashboard Endpoints]
    end

    subgraph "Service Layer"
        PhysicalSvc[Physical Asset Service]
        InformationSvc[Information Asset Service]
        ApplicationSvc[Business Application Service]
        SoftwareSvc[Software Asset Service]
        SupplierSvc[Supplier Service]
        ImportSvc[Import Service]
        IntegrationSvc[Integration Service]
        FieldConfigSvc[Field Config Service]
        AuditSvc[Asset Audit Service]
        DependencySvc[Dependency Service]
        SearchSvc[Global Search Service]
        DashboardSvc[Dashboard Service]
    end

    subgraph "Asset Types"
        Physical[Physical Assets<br/>Servers, Workstations,<br/>Network Devices, etc.]
        Information[Information Assets<br/>Databases, Documents,<br/>Data Repositories]
        Application[Business Applications<br/>ERP, CRM, Custom Apps]
        Software[Software Assets<br/>Licensed Software,<br/>Open Source]
        Supplier[Suppliers/Third Parties<br/>Vendors, Partners,<br/>Service Providers]
    end

    subgraph "Database Layer"
        PostgreSQL[(PostgreSQL Database)]
        AssetTables[Asset Tables]
        ConfigTables[Config Tables]
        AuditTables[Audit Tables]
        ImportLogs[Import Logs]
        SyncLogs[Sync Logs]
    end

    subgraph "External Integrations"
        CMDB[CMDB Systems<br/>ServiceNow, BMC, etc.]
        AMS[Asset Management Systems<br/>Lansweeper, ManageEngine, etc.]
        RESTAPI[REST API Integrations]
        Webhooks[Webhook Integrations]
    end

    subgraph "Import Sources"
        CSV[CSV Files]
        Excel[Excel Files<br/>.xlsx, .xls]
    end

    %% Frontend to API
    UI --> AssetAPI
    UI --> ImportAPI
    UI --> IntegrationAPI
    UI --> FieldConfigAPI
    UI --> DashboardAPI
    ImportWizard --> ImportAPI
    AssetForms --> AssetAPI
    Dashboard --> DashboardAPI
    ConfigUI --> FieldConfigAPI
    IntegrationUI --> IntegrationAPI

    %% API to Services
    AssetAPI --> PhysicalSvc
    AssetAPI --> InformationSvc
    AssetAPI --> ApplicationSvc
    AssetAPI --> SoftwareSvc
    AssetAPI --> SupplierSvc
    ImportAPI --> ImportSvc
    IntegrationAPI --> IntegrationSvc
    FieldConfigAPI --> FieldConfigSvc
    DashboardAPI --> DashboardSvc

    %% Services to Asset Types
    PhysicalSvc --> Physical
    InformationSvc --> Information
    ApplicationSvc --> Application
    SoftwareSvc --> Software
    SupplierSvc --> Supplier

    %% Services to Database
    PhysicalSvc --> PostgreSQL
    InformationSvc --> PostgreSQL
    ApplicationSvc --> PostgreSQL
    SoftwareSvc --> PostgreSQL
    SupplierSvc --> PostgreSQL
    ImportSvc --> PostgreSQL
    IntegrationSvc --> PostgreSQL
    FieldConfigSvc --> PostgreSQL
    AuditSvc --> PostgreSQL
    DependencySvc --> PostgreSQL
    SearchSvc --> PostgreSQL
    DashboardSvc --> PostgreSQL

    %% Asset Types to Database
    Physical --> AssetTables
    Information --> AssetTables
    Application --> AssetTables
    Software --> AssetTables
    Supplier --> AssetTables

    %% Import Flow
    CSV --> ImportSvc
    Excel --> ImportSvc
    ImportSvc --> AssetTables
    ImportSvc --> ImportLogs

    %% Integration Flow
    CMDB -->|HTTP/REST| IntegrationSvc
    AMS -->|HTTP/REST| IntegrationSvc
    RESTAPI -->|HTTP/REST| IntegrationSvc
    Webhooks -->|HTTP POST| IntegrationSvc
    IntegrationSvc -->|Field Mapping| AssetTables
    IntegrationSvc --> SyncLogs

    %% Cross-Service Dependencies
    PhysicalSvc --> AuditSvc
    InformationSvc --> AuditSvc
    ApplicationSvc --> AuditSvc
    SoftwareSvc --> AuditSvc
    SupplierSvc --> AuditSvc
    
    PhysicalSvc --> DependencySvc
    InformationSvc --> DependencySvc
    ApplicationSvc --> DependencySvc
    SoftwareSvc --> DependencySvc
    SupplierSvc --> DependencySvc

    FieldConfigSvc -->|Validation| PhysicalSvc
    FieldConfigSvc -->|Validation| InformationSvc
    FieldConfigSvc -->|Validation| ApplicationSvc
    FieldConfigSvc -->|Validation| SoftwareSvc
    FieldConfigSvc -->|Validation| SupplierSvc

    SearchSvc --> PhysicalSvc
    SearchSvc --> InformationSvc
    SearchSvc --> ApplicationSvc
    SearchSvc --> SoftwareSvc
    SearchSvc --> SupplierSvc

    DashboardSvc --> PhysicalSvc
    DashboardSvc --> InformationSvc
    DashboardSvc --> ApplicationSvc
    DashboardSvc --> SoftwareSvc
    DashboardSvc --> SupplierSvc
    DashboardSvc --> AuditSvc

    style Physical fill:#e1f5ff
    style Information fill:#fff4e1
    style Application fill:#e8f5e9
    style Software fill:#f3e5f5
    style Supplier fill:#fce4ec
    style CMDB fill:#ffebee
    style AMS fill:#ffebee
    style PostgreSQL fill:#e0f2f1
    style IntegrationSvc fill:#fff9c4
    style ImportSvc fill:#fff9c4
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant ImportService
    participant IntegrationService
    participant AssetService
    participant Database
    participant ExternalSystem

    Note over User,ExternalSystem: CSV/Excel Import Flow
    User->>Frontend: Upload CSV/Excel File
    Frontend->>API: POST /assets/physical/import/preview
    API->>ImportService: previewCSV/previewExcel()
    ImportService->>Frontend: Return Preview (first 10 rows)
    User->>Frontend: Map Fields & Confirm
    Frontend->>API: POST /assets/physical/import
    API->>ImportService: importPhysicalAssets()
    ImportService->>AssetService: create() for each row
    AssetService->>Database: INSERT assets
    ImportService->>Database: INSERT import_logs
    ImportService->>Frontend: Return Results

    Note over User,ExternalSystem: CMDB/AMS Integration Flow
    User->>Frontend: Configure Integration
    Frontend->>API: POST /assets/integrations
    API->>IntegrationService: createConfig()
    IntegrationService->>Database: INSERT integration_configs
    User->>Frontend: Trigger Sync
    Frontend->>API: POST /assets/integrations/:id/sync
    API->>IntegrationService: sync()
    IntegrationService->>ExternalSystem: GET /api/assets (with auth)
    ExternalSystem->>IntegrationService: Return Asset Data
    IntegrationService->>IntegrationService: Map Fields
    IntegrationService->>AssetService: create() for each asset
    AssetService->>Database: INSERT assets
    IntegrationService->>Database: INSERT integration_sync_logs
    IntegrationService->>Frontend: Return Sync Results

    Note over User,ExternalSystem: Field Configuration Flow
    User->>Frontend: Configure Custom Field
    Frontend->>API: POST /assets/field-configs
    API->>FieldConfigService: create()
    FieldConfigService->>Database: INSERT asset_field_configs
    User->>Frontend: Create Asset (with custom field)
    Frontend->>API: POST /assets/physical
    API->>FieldConfigService: validateFieldValue()
    FieldConfigService->>API: Validation Result
    API->>AssetService: create()
    AssetService->>Database: INSERT physical_assets
```

## Integration Architecture Detail

```mermaid
graph LR
    subgraph "Integration Service"
        Config[Integration Config<br/>- Endpoint URL<br/>- Auth Type<br/>- Field Mapping<br/>- Sync Interval]
        SyncEngine[Sync Engine<br/>- Fetch Data<br/>- Map Fields<br/>- Detect Duplicates<br/>- Handle Conflicts]
        Scheduler[Scheduler<br/>- Interval-based<br/>- Manual Trigger]
    end

    subgraph "Authentication Methods"
        APIKey[API Key<br/>X-API-Key Header]
        Bearer[Bearer Token<br/>Authorization Header]
        Basic[Basic Auth<br/>Username/Password]
        OAuth2[OAuth 2.0<br/>Token Exchange]
    end

    subgraph "External Systems"
        ServiceNow[ServiceNow CMDB]
        BMC[BMC Remedy]
        Lansweeper[Lansweeper]
        ManageEngine[ManageEngine]
        CustomAPI[Custom REST API]
    end

    subgraph "Data Processing"
        FieldMapping[Field Mapping<br/>External → Internal]
        Validation[Data Validation]
        Deduplication[Duplicate Detection<br/>by Unique Identifier]
        ConflictResolution[Conflict Resolution<br/>- Overwrite<br/>- Skip<br/>- Merge]
    end

    subgraph "Storage"
        Assets[(Asset Tables)]
        SyncLogs[(Sync Logs)]
        ErrorLogs[(Error Reports)]
    end

    Config --> SyncEngine
    Scheduler --> SyncEngine
    SyncEngine --> APIKey
    SyncEngine --> Bearer
    SyncEngine --> Basic
    SyncEngine --> OAuth2
    
    APIKey --> ServiceNow
    Bearer --> BMC
    Basic --> Lansweeper
    Bearer --> ManageEngine
    Bearer --> CustomAPI

    ServiceNow --> FieldMapping
    BMC --> FieldMapping
    Lansweeper --> FieldMapping
    ManageEngine --> FieldMapping
    CustomAPI --> FieldMapping

    FieldMapping --> Validation
    Validation --> Deduplication
    Deduplication --> ConflictResolution
    ConflictResolution --> Assets
    SyncEngine --> SyncLogs
    SyncEngine --> ErrorLogs

    style Config fill:#fff9c4
    style SyncEngine fill:#fff9c4
    style FieldMapping fill:#e1f5ff
    style Assets fill:#e0f2f1
```

## Asset Relationships & Dependencies

```mermaid
graph TD
    subgraph "Asset Types"
        P[Physical Asset<br/>Server-001]
        I[Information Asset<br/>Customer Database]
        A[Business Application<br/>ERP System]
        S[Software Asset<br/>Oracle Database]
        Sup[Supplier<br/>Cloud Provider]
    end

    subgraph "Relationship Types"
        Depends[depends_on]
        Uses[uses]
        Contains[contains]
        Hosts[hosts]
        Processes[processes]
        Stores[stores]
    end

    P -->|hosts| A
    A -->|processes| I
    A -->|uses| S
    A -->|depends_on| Sup
    S -->|stores| I
    P -->|depends_on| Sup

    style P fill:#e1f5ff
    style I fill:#fff4e1
    style A fill:#e8f5e9
    style S fill:#f3e5f5
    style Sup fill:#fce4ec
```

## Complete System Integration Map

```mermaid
mindmap
  root((Asset Management))
    Import
      CSV Import
        Field Mapping
        Preview
        Validation
        Error Reporting
      Excel Import
        Multiple Sheets
        Data Type Detection
        Error Handling
    Asset Types
      Physical Assets
        Servers
        Workstations
        Network Devices
        Mobile Devices
      Information Assets
        Databases
        Documents
        Data Repositories
      Business Applications
        ERP Systems
        CRM Systems
        Custom Applications
      Software Assets
        Licensed Software
        Open Source
        Patches & Updates
      Suppliers
        Vendors
        Partners
        Service Providers
    Integrations
      CMDB
        ServiceNow
        BMC Remedy
        Custom CMDB
      Asset Management
        Lansweeper
        ManageEngine
        Snipe-IT
      REST API
        Custom Endpoints
        Field Mapping
      Webhooks
        Real-time Updates
        Event-driven Sync
    Features
      Field Configuration
        Custom Fields
        Validation Rules
        Field Dependencies
      Analytics
        Asset Counts
        Criticality Analysis
        Compliance Tracking
        Security Test Status
      Dependencies
        Relationship Mapping
        Dependency Chains
        Impact Analysis
      Audit Trail
        Change History
        User Tracking
        Field-level Changes
```

## Key Components Summary

### 1. **Import System**
- **CSV/Excel Parser**: Handles file parsing and preview
- **Field Mapper**: Maps external columns to internal fields
- **Validator**: Validates data before import
- **Error Reporter**: Generates detailed error reports

### 2. **Integration System**
- **Configuration Manager**: Stores integration settings
- **Sync Engine**: Fetches and processes external data
- **Authentication Handler**: Supports multiple auth methods
- **Field Mapper**: Maps external fields to internal schema
- **Conflict Resolver**: Handles duplicates and conflicts

### 3. **Field Configuration System**
- **Field Registry**: Stores custom field definitions
- **Validator**: Applies validation rules
- **Form Generator**: Dynamically generates forms
- **Dependency Engine**: Handles conditional fields

### 4. **Asset Services**
- **CRUD Operations**: Create, Read, Update, Delete
- **Search & Filter**: Global search across all types
- **Dependency Management**: Track relationships
- **Audit Logging**: Track all changes

### 5. **Analytics & Reporting**
- **Dashboard Service**: Aggregates statistics
- **Compliance Tracking**: Monitor compliance coverage
- **Security Status**: Track security test results
- **Ownership Management**: Track asset ownership











