# AskDB

A database query assistant powered by LangChain and OpenAI.

## Setup

### Prerequisites

- Node.js
- Docker and Docker Compose
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_api_key_here
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/askdb
```

### Database Setup

1. Start PostgreSQL using Docker Compose:
```bash
npm run docker:up
# or
docker-compose up -d
```

This will:
- Start a PostgreSQL 15 container
- Create the `askdb` database
- Automatically run `seed.sql` to create tables and sample data

2. Test the database connection:
```bash
npm run test:db
# or
./test-db.sh
```

### Test Database Schema

It has a seed.sql to make test data for demonstrating the tool.
The database includes three related tables:

- **users**: User information (id, username, email, first_name, last_name)
- **user_balances**: One-to-one relationship with users (user_id, balance, currency)
- **payments**: Many-to-one relationship with users (user_id, amount, payment_type, status)

Relationships:
- `user_balances.user_id` → `users.id` (one-to-one)
- `payments.user_id` → `users.id` (many-to-one)

### Docker Commands

```bash
# Start database
npm run docker:up

# Stop database
npm run docker:down

## Usage

Run the application with a question as a command line argument:

```bash
npm run dev "Your question here"
```

For example:
```bash
npm run dev "Get me 3 users with the payments with most amount of payments. Give me only name and email."
```

The application will:
1. Process your question through the SQL execution agent
2. Generate and execute the appropriate SQL query
3. Summarize the results using the summary agent
4. Display the final answer

**Note:** The question parameter is required. If you don't provide a question, the application will exit with an error message.

## Project Structure

```
src/
  db/              # Database providers
  llm/
    agents/        # LangChain agents (executeSql, summary, pipeline)
    tools/         # LangChain tools (getSchema, makeQuery)
  types/           # TypeScript type definitions
```

