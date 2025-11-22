#!/bin/bash

# Test script for PostgreSQL database
# This script tests the database connection and verifies the seed data

set -e

echo "🔍 Testing PostgreSQL database connection..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    cp env.example .env
    echo "POSTGRES_URL=postgresql://postgres:postgres@localhost:5433/askdb" >> .env
fi

# Source environment variables
export $(cat .env | grep -v '^#' | xargs)

# Default connection string if not set
POSTGRES_URL=${POSTGRES_URL:-"postgresql://postgres:postgres@localhost:5433/askdb"}

echo "📊 Testing database connection..."
echo "Connection string: ${POSTGRES_URL}"

# Test connection using psql if available, otherwise use node
if command -v psql &> /dev/null; then
    echo ""
    echo "✅ Testing with psql..."
    
    # Extract connection details
    DB_USER=$(echo $POSTGRES_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASS="postgres"
    DB_HOST=$(echo $POSTGRES_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $POSTGRES_URL | sed -n 's/.*:\([^/]*\)\/.*/\1/p')
    DB_NAME=$(echo $POSTGRES_URL | sed -n 's/.*\/\(.*\)/\1/p')
    
    export PGPASSWORD=$DB_PASS
    
    echo ""
    echo "📋 Checking tables..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt" || echo "❌ Failed to list tables"
    
    echo ""
    echo "👥 Counting users..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as user_count FROM users;" || echo "❌ Failed to count users"
    
    echo ""
    echo "💰 Checking user balances..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as balance_count FROM user_balances;" || echo "❌ Failed to count balances"
    
    echo ""
    echo "💳 Checking payments..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as payment_count FROM payments;" || echo "❌ Failed to count payments"
    
    echo ""
    echo "🔗 Testing relationships..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        SELECT 
            u.username,
            ub.balance,
            COUNT(p.id) as payment_count
        FROM users u
        LEFT JOIN user_balances ub ON u.id = ub.user_id
        LEFT JOIN payments p ON u.id = p.user_id
        GROUP BY u.id, u.username, ub.balance
        ORDER BY u.id
        LIMIT 5;
    " || echo "❌ Failed to test relationships"
    
    echo ""
    echo "✅ Database test completed!"
else
    echo ""
    echo "⚠️  psql not found. Using Node.js test script..."
    echo "Run: npm run test:db (if you create the script)"
fi

