#!/bin/bash

# Wait for Elasticsearch to start
until curl -s http://localhost:9200 >/dev/null; do
    echo "Waiting for Elasticsearch..."
    sleep 5
done

# Create policies index
curl -X PUT "localhost:9200/policies" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "content": { "type": "text" },
      "framework": { "type": "keyword" },
      "status": { "type": "keyword" },
      "language": { "type": "keyword" }
    }
  }
}
'

# Create risks index
curl -X PUT "localhost:9200/risks" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "description": { "type": "text" },
      "category": { "type": "keyword" },
      "level": { "type": "keyword" }
    }
  }
}
'

echo "Elasticsearch indices created."