import PostgresSqlProvider from "./db/postgressql";
import dotenv from "dotenv";

dotenv.config();

async function testDatabase() {
    console.log("🔍 Testing PostgreSQL database connection...\n");
    
    // Check if POSTGRES_URL is set
    if (!process.env.POSTGRES_URL) {
        console.error("❌ POSTGRES_URL environment variable is not set");
        console.log("💡 Please set it in your .env file:");
        console.log("   POSTGRES_URL=postgresql://postgres:postgres@localhost:5433/askdb");
        process.exit(1);
    }
    
    console.log(`📡 Connection string: ${process.env.POSTGRES_URL.replace(/:[^:@]+@/, ':****@')}\n`);
    
    const provider = new PostgresSqlProvider();
    
    try {
        // Connect to database
        await provider.connect();
        console.log("✅ Connected to database\n");
        
        // Test 1: Count users
        console.log("📋 Testing tables...");
        const userCount = await provider.makeQuery<{ count: string }>(
            "SELECT COUNT(*) as count FROM users"
        );
        console.log(`👥 Users count: ${userCount[0].count}`);
        
        // Test 2: Count user balances
        const balanceCount = await provider.makeQuery<{ count: string }>(
            "SELECT COUNT(*) as count FROM user_balances"
        );
        console.log(`💰 User balances count: ${balanceCount[0].count}`);
        
        // Test 3: Count payments
        const paymentCount = await provider.makeQuery<{ count: string }>(
            "SELECT COUNT(*) as count FROM payments"
        );
        console.log(`💳 Payments count: ${paymentCount[0].count}\n`);
        
        // Test 4: Test relationships
        console.log("🔗 Testing relationships...");
        const relationships = await provider.makeQuery<{
            username: string;
            balance: number;
            payment_count: string;
        }>(
            `SELECT 
                u.username,
                ub.balance,
                COUNT(p.id) as payment_count
            FROM users u
            LEFT JOIN user_balances ub ON u.id = ub.user_id
            LEFT JOIN payments p ON u.id = p.user_id
            GROUP BY u.id, u.username, ub.balance
            ORDER BY u.id
            LIMIT 5`
        );
        
        console.log("\nSample data with relationships:");
        relationships.forEach((row) => {
            console.log(`  ${row.username}: Balance $${row.balance}, ${row.payment_count} payments`);
        });
        
        // Test 5: Test specific queries
        console.log("\n📊 Additional test queries:");
        
        const completedPayments = await provider.makeQuery<{ count: string }>(
            "SELECT COUNT(*) as count FROM payments WHERE status = 'completed'"
        );
        console.log(`✅ Completed payments: ${completedPayments[0].count}`);
        
        const totalBalance = await provider.makeQuery<{ total: string }>(
            "SELECT SUM(balance) as total FROM user_balances"
        );
        console.log(`💰 Total balance across all users: $${totalBalance[0].total}`);
        
        const userWithMostPayments = await provider.makeQuery<{
            username: string;
            payment_count: string;
        }>(
            `SELECT 
                u.username,
                COUNT(p.id) as payment_count
            FROM users u
            LEFT JOIN payments p ON u.id = p.user_id
            GROUP BY u.id, u.username
            ORDER BY payment_count DESC
            LIMIT 1`
        );
        if (userWithMostPayments[0]) {
            console.log(`🏆 User with most payments: ${userWithMostPayments[0].username} (${userWithMostPayments[0].payment_count} payments)`);
        }
        
        console.log("\n✅ All database tests passed!");
        
    } catch (error) {
        console.error("❌ Database test failed:", error);
        process.exit(1);
    } finally {
        // Close connection if pool exists
        if (provider.pool) {
            await provider.pool.end();
        }
    }
}

testDatabase();

