# Governance Module - API Specification

**API Version**: v1  
**Base URL**: `/api/v1/governance`  
**Documentation Format**: OpenAPI 3.0  
**Authentication**: JWT Bearer Token (shared with Asset Management)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Influencers API](#influencers-api)
3. [Policies API](#policies-api)
4. [Controls API](#controls-api)
5. [Assessments API](#assessments-api)
6. [Evidence API](#evidence-api)
7. [SOPs API](#sops-api)
8. [Reporting API](#reporting-api)
9. [Integration Endpoints](#integration-endpoints)

---

## Authentication

All endpoints require authentication via JWT Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**Shared with Asset Management**: Uses the same authentication mechanism.

---

## Common Response Formats

### Success Response
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 100,
    "totalPages": 4
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### Pagination
All list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 25, max: 100)
- `sort`: Sort field and direction (e.g., `name:asc`, `created_at:desc`)
- `filter`: Filter criteria (JSON object)

---

## Influencers API

### List Influencers

**GET** `/api/v1/governance/influencers`

**Query Parameters**:
- `page` (integer, optional): Page number
- `limit` (integer, optional): Items per page
- `category` (string, optional): Filter by category (internal, contractual, statutory, regulatory, industry_standard)
- `status` (string, optional): Filter by status (active, pending, superseded, retired)
- `applicability_status` (string, optional): Filter by applicability (applicable, not_applicable, under_review)
- `search` (string, optional): Full-text search
- `sort` (string, optional): Sort field and direction

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "NCA ECC",
      "category": "regulatory",
      "sub_category": "Cybersecurity",
      "issuing_authority": "National Cybersecurity Authority",
      "jurisdiction": "Saudi Arabia",
      "reference_number": "NCA-ECC-2023",
      "status": "active",
      "applicability_status": "applicable",
      "effective_date": "2023-01-01",
      "next_review_date": "2024-01-01",
      "owner": {
        "id": "uuid",
        "name": "John Doe"
      },
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 50,
    "totalPages": 2
  }
}
```

### Get Influencer

**GET** `/api/v1/governance/influencers/:id`

**Response**:
```json
{
  "data": {
    "id": "uuid",
    "name": "NCA ECC",
    "category": "regulatory",
    "description": "Essential Cybersecurity Controls",
    "issuing_authority": "National Cybersecurity Authority",
    "jurisdiction": "Saudi Arabia",
    "reference_number": "NCA-ECC-2023",
    "publication_date": "2023-01-01",
    "effective_date": "2023-01-01",
    "status": "active",
    "applicability_status": "applicable",
    "applicability_justification": "Organization operates in Saudi Arabia",
    "source_url": "https://nca.gov.sa/...",
    "tags": ["cybersecurity", "saudi-arabia"],
    "business_units_affected": ["uuid1", "uuid2"],
    "owner": { ... },
    "linked_policies": [
      {
        "id": "uuid",
        "title": "Information Security Policy",
        "version": "2.0"
      }
    ],
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

### Create Influencer

**POST** `/api/v1/governance/influencers`

**Request Body**:
```json
{
  "name": "NCA ECC",
  "category": "regulatory",
  "sub_category": "Cybersecurity",
  "issuing_authority": "National Cybersecurity Authority",
  "jurisdiction": "Saudi Arabia",
  "reference_number": "NCA-ECC-2023",
  "description": "Essential Cybersecurity Controls",
  "publication_date": "2023-01-01",
  "effective_date": "2023-01-01",
  "status": "active",
  "applicability_status": "under_review",
  "source_url": "https://nca.gov.sa/...",
  "tags": ["cybersecurity", "saudi-arabia"],
  "business_units_affected": ["uuid1", "uuid2"],
  "owner_id": "uuid"
}
```

**Response**: 201 Created with influencer object

### Update Influencer

**PUT** `/api/v1/governance/influencers/:id`

**Request Body**: Same as create (all fields optional)

**Response**: 200 OK with updated influencer object

### Delete Influencer

**DELETE** `/api/v1/governance/influencers/:id`

**Response**: 204 No Content

### Import Influencers

**POST** `/api/v1/governance/influencers/import`

**Request**: Multipart form data
- `file`: CSV or Excel file
- `mapping`: JSON object with field mappings (optional)

**Response**:
```json
{
  "data": {
    "import_id": "uuid",
    "total_records": 100,
    "successful": 95,
    "failed": 5,
    "errors": [
      {
        "row": 10,
        "field": "reference_number",
        "error": "Duplicate reference number"
      }
    ]
  }
}
```

### Export Influencers

**GET** `/api/v1/governance/influencers/export`

**Query Parameters**: Same as list endpoint

**Response**: CSV or Excel file download

---

## Policies API

### List Policies

**GET** `/api/v1/governance/policies`

**Query Parameters**:
- `page`, `limit`, `sort`, `filter`
- `status` (draft, in_review, approved, published, archived)
- `policy_type` (string)
- `owner_id` (uuid)
- `search` (string)

**Response**: Array of policy objects with pagination

### Get Policy

**GET** `/api/v1/governance/policies/:id`

**Response**:
```json
{
  "data": {
    "id": "uuid",
    "policy_type": "Information Security",
    "title": "Information Security Policy",
    "version": "2.0",
    "version_number": 2,
    "content": "<html>...</html>",
    "purpose": "Define information security requirements",
    "scope": "All employees and systems",
    "status": "published",
    "owner": { ... },
    "business_units": ["uuid1", "uuid2"],
    "linked_influencers": [
      {
        "id": "uuid",
        "name": "NCA ECC"
      }
    ],
    "control_objectives": [
      {
        "id": "uuid",
        "objective_identifier": "CO-IAM-001",
        "statement": "The organization shall implement multi-factor authentication...",
        "implementation_status": "implemented"
      }
    ],
    "approval_date": "2023-01-01",
    "effective_date": "2023-01-01",
    "published_date": "2023-01-15",
    "next_review_date": "2024-01-01",
    "acknowledgment_stats": {
      "total_assigned": 100,
      "acknowledged": 85,
      "pending": 15,
      "percentage": 85
    },
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

### Create Policy

**POST** `/api/v1/governance/policies`

**Request Body**:
```json
{
  "policy_type": "Information Security",
  "title": "Information Security Policy",
  "content": "<html>...</html>",
  "purpose": "Define information security requirements",
  "scope": "All employees and systems",
  "owner_id": "uuid",
  "business_units": ["uuid1", "uuid2"],
  "linked_influencers": ["uuid1", "uuid2"],
  "review_frequency": "annual",
  "requires_acknowledgment": true,
  "acknowledgment_due_days": 30
}
```

**Response**: 201 Created with policy object

### Update Policy

**PUT** `/api/v1/governance/policies/:id`

**Request Body**: Same as create (all fields optional)

**Response**: 200 OK with updated policy object

### Submit Policy for Approval

**POST** `/api/v1/governance/policies/:id/submit`

**Request Body**:
```json
{
  "workflow_id": "uuid",
  "comments": "Ready for review"
}
```

**Response**: 200 OK with updated policy status

### Approve Policy

**POST** `/api/v1/governance/policies/:id/approve`

**Request Body**:
```json
{
  "comments": "Approved",
  "digital_signature": "base64_encoded_signature"
}
```

**Response**: 200 OK with approved policy

### Publish Policy

**POST** `/api/v1/governance/policies/:id/publish`

**Request Body**:
```json
{
  "assign_to": {
    "users": ["uuid1", "uuid2"],
    "roles": ["uuid1"],
    "business_units": ["uuid1"]
  },
  "notification_message": "New policy published"
}
```

**Response**: 200 OK with published policy

### Acknowledge Policy

**POST** `/api/v1/governance/policies/:id/acknowledge`

**Response**: 200 OK
```json
{
  "data": {
    "acknowledged_at": "2023-01-01T00:00:00Z",
    "policy_version": "2.0"
  }
}
```

### Get Policy Versions

**GET** `/api/v1/governance/policies/:id/versions`

**Response**: Array of policy versions

### Compare Policy Versions

**GET** `/api/v1/governance/policies/:id/compare?version1=1.0&version2=2.0`

**Response**: Diff object showing changes

---

## Controls API

### List Controls

**GET** `/api/v1/governance/controls`

**Query Parameters**:
- `page`, `limit`, `sort`, `filter`
- `domain` (string): Filter by control domain
- `implementation_status` (not_implemented, planned, in_progress, implemented, not_applicable)
- `priority` (critical, high, medium, low)
- `framework_id` (uuid): Filter by framework
- `search` (string)

**Response**: Array of control objects with pagination

### Get Control

**GET** `/api/v1/governance/controls/:id`

**Response**:
```json
{
  "data": {
    "id": "uuid",
    "control_identifier": "UCL-IAM-002",
    "title": "Multi-Factor Authentication",
    "control_domain": "Access Control & Identity Management",
    "control_family": "Authentication",
    "control_type": "preventive",
    "description": "Implement MFA for all privileged accounts",
    "implementation_guidance": "Use TOTP or hardware tokens...",
    "priority": "critical",
    "risk_level": "high",
    "implementation_status": "implemented",
    "implementation_percentage": 100,
    "owner": { ... },
    "framework_mappings": [
      {
        "framework": {
          "id": "uuid",
          "name": "NCA ECC",
          "code": "NCA_ECC"
        },
        "requirement": {
          "id": "uuid",
          "requirement_identifier": "5-1-2",
          "requirement_text": "Implement strong authentication"
        },
        "coverage_level": "full"
      }
    ],
    "linked_assets": [
      {
        "asset_type": "physical_asset",
        "asset_id": "uuid",
        "asset_name": "Server-001",
        "implementation_status": "implemented",
        "last_test_date": "2023-12-01",
        "last_test_result": "pass"
      }
    ],
    "linked_control_objectives": [
      {
        "id": "uuid",
        "objective_identifier": "CO-IAM-001",
        "statement": "...",
        "policy": {
          "id": "uuid",
          "title": "Access Control Policy"
        }
      }
    ],
    "assessments": [
      {
        "id": "uuid",
        "assessment_date": "2023-12-01",
        "result": "compliant",
        "effectiveness_rating": 5
      }
    ],
    "evidence": [
      {
        "id": "uuid",
        "title": "MFA Configuration Screenshot",
        "evidence_type": "configuration_screenshot",
        "collection_date": "2023-12-01",
        "status": "approved"
      }
    ],
    "tests": [
      {
        "id": "uuid",
        "test_frequency": "quarterly",
        "last_test_date": "2023-12-01",
        "latest_result": "pass"
      }
    ],
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

### Create Control

**POST** `/api/v1/governance/controls`

**Request Body**:
```json
{
  "title": "Multi-Factor Authentication",
  "control_domain": "Access Control & Identity Management",
  "control_family": "Authentication",
  "control_type": "preventive",
  "description": "Implement MFA for all privileged accounts",
  "implementation_guidance": "Use TOTP or hardware tokens...",
  "priority": "critical",
  "risk_level": "high",
  "implementation_complexity": "medium",
  "cost_impact": "medium",
  "owner_id": "uuid",
  "target_implementation_date": "2024-01-01"
}
```

**Response**: 201 Created with control object

### Update Control

**PUT** `/api/v1/governance/controls/:id`

**Request Body**: Same as create (all fields optional)

**Response**: 200 OK with updated control object

### Map Control to Framework

**POST** `/api/v1/governance/controls/:id/framework-mappings`

**Request Body**:
```json
{
  "framework_requirement_id": "uuid",
  "coverage_level": "full",
  "mapping_notes": "Fully satisfies requirement 5-1-2"
}
```

**Response**: 201 Created with mapping object

### Link Control to Assets

**POST** `/api/v1/governance/controls/:id/assets`

**Request Body**:
```json
{
  "assets": [
    {
      "asset_type": "physical_asset",
      "asset_id": "uuid",
      "implementation_date": "2023-12-01",
      "implementation_notes": "MFA enabled on all admin accounts"
    }
  ]
}
```

**Response**: 201 Created with asset mappings

### Import Controls

**POST** `/api/v1/governance/controls/import`

**Request**: Multipart form data with CSV/Excel file

**Response**: Import results

---

## Assessments API

### List Assessments

**GET** `/api/v1/governance/assessments`

**Query Parameters**:
- `page`, `limit`, `sort`, `filter`
- `status` (not_started, in_progress, under_review, completed, cancelled)
- `assessment_type` (implementation, design_effectiveness, operating_effectiveness, compliance)
- `lead_assessor_id` (uuid)

**Response**: Array of assessment objects

### Get Assessment

**GET** `/api/v1/governance/assessments/:id`

**Response**:
```json
{
  "data": {
    "id": "uuid",
    "assessment_identifier": "ASSESS-2024-001",
    "name": "Q4 2024 Control Assessment",
    "description": "Quarterly control effectiveness assessment",
    "assessment_type": "operating_effectiveness",
    "status": "in_progress",
    "start_date": "2024-01-01",
    "end_date": "2024-03-31",
    "lead_assessor": { ... },
    "assessors": [ ... ],
    "selected_controls": [
      {
        "id": "uuid",
        "control_identifier": "UCL-IAM-002",
        "title": "Multi-Factor Authentication"
      }
    ],
    "controls_assessed": 25,
    "controls_total": 50,
    "findings_critical": 2,
    "findings_high": 5,
    "findings_medium": 10,
    "findings_low": 3,
    "overall_score": 85.5,
    "results": [
      {
        "control_id": "uuid",
        "result": "compliant",
        "effectiveness_rating": 5,
        "findings": []
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Create Assessment

**POST** `/api/v1/governance/assessments`

**Request Body**:
```json
{
  "name": "Q4 2024 Control Assessment",
  "description": "Quarterly control effectiveness assessment",
  "assessment_type": "operating_effectiveness",
  "start_date": "2024-01-01",
  "end_date": "2024-03-31",
  "lead_assessor_id": "uuid",
  "assessor_ids": ["uuid1", "uuid2"],
  "selected_control_ids": ["uuid1", "uuid2"],
  "selected_framework_ids": ["uuid1"],
  "assessment_procedures": "Follow standard assessment procedures..."
}
```

**Response**: 201 Created with assessment object

### Record Assessment Result

**POST** `/api/v1/governance/assessments/:id/results`

**Request Body**:
```json
{
  "unified_control_id": "uuid",
  "result": "compliant",
  "effectiveness_rating": 5,
  "findings": "No issues found",
  "observations": "Control operating effectively",
  "recommendations": "Continue current implementation",
  "evidence_collected": [
    {
      "filename": "config_screenshot.png",
      "description": "MFA configuration"
    }
  ],
  "requires_remediation": false
}
```

**Response**: 201 Created with result object

### Complete Assessment

**POST** `/api/v1/governance/assessments/:id/complete`

**Response**: 200 OK with completed assessment

---

## Evidence API

### List Evidence

**GET** `/api/v1/governance/evidence`

**Query Parameters**:
- `page`, `limit`, `sort`, `filter`
- `evidence_type` (policy_document, configuration_screenshot, etc.)
- `status` (draft, under_review, approved, expired, rejected)
- `control_id` (uuid): Filter by linked control
- `asset_id` (uuid): Filter by linked asset

**Response**: Array of evidence objects

### Get Evidence

**GET** `/api/v1/governance/evidence/:id`

**Response**: Evidence object with file download URL

### Upload Evidence

**POST** `/api/v1/governance/evidence`

**Request**: Multipart form data
- `file`: File to upload
- `title`: Evidence title
- `description`: Description
- `evidence_type`: Type enum
- `collection_date`: Date
- `valid_until_date`: Date (optional)
- `linked_entity_type`: control, assessment, finding, asset, policy, standard
- `linked_entity_id`: UUID

**Response**: 201 Created with evidence object

### Link Evidence

**POST** `/api/v1/governance/evidence/:id/link`

**Request Body**:
```json
{
  "link_type": "control",
  "linked_entity_id": "uuid",
  "link_description": "Evidence for MFA control"
}
```

**Response**: 200 OK

### Approve Evidence

**POST** `/api/v1/governance/evidence/:id/approve`

**Response**: 200 OK with approved evidence

### Download Evidence

**GET** `/api/v1/governance/evidence/:id/download`

**Response**: File download

---

## SOPs API

### List SOPs

**GET** `/api/v1/governance/sops`

**Query Parameters**:
- `page`, `limit`, `sort`, `filter`
- `category` (operational, security, compliance, etc.)
- `status` (draft, in_review, approved, published, archived)

**Response**: Array of SOP objects

### Get SOP

**GET** `/api/v1/governance/sops/:id`

**Response**: SOP object with full content

### Create SOP

**POST** `/api/v1/governance/sops`

**Request Body**:
```json
{
  "title": "User Provisioning Procedure",
  "category": "operational",
  "purpose": "Standardize user account creation",
  "scope": "All IT staff",
  "procedure_steps": "<html>...</html>",
  "linked_policy_ids": ["uuid1"],
  "linked_control_ids": ["uuid1"],
  "owner_id": "uuid"
}
```

**Response**: 201 Created with SOP object

### Log SOP Execution

**POST** `/api/v1/governance/sops/:id/executions`

**Request Body**:
```json
{
  "outcome": "successful",
  "execution_start": "2024-01-01T10:00:00Z",
  "execution_end": "2024-01-01T10:30:00Z",
  "deviations_from_procedure": null,
  "quality_checks_passed": true,
  "execution_notes": "Completed successfully",
  "related_asset_type": "physical_asset",
  "related_asset_id": "uuid"
}
```

**Response**: 201 Created with execution record

### Acknowledge SOP

**POST** `/api/v1/governance/sops/:id/acknowledge`

**Response**: 200 OK

---

## Reporting API

### Get Dashboard Data

**GET** `/api/v1/governance/dashboard`

**Query Parameters**:
- `date_range`: Date range for metrics (optional)

**Response**:
```json
{
  "data": {
    "summary": {
      "total_influencers": 50,
      "active_influencers": 45,
      "total_policies": 25,
      "published_policies": 20,
      "total_controls": 500,
      "implemented_controls": 450,
      "implementation_rate": 90,
      "total_assessments": 10,
      "completed_assessments": 8
    },
    "charts": {
      "controls_by_domain": [
        { "domain": "IAM", "count": 50 },
        { "domain": "Network Security", "count": 45 }
      ],
      "implementation_status": {
        "implemented": 450,
        "in_progress": 30,
        "planned": 20
      },
      "framework_compliance": [
        {
          "framework": "NCA ECC",
          "compliance_percentage": 92.5
        }
      ]
    },
    "recent_activities": [ ... ],
    "upcoming_items": [
      {
        "type": "policy_review",
        "item": { ... },
        "due_date": "2024-01-15"
      }
    ]
  }
}
```

### Get Framework Compliance Scorecard

**GET** `/api/v1/governance/reports/framework-compliance`

**Query Parameters**:
- `framework_ids`: Comma-separated framework UUIDs
- `date_range`: Date range (optional)

**Response**: Framework compliance scorecard data

### Get Gap Analysis

**GET** `/api/v1/governance/reports/gap-analysis`

**Query Parameters**:
- `framework_ids`: Comma-separated framework UUIDs
- `gap_type`: framework, control, asset, evidence, assessment

**Response**: Gap analysis report

### Generate Audit Package

**POST** `/api/v1/governance/reports/audit-package`

**Request Body**:
```json
{
  "framework_ids": ["uuid1", "uuid2"],
  "include_evidence": true,
  "include_assessments": true,
  "format": "zip"
}
```

**Response**: File download (ZIP) with audit package

### Export Report

**GET** `/api/v1/governance/reports/export`

**Query Parameters**:
- `report_type`: policy, control, assessment, compliance
- `format`: pdf, excel, csv
- `filters`: JSON object with filter criteria

**Response**: File download

---

## Integration Endpoints

### Get Asset Compliance Status

**GET** `/api/v1/governance/assets/:type/:id/compliance`

**Path Parameters**:
- `type`: asset type (physical_asset, information_asset, application, software, supplier)
- `id`: asset UUID

**Response**:
```json
{
  "data": {
    "asset_type": "physical_asset",
    "asset_id": "uuid",
    "total_controls_assigned": 25,
    "controls_implemented": 23,
    "controls_pending": 2,
    "controls_passed_test": 20,
    "controls_failed_test": 3,
    "compliance_percentage": 92.0,
    "compliance_status": "compliant",
    "controls": [
      {
        "control_id": "uuid",
        "control_identifier": "UCL-IAM-002",
        "title": "Multi-Factor Authentication",
        "implementation_status": "implemented",
        "last_test_date": "2023-12-01",
        "last_test_result": "pass"
      }
    ],
    "missing_controls": [
      {
        "control_id": "uuid",
        "control_identifier": "UCL-NET-001",
        "title": "Network Segmentation",
        "priority": "critical"
      }
    ]
  }
}
```

### Get Controls for Asset

**GET** `/api/v1/governance/assets/:type/:id/controls`

**Response**: Array of controls linked to asset

### Link Controls to Asset (Bulk)

**POST** `/api/v1/governance/assets/:type/:id/controls`

**Request Body**:
```json
{
  "control_ids": ["uuid1", "uuid2", "uuid3"],
  "implementation_date": "2024-01-01",
  "implementation_notes": "Bulk assignment"
}
```

**Response**: 201 Created with mappings

### Get Assets for Control

**GET** `/api/v1/governance/controls/:id/assets`

**Response**: Array of assets linked to control

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `GOV_NOT_FOUND` | 404 | Resource not found |
| `GOV_UNAUTHORIZED` | 401 | Authentication required |
| `GOV_FORBIDDEN` | 403 | Insufficient permissions |
| `GOV_VALIDATION_ERROR` | 400 | Validation failed |
| `GOV_DUPLICATE` | 409 | Duplicate resource |
| `GOV_CONFLICT` | 409 | Business rule conflict |
| `GOV_INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Standard endpoints**: 100 requests per minute per user
- **Export endpoints**: 10 requests per minute per user
- **Import endpoints**: 5 requests per minute per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

---

## Webhooks (Future)

Webhooks will be available for:
- Policy published
- Assessment completed
- Finding created
- Control status changed
- Evidence expired

---

**API Version**: 1.0  
**Last Updated**: December 2024  
**OpenAPI Spec**: Available at `/api/v1/governance/swagger.json`







