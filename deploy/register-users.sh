#!/bin/bash
# Register users script for TaskFlow
# Usage: ./register-users.sh <API_BASE_URL>
# Example: ./register-users.sh http://localhost:3000/api/v1
#          ./register-users.sh http://localhost:4201/api/v1

API_URL="${1:-http://localhost:3000/api/v1}"
echo "=== Registering users to: $API_URL ==="
echo ""

register_user() {
  local name="$1"
  local email="$2"
  local password="$3"

  result=$(curl -s -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\",\"email\":\"$email\",\"password\":\"$password\"}")

  success=$(echo "$result" | grep -o '"success":true')
  if [ -n "$success" ]; then
    echo "  OK: $name ($email)"
  else
    error=$(echo "$result" | grep -o '"error":"[^"]*"' | head -1)
    echo "  SKIP: $name ($email) — $error"
  fi
}

# Owner (Head Team / A.Head Team) → promote to ADMIN after
register_user "เอกพล (Head Team)" "Ekapons@sena.co.th" "ekapons123"
register_user "พสิษฐ์ (A.Head Team)" "pasitl@sena.co.th" "pasitl123"
register_user "พลวิทย์ (Head Team)" "Ponwits@sena.co.th" "ponwits123"
register_user "มานิตย์ (Member)" "manits@sena.co.th" "manits123"
register_user "วิเชฐ (Head Team)" "Vichate_it@sena.co.th" "vichatec123"

# Members
register_user "รัชย์ศีร์ (Member)" "ratsib@sena.co.th" "ratsib123"
register_user "สิทธิชัย (Member)" "Sittichaid@sena.co.th" "sittichaid123"
register_user "ชเนษฎ์ (Member)" "chanetw@sena.co.th" "chanetw123"
register_user "ณัฐวุฒิ (Member)" "nattawutt@sena.co.th" "nattawutt123"
register_user "ธนศักดิ์ (Member)" "thanasaks@sena.co.th" "thanasaks123"
register_user "ชยพล (Member)" "chayapols@sena.co.th" "chayapols123"
register_user "ชานนท์ (Member)" "chanonk@sena.co.th" "chanonk123"
register_user "สุขสันต์ (Member)" "Sooksunb@sena.co.th" "sooksunb123"
register_user "ศิริพร (Member)" "siripornt@sena.co.th" "siripornt123"
register_user "ศุภณัฐ (Member)" "Supanats@sena.co.th" "supanats123"
register_user "ปรเมศวร์ (Member)" "porametk@sena.co.th" "porametk123"
register_user "รุจิรา (Member)" "Rujiran@sena.co.th" "rujiran123"
register_user "วัชรินทร์ (Member)" "watcharink@sena.co.th" "watcharink123"
register_user "จรัส (Member)" "jaratw@sena.co.th" "jaratw123"
register_user "สรัญญา (Member)" "saranyat@sena.co.th" "saranyat123"
register_user "วรรณิก (Member)" "wanniks@sena.co.th" "wanniks123"
register_user "ทนงศักดิ์ (Member)" "thanongsakn@sena.co.th" "tanongsak123"
register_user "ธนิสร (Member)" "tanisony@sena.co.th" "tanisony123"

echo ""
echo "=== Done! Total: 23 users ==="
