-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_balances table (one-to-one relationship with users)
CREATE TABLE IF NOT EXISTS user_balances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table (many-to-one relationship with users)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('deposit', 'withdrawal', 'transfer', 'refund')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_balances_user_id ON user_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Insert sample users
INSERT INTO users (username, email, first_name, last_name) VALUES
    ('john_doe', 'john.doe@example.com', 'John', 'Doe'),
    ('jane_smith', 'jane.smith@example.com', 'Jane', 'Smith'),
    ('bob_wilson', 'bob.wilson@example.com', 'Bob', 'Wilson'),
    ('alice_brown', 'alice.brown@example.com', 'Alice', 'Brown'),
    ('charlie_davis', 'charlie.davis@example.com', 'Charlie', 'Davis')
ON CONFLICT (username) DO NOTHING;

-- Insert sample user balances
INSERT INTO user_balances (user_id, balance, currency) VALUES
    (1, 1500.50, 'USD'),
    (2, 2300.75, 'USD'),
    (3, 500.00, 'USD'),
    (4, 875.25, 'USD'),
    (5, 1200.00, 'USD')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample payments
INSERT INTO payments (user_id, amount, currency, payment_type, status, description) VALUES
    (1, 100.00, 'USD', 'deposit', 'completed', 'Initial deposit'),
    (1, 50.00, 'USD', 'withdrawal', 'completed', 'ATM withdrawal'),
    (2, 200.00, 'USD', 'deposit', 'completed', 'Bank transfer'),
    (2, 75.50, 'USD', 'transfer', 'completed', 'Payment to user 1'),
    (3, 300.00, 'USD', 'deposit', 'completed', 'Payroll deposit'),
    (3, 25.00, 'USD', 'withdrawal', 'pending', 'Pending withdrawal'),
    (4, 150.00, 'USD', 'deposit', 'completed', 'Gift deposit'),
    (4, 100.00, 'USD', 'refund', 'completed', 'Refund for cancelled order'),
    (5, 500.00, 'USD', 'deposit', 'completed', 'Large deposit'),
    (5, 200.00, 'USD', 'withdrawal', 'failed', 'Failed withdrawal attempt'),
    (1, 25.75, 'USD', 'transfer', 'completed', 'Payment to user 3'),
    (2, 50.00, 'USD', 'withdrawal', 'completed', 'Cash withdrawal')
ON CONFLICT DO NOTHING;

