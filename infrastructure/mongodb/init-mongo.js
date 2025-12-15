// Switch to admin database and create admin user
db = db.getSiblingDB('admin');

// Create admin user if not exists
if (!db.getUser('admin')) {
    db.createUser({
        user: 'admin',
        pwd: 'password',
        roles: [
            {
                role: 'userAdminAnyDatabase',
                db: 'admin'
            },
            {
                role: 'readWriteAnyDatabase',
                db: 'admin'
            }
        ]
    });
}

// Switch to application database
db = db.getSiblingDB('grc_documents');

// Create collections with validation
db.createCollection('policies', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'content', 'status'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                content: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                status: {
                    enum: ['draft', 'approved', 'published', 'archived'],
                    description: 'must be one of the enum values'
                },
                framework: {
                    bsonType: 'string',
                    description: 'compliance framework'
                },
                language: {
                    enum: ['en', 'ar'],
                    description: 'document language'
                }
            }
        }
    }
});

db.createCollection('compliance_reports', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'organization_id', 'framework'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                organization_id: {
                    bsonType: 'string',
                    description: 'organization identifier'
                },
                framework: {
                    bsonType: 'string',
                    description: 'compliance framework'
                }
            }
        }
    }
});

// Create indexes
db.policies.createIndex({ 'title': 'text', 'content': 'text' });
db.policies.createIndex({ 'framework': 1 });
db.policies.createIndex({ 'status': 1 });
db.policies.createIndex({ 'language': 1 });

db.compliance_reports.createIndex({ 'organization_id': 1 });
db.compliance_reports.createIndex({ 'framework': 1 });
db.compliance_reports.createIndex({ 'created_at': -1 });