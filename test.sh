#!/bin/bash

read -d "" json << EOF

{
  "title": "Test life achievement"
}
EOF

curl -X POST -H "Content-Type: application/json" "localhost:8280/calendar" -d "$json"
