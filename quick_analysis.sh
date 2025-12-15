#!/bin/bash

MOUNT="/Volumes/MacBook_Data"
USER="nikhiljain"
OUTPUT="$HOME/Desktop/Nikhil_Complete_Analysis"

mkdir -p "$OUTPUT"/{databases,apps,browser,timeline,logs}

echo "============================================"
echo "Quick Analysis - Nikhil MacBook"
echo "User: $USER"
echo "============================================"
echo ""

# 1. Downloaded Apps (Quarantine DB)
echo "[1/8] Extracting download history..."
if [ -f "$MOUNT/Users/$USER/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV2" ]; then
    cp "$MOUNT/Users/$USER/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV2" "$OUTPUT/databases/quarantine.db"
    
    sqlite3 "$OUTPUT/databases/quarantine.db" \
    "SELECT 
      datetime(LSQuarantineTimeStamp + 978307200, 'unixepoch') as 'Downloaded',
      LSQuarantineAgentName as 'App',
      LSQuarantineDataURLString as 'URL'
    FROM LSQuarantineEvent 
    ORDER BY LSQuarantineTimeStamp DESC;" > "$OUTPUT/databases/all_downloads.txt"
    
    # Filter for apps/installers
    grep -iE "\.app|\.dmg|\.pkg" "$OUTPUT/databases/all_downloads.txt" > "$OUTPUT/apps/downloaded_apps_installers.txt"
    
    DOWNLOAD_COUNT=$(cat "$OUTPUT/apps/downloaded_apps_installers.txt" | wc -l)
    echo "      ✓ Found $DOWNLOAD_COUNT downloaded apps/installers"
else
    echo "      ✗ Quarantine database not found"
fi

# 2. Application traces
echo "[2/8] Analyzing application traces..."
ls -lt "$MOUNT/Users/$USER/Library/Preferences/" | grep -v "\.DS_Store" > "$OUTPUT/apps/preferences_list.txt"
ls -lt "$MOUNT/Users/$USER/Library/Application Support/" > "$OUTPUT/apps/app_support_list.txt"
ls -lt "$MOUNT/Users/$USER/Library/Containers/" > "$OUTPUT/apps/containers_list.txt"
ls -lt "$MOUNT/Users/$USER/Library/Saved Application State/" > "$OUTPUT/apps/saved_states.txt" 2>/dev/null

PREF_COUNT=$(cat "$OUTPUT/apps/preferences_list.txt" | wc -l)
echo "      ✓ Found $PREF_COUNT preference files"

# 3. Current applications
echo "[3/8] Listing current applications..."
ls -lt "$MOUNT/Applications/" > "$OUTPUT/apps/system_applications.txt"
ls -lt "$MOUNT/Users/$USER/Applications/" > "$OUTPUT/apps/user_applications.txt" 2>/dev/null

# 4. Safari history
echo "[4/8] Extracting Safari history..."
if [ -f "$MOUNT/Users/$USER/Library/Safari/History.db" ]; then
    cp "$MOUNT/Users/$USER/Library/Safari/History.db" "$OUTPUT/browser/Safari_History.db"
    
    sqlite3 "$OUTPUT/browser/Safari_History.db" \
    "SELECT datetime(visit_time + 978307200, 'unixepoch') as Visited, title, url 
    FROM history_visits 
    INNER JOIN history_items ON history_visits.history_item = history_items.id 
    ORDER BY visit_time DESC LIMIT 500;" > "$OUTPUT/browser/safari_history_500.txt"
    
    SAFARI_COUNT=$(cat "$OUTPUT/browser/safari_history_500.txt" | wc -l)
    echo "      ✓ Extracted $SAFARI_COUNT Safari history entries"
fi

# 5. Chrome history
echo "[5/8] Extracting Chrome history..."
if [ -f "$MOUNT/Users/$USER/Library/Application Support/Google/Chrome/Default/History" ]; then
    cp "$MOUNT/Users/$USER/Library/Application Support/Google/Chrome/Default/History" "$OUTPUT/browser/Chrome_History.db"
    
    sqlite3 "$OUTPUT/browser/Chrome_History.db" \
    "SELECT datetime(last_visit_time/1000000-11644473600, 'unixepoch') as Visited, title, url 
    FROM urls 
    ORDER BY last_visit_time DESC LIMIT 500;" > "$OUTPUT/browser/chrome_history_500.txt"
    
    CHROME_COUNT=$(cat "$OUTPUT/browser/chrome_history_500.txt" | wc -l)
    echo "      ✓ Extracted $CHROME_COUNT Chrome history entries"
fi

# 6. Trash contents
echo "[6/8] Checking Trash..."
ls -laR "$MOUNT/.Trashes/" > "$OUTPUT/logs/trash_contents.txt" 2>/dev/null
TRASH_FILES=$(find "$MOUNT/.Trashes/" -type f 2>/dev/null | wc -l)
echo "      Files in Trash: $TRASH_FILES"

# 7. Recent file activity
echo "[7/8] Creating activity timeline..."
find "$MOUNT/Users/$USER" -type f -mtime -90 -ls 2>/dev/null | \
awk '{print $8" "$9" "$10" "$NF}' | \
sort -r > "$OUTPUT/timeline/files_modified_90days.txt"

RECENT_COUNT=$(cat "$OUTPUT/timeline/files_modified_90days.txt" | wc -l)
echo "      ✓ $RECENT_COUNT files modified in last 90 days"

# 8. System logs
echo "[8/8] Extracting system logs..."
if [ -f "$MOUNT/private/var/log/system.log" ]; then
    cp "$MOUNT/private/var/log/system.log" "$OUTPUT/logs/"
    echo "      ✓ System log copied"
fi

# Generate Summary Report
cat > "$OUTPUT/ANALYSIS_REPORT.txt" << EOF
============================================
FORENSIC ANALYSIS REPORT
Nikhil Jain MacBook Data
Analysis Date: $(date)
============================================

USER: $USER
MOUNT: $MOUNT

KEY FINDINGS:
=============

APPLICATIONS:
- Downloaded apps/installers: $DOWNLOAD_COUNT
- Application preference files: $PREF_COUNT
- Files in Trash: $TRASH_FILES

BROWSER ACTIVITY:
- Safari history entries: ${SAFARI_COUNT:-0}
- Chrome history entries: ${CHROME_COUNT:-0}

FILE ACTIVITY:
- Files modified (90 days): $RECENT_COUNT

CRITICAL FILES TO REVIEW:
=========================

1. apps/downloaded_apps_installers.txt
   - Complete list of ALL downloaded apps with timestamps
   - Shows apps even if deleted from system

2. apps/preferences_list.txt
   - Every .plist represents an installed app
   - Check modification dates for last use

3. apps/app_support_list.txt
   - Application data folders
   - Often persist after app deletion

4. apps/containers_list.txt
   - Sandboxed app data
   - Folder names reveal app identities

5. browser/*_history_500.txt
   - Recent web browsing activity
   - Download URLs and timestamps

6. timeline/files_modified_90days.txt
   - Chronological file activity
   - Shows usage patterns

7. logs/trash_contents.txt
   - Current Trash contents

DELETED APPS - HOW TO FIND:
===========================

Method 1: Compare Lists
- Check downloaded_apps_installers.txt for what was downloaded
- Compare with system_applications.txt for what's currently installed
- Missing apps = deleted apps

Method 2: Check Preferences
- Each .plist in preferences_list.txt = installed app
- Recent modification date = recent use
- Look for app bundle IDs (com.company.appname)

Method 3: Application Support Folders
- Folders in app_support_list.txt show installed apps
- Check folder names and modification dates

Method 4: Browser Downloads
- Check browser history for .dmg, .pkg downloads
- URLs show what was downloaded and when

TIMELINE ANALYSIS:
==================

1. Open downloaded_apps_installers.txt - sort by date
2. Open files_modified_90days.txt - look for patterns
3. Cross-reference with browser history
4. Check preference file dates for last app use

NEXT STEPS:
===========

1. Review downloaded_apps_installers.txt for complete download history
2. Check modification dates on preference files
3. Look at app_support and containers folders
4. Analyze browser history for suspicious downloads
5. Create timeline of app installations vs deletions

All data saved to: $OUTPUT
EOF

echo ""
echo "============================================"
echo "ANALYSIS COMPLETE"
echo "============================================"
echo ""
cat "$OUTPUT/ANALYSIS_REPORT.txt"
echo ""
echo "Opening results folder..."
open "$OUTPUT"