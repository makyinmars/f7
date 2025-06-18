import "dotenv/config";

import { db, pool } from "../index";
import { TodoStatus, todo } from "../schema";

const sampleTodos = [
  {
    text: "Set up project structure",
    active: true,
    status: TodoStatus.COMPLETED,
  },
  {
    text: "Implement user authentication",
    active: true,
    status: TodoStatus.IN_PROGRESS,
  },
  {
    text: "Create database schema",
    active: true,
    status: TodoStatus.COMPLETED,
  },
  {
    text: "Build API endpoints",
    active: true,
    status: TodoStatus.IN_PROGRESS,
  },
  {
    text: "Design UI components",
    active: true,
    status: TodoStatus.NOT_STARTED,
  },
  {
    text: "Write unit tests",
    active: true,
    status: TodoStatus.NOT_STARTED,
  },
  {
    text: "Set up CI/CD pipeline",
    active: false,
    status: TodoStatus.NOT_STARTED,
  },
  {
    text: "Implement error handling",
    active: true,
    status: TodoStatus.IN_PROGRESS,
  },
  {
    text: "Add logging and monitoring",
    active: true,
    status: TodoStatus.NOT_STARTED,
  },
  {
    text: "Optimize database queries",
    active: true,
    status: TodoStatus.NOT_STARTED,
  },
];

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing todos (optional - remove if you want to keep existing data)
    console.log("🗑️  Clearing existing todos...");
    await db.delete(todo);

    // Insert sample todos
    console.log("📝 Inserting sample todos...");
    const insertedTodos = await db.insert(todo).values(sampleTodos).returning();

    console.log(`✅ Successfully seeded ${insertedTodos.length} todos:`);

    insertedTodos.forEach((todoItem, index) => {
      console.log(
        `  ${index + 1}. ${todoItem.text} - ${todoItem.status} (${todoItem.active ? "Active" : "Inactive"})`,
      );
    });

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    // Close the database connection
    await pool.end();
    console.log("📦 Database connection closed.");
  }
}

// Run the seeding function
await main();
