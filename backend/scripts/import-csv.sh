#!/bin/bash

# Import script for master_import_final.csv
# Usage: ./import-csv.sh

API_URL="http://localhost:3000/api/v1"

# Get token
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "tharab@sena.co.th", "password": "123456"}' | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

echo "Token obtained: ${TOKEN:0:30}..."

# Read CSV and create projects (unique)
declare -A PROJECTS
declare -A PROJECT_IDS

# Parse CSV - skip header, get unique projects
tail -n +2 /Users/nk-lamy/Desktop/Coding/YTY\ Project/master_import_final.csv | while IFS=, read -r name desc owner task_title task_desc status priority assignee start_date due_date; do
    # Remove quotes
    name=$(echo "$name" | sed 's/^"//;s/"$//')
    desc=$(echo "$desc" | sed 's/^"//;s/"$//')
    
    # Use name as key (unique projects)
    if [ -z "${PROJECTS[$name]}" ]; then
        PROJECTS[$name]="$desc"
        echo "Project: $name"
    fi
done

# Create projects
echo ""
echo "=== Creating Projects ==="

for name in "${!PROJECTS[@]}"; do
    desc="${PROJECTS[$name]}"
    echo "Creating: $name"
    
    # Create project
    result=$(curl -s -X POST "$API_URL/projects" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{\"name\": \"$name\", \"description\": \"$desc\", \"color\": \"#1890ff\"}")
    
    # Extract project ID
    pid=$(echo "$result" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    PROJECT_IDS["$name"]="$pid"
    echo "  -> ID: $pid"
done

# Create tasks
echo ""
echo "=== Creating Tasks ==="

tail -n +2 /Users/nk-lamy/Desktop/Coding/YTY\ Project/master_import_final.csv | while IFS=, read -r name desc owner task_title task_desc status priority assignee start_date due_date; do
    # Remove quotes
    name=$(echo "$name" | sed 's/^"//;s/"$//')
    task_title=$(echo "$task_title" | sed 's/^"//;s/"$//')
    task_desc=$(echo "$task_desc" | sed 's/^"//;s/"$//')
    status=$(echo "$status" | sed 's/^"//;s/"$//')
    priority=$(echo "$priority" | sed 's/^"//;s/"$//')
    assignee=$(echo "$assignee" | sed 's/^"//;s/"$//')
    
    # Map status
    case "$status" in
        "TODO") status="TODO" ;;
        "IN_PROGRESS") status="IN_PROGRESS" ;;
        "REVIEW") status="REVIEW" ;;
        "DONE") status="DONE" ;;
        *) status="TODO" ;;
    esac
    
    # Map priority
    case "$priority" in
        "HIGH") priority="HIGH" ;;
        "MEDIUM") priority="MEDIUM" ;;
        "LOW") priority="LOW" ;;
        *) priority="MEDIUM" ;;
    esac
    
    # Get project ID
    pid="${PROJECT_IDS[$name]}"
    
    # Create task
    curl -s -X POST "$API_URL/projects/$pid/tasks" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{\"title\": \"$task_title\", \"description\": \"$task_desc\", \"status\": \"$status\", \"priority\": \"$priority\"}" > /dev/null
    
    echo "Created task: $task_title"
done

echo ""
echo "=== Import Complete ==="
