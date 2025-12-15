#!/bin/bash

# Seed database script
# This script seeds the database with initial users and data

echo "🌱 Seeding database..."

# Run seed script inside backend container
docker-compose exec backend npm run seed

echo ""
echo "✅ Seeding complete!"
echo ""
echo "You can now login with any of these accounts:"
echo "  - admin@grcplatform.com (Super Admin)"
echo "  - compliance@grcplatform.com (Compliance Officer)"
echo "  - risk@grcplatform.com (Risk Manager)"
echo "  - user@grcplatform.com (Regular User)"
echo ""
echo "Password for all accounts: password123"

