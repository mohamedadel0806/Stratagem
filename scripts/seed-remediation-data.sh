#!/bin/bash

# Seed remediation tracking data for testing

DB_NAME="grc_platform"
DB_USER="postgres"
DB_HOST="127.0.0.1"
DB_PORT="5432"

# Get finding IDs
FINDING_IDS=$(docker exec -i stratagem-postgres-1 psql -U $DB_USER -d $DB_NAME -t -c "SELECT id FROM findings LIMIT 5;" 2>/dev/null)

# Convert to array
IDS_ARRAY=($FINDING_IDS)

if [ ${#IDS_ARRAY[@]} -eq 0 ]; then
  echo "No findings found in database"
  exit 1
fi

echo "Found ${#IDS_ARRAY[@]} findings. Creating remediation trackers..."

# Counter for creating diverse test data
COUNTER=0

for FINDING_ID in "${IDS_ARRAY[@]}"; do
  FINDING_ID=$(echo "$FINDING_ID" | xargs)  # Trim whitespace
  
  if [ -z "$FINDING_ID" ]; then
    continue
  fi
  
  # Vary the priority based on counter
  case $((COUNTER % 4)) in
    0) PRIORITY='critical' ;;
    1) PRIORITY='high' ;;
    2) PRIORITY='medium' ;;
    *) PRIORITY='low' ;;
  esac
  
  # Vary the days until due
  DAYS_OFFSET=$((5 + COUNTER * 3))
  SLA_DUE_DATE=$(date -u -v+${DAYS_OFFSET}d +%Y-%m-%d)
  CREATED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  PROGRESS=$((COUNTER * 20))
  
  # Insert remediation tracker
  docker exec -i stratagem-postgres-1 psql -U $DB_USER -d $DB_NAME -c "
    INSERT INTO remediation_trackers (
      id, finding_id, remediation_priority, sla_due_date, progress_percent,
      completion_date, sla_met, days_to_completion, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      '$FINDING_ID'::uuid,
      '$PRIORITY',
      '$SLA_DUE_DATE'::date,
      $PROGRESS,
      NULL,
      false,
      NULL,
      '$CREATED_AT'::timestamp,
      '$CREATED_AT'::timestamp
    );
  " > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo "✓ Created tracker for finding $((COUNTER + 1)) - Priority: $PRIORITY, Progress: $PROGRESS%, SLA: $SLA_DUE_DATE"
  else
    echo "✗ Failed to create tracker for finding $((COUNTER + 1))"
  fi
  
  COUNTER=$((COUNTER + 1))
done

# Verify data was inserted
TRACKER_COUNT=$(docker exec -i stratagem-postgres-1 psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM remediation_trackers;" 2>/dev/null | xargs)
echo ""
echo "Remediation tracking data seeded successfully!"
echo "Total trackers created: $TRACKER_COUNT"
echo ""
echo "View trackers in dashboard at: http://localhost:3000/en/dashboard/governance"
