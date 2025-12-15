// Create constraints for uniqueness
CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (o:Organization) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (p:Policy) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (r:Risk) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Control) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (req:Requirement) REQUIRE req.id IS UNIQUE;

// Create indexes for performance
CREATE INDEX IF NOT EXISTS FOR (u:User) ON (u.email);
CREATE INDEX IF NOT EXISTS FOR (o:Organization) ON (o.name);
CREATE INDEX IF NOT EXISTS FOR (p:Policy) ON (p.title);
CREATE INDEX IF NOT EXISTS FOR (r:Risk) ON (r.title);
CREATE INDEX IF NOT EXISTS FOR (c:Control) ON (c.title);
CREATE INDEX IF NOT EXISTS FOR (req:Requirement) ON (req.framework);

// Sample data for development
// Create sample organization
MERGE (org:Organization {id: 'org-1', name: 'Sample Bank', country: 'Saudi Arabia', industry: 'Financial Services'});

// Create sample compliance frameworks
MERGE (nca:Framework {name: 'NCA', description: 'National Cybersecurity Authority'});
MERGE (sama:Framework {name: 'SAMA', description: 'Saudi Arabian Monetary Authority'});
MERGE (adgm:Framework {name: 'ADGM', description: 'Abu Dhabi Global Market'});

// Create sample requirements
MERGE (req1:Requirement {id: 'req-1', code: 'NCA-001', title: 'Access Control', framework: 'NCA'});
MERGE (req2:Requirement {id: 'req-2', code: 'SAMA-001', title: 'Risk Assessment', framework: 'SAMA'});

// Create sample controls
MERGE (ctrl1:Control {id: 'ctrl-1', title: 'User Access Management', type: 'Technical'});
MERGE (ctrl2:Control {id: 'ctrl-2', title: 'Risk Assessment Process', type: 'Procedural'});

// Create relationships
MERGE (req1)-[:SATISFIED_BY]->(ctrl1);
MERGE (req2)-[:SATISFIED_BY]->(ctrl2);
MERGE (org)-[:COMPLIES_WITH]->(nca);
MERGE (org)-[:COMPLIES_WITH]->(sama);