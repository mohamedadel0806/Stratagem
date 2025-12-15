`

#### Endpoints

##### GET /api/compliance/frameworks
Get available compliance frameworks

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "nca",
      "name": "National Cybersecurity Authority",
      "country": "Saudi Arabia",
      "description": "Saudi Arabia's cybersecurity framework",
      "requirementsCount": 156,
      "lastUpdated": "2024-01-01T00:00:00Z"
    },
    {
      "id": "sama",
      "name": "Saudi Arabian Monetary Authority",
      "country": "Saudi Arabia",
      "description": "Financial sector compliance framework",
      "requirementsCount": 89,
      "lastUpdated": "2024-01-01T00:00:00Z"
    },
    {
      "id": "adgm",
      "name": "Abu Dhabi Global Market",
      "country": "UAE",
      "description": "ADGM compliance framework",
      "requirementsCount": 124,
      "lastUpdated": "2024-01-01T00:00:00Z"
    }
  ]
}
```

##### GET /api/compliance/requirements
Get compliance requirements

**Query Parameters:**
- `framework`: Filter by framework
- `category`: Filter by category
- `status`: Filter by status
- `page`: Page number
- `limit`: Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requirements": [
      {
        "id": "req-uuid",
        "code": "NCA-001",
        "title": "Access Control",
        "description": "Implement proper access control mechanisms",
        "framework": "NCA",
        "category": "security",
        "priority": "high",
        "status": "active",
        "linkedControls": [
          {
            "id": "control-uuid",
            "title": "User Access Management",
            "effectiveness": 85
          }
        ],
        "aiAnalysis": {
          "complianceGap": 15,
          "recommendations": ["Implement MFA", "Review access logs"]
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

##### GET /api/compliance/status
Get organization compliance status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overallCompliance": 78.5,
    "frameworks": [
      {
        "name": "NCA",
        "compliancePercentage": 82,
        "requirementsMet": 128,
        "totalRequirements": 156,
        "trend": "improving"
      },
      {
        "name": "SAMA",
        "compliancePercentage": 75,
        "requirementsMet": 67,
        "totalRequirements": 89,
        "trend": "stable"
      }
    ],
    "categories": [
      {
        "name": "Access Control",
        "compliancePercentage": 90,
        "requirementsMet": 18,
        "totalRequirements": 20
      },
      {
        "name": "Data Protection",
        "compliancePercentage": 70,
        "requirementsMet": 14,
        "totalRequirements": 20
      }
    ],
    "lastAssessment": "2024-01-15T00:00:00Z",
    "nextAssessment": "2024-04-15T00:00:00Z"
  }
}
```

##### GET /api/compliance/reports
Get compliance reports

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "report-uuid",
      "title": "Q1 2024 Compliance Report",
      "framework": "NCA",
      "status": "completed",
      "complianceScore": 78.5,
      "generatedAt": "2024-01-15T00:00:00Z",
      "generatedBy": {
        "id": "user-uuid",
        "name": "John Doe"
      },
      "fileUrl": "/api/compliance/reports/report-uuid/download"
    }
  ]
}
```

##### POST /api/compliance/reports
Generate compliance report

**Request Body:**
```json
{
  "title": "Q2 2024 Compliance Report",
  "framework": "NCA",
  "includeRecommendations": true,
  "format": "pdf"
}
```

## AI Service API

### Base Path: `/api/ai`

#### Endpoints

##### POST /api/ai/analyze/document
Analyze document with AI

**Request Body:**
```json
{
  "document": {
    "title": "Security Policy",
    "content": "Document content...",
    "type": "policy",
    "framework": "NCA"
  },
  "analysisType": ["compliance", "risk_assessment", "recommendations"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "compliance": {
        "score": 85,
        "gaps": [
          {
            "requirement": "NCA-001",
            "description": "Missing MFA implementation",
            "severity": "medium"
          }
        ]
      },
      "riskAssessment": {
        "identifiedRisks": [
          {
            "title": "Insufficient Access Control",
            "likelihood": 3,
            "impact": 4,
            "recommendation": "Implement MFA"
          }
        ]
      },
      "recommendations": [
        {
          "action": "Implement multi-factor authentication",
          "priority": "high",
          "estimatedImpact": "Reduce risk by 40%"
        }
      ]
    },
    "confidence": 0.85,
    "processingTime": 2.3
  }
}
```

##### POST /api/ai/predict/risk
Predict risk using ML models

**Request Body:**
```json
{
  "riskFactors": [
    {
      "factor": "outdated_systems",
      "value": 0.7
    },
    {
      "factor": "lack_of_mfa",
      "value": 0.8
    }
  ],
  "context": {
    "industry": "financial_services",
    "size": "medium",
    "region": "saudi_arabia"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "prediction": {
      "probability": 0.65,
      "confidence": 0.78,
      "riskLevel": "medium",
      "timeframe": "6_months",
      "factors": [
        {
          "factor": "outdated_systems",
          "weight": 0.4,
          "contribution": 0.26
        },
        {
          "factor": "lack_of_mfa",
          "weight": 0.3,
          "contribution": 0.24
        }
      ]
    },
    "mitigation": {
      "recommendations": [
        {
          "action": "Update systems",
          "priority": "high",
          "riskReduction": 0.3
        }
      ]
    }
  }
}
```

##### POST /api/ai/generate/policy
Generate policy draft using LLM

**Request Body:**
```json
{
  "requirements": [
    "Implement access control",
    "Ensure data protection",
    "Comply with NCA framework"
  ],
  "context": {
    "organization": "Bank",
    "industry": "Financial Services",
    "country": "Saudi Arabia"
  },
  "language": "en"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "policyDraft": {
      "title": "Information Security Policy",
      "content": "Generated policy content...",
      "sections": [
        {
          "title": "Access Control",
          "content": "Section content..."
        }
      ]
    },
    "metadata": {
      "model": "gpt-4",
      "tokensUsed": 1250,
      "processingTime": 3.2
    }
  }
}
```

##### POST /api/ai/search/compliance
Search compliance knowledge base

**Request Body:**
```json
{
  "query": "access control requirements for banks",
  "framework": "NCA",
  "language": "en"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "requirement": {
          "id": "req-uuid",
          "code": "NCA-001",
          "title": "Access Control",
          "description": "Implement proper access control...",
          "relevanceScore": 0.95
        },
        "relatedPolicies": [
          {
            "id": "policy-uuid",
            "title": "Access Control Policy",
            "similarity": 0.87
          }
        ]
      }
    ],
    "totalResults": 15,
    "searchTime": 0.8
  }
}
```

## Dashboard API

### Base Path: `/api/dashboard`

#### Endpoints

##### GET /api/dashboard/overview
Get dashboard overview data

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPolicies": 45,
      "activeRisks": 23,
      "complianceScore": 78.5,
      "pendingTasks": 12
    },
    "widgets": {
      "riskHeatmap": {
        "data": [
          {
            "category": "cybersecurity",
            "likelihood": 3,
            "impact": 4,
            "count": 5
          }
        ]
      },
      "complianceStatus": {
        "frameworks": [
          {
            "name": "NCA",
            "percentage": 82,
            "trend": "up"
          }
        ]
      },
      "recentActivities": [
        {
          "id": "activity-uuid",
          "type": "policy_updated",
          "description": "Security Policy updated",
          "user": "John Doe",
          "timestamp": "2024-01-01T00:00:00Z"
        }
      ],
      "tasks": [
        {
          "id": "task-uuid",
          "title": "Review Access Control Policy",
          "dueDate": "2024-01-15T00:00:00Z",
          "priority": "high",
          "status": "pending"
        }
      ]
    }
  }
}
```

##### GET /api/dashboard/widgets/{widgetType}
Get specific widget data

**Response (200):**
```json
{
  "success": true,
  "data": {
    "widgetType": "risk_heatmap",
    "data": [
      {
        "category": "cybersecurity",
        "likelihood": 3,
        "impact": 4,
        "count": 5,
        "risks": ["risk-uuid-1", "risk-uuid-2"]
      }
    ],
    "metadata": {
      "lastUpdated": "2024-01-01T00:00:00Z",
      "refreshInterval": 3600
    }
  }
}
```

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req-uuid"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Internal server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

## Rate Limiting

### Default Limits
- **Authenticated users**: 1000 requests/hour
- **Unauthenticated users**: 100 requests/hour
- **AI endpoints**: 50 requests/hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Webhook Configuration

##### POST /api/webhooks
Create webhook subscription

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["risk.created", "policy.updated", "compliance.assessment_completed"],
  "secret": "webhook-secret",
  "active": true
}
```

##### Webhook Payload Format
```json
{
  "event": "risk.created",
  "data": {
    "risk": {
      "id": "risk-uuid",
      "title": "New Risk",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "signature": "sha256=signature"
}
```

## API Versioning

### Version Strategy
- URL path versioning: `/api/v1/users`
- Header versioning: `Accept: application/vnd.api+json;version=1`
- Default version: v1

### Version Support
- **v1**: Current stable version
- **v2**: Beta features (opt-in)
- **Deprecation**: 6 months notice before removal

## Security Considerations

### Authentication
- JWT tokens with RS256 signing
- Short-lived access tokens (1 hour)
- Refresh tokens (30 days)
- Token rotation on refresh

### Authorization
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Resource-level permissions
- API key authentication for services

### Data Protection
- Encryption in transit (TLS 1.3)
- Encryption at rest (AES-256)
- PII data masking
- Audit logging for all actions

### Request Validation
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

This comprehensive API specification provides the foundation for implementing the Modern AI-Powered GRC Platform with all necessary endpoints, security measures, and best practices.