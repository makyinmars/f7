import "dotenv/config";

import { db, pool } from "../index";
import { TodoStatus, todo } from "../schema";

const sampleTodos = [
  {
    text: "Set up project structure",
    description:
      "Initialize the project with proper folder structure, dependencies, and configuration files",
    active: true,
    status: TodoStatus.COMPLETED,
  },
  {
    text: "Implement user authentication",
    description:
      "Add secure login/logout functionality with session management and password hashing",
    active: true,
    status: TodoStatus.IN_PROGRESS,
  },
  {
    text: "Create database schema",
    description:
      "Design and implement the database tables with proper relationships and constraints",
    active: true,
    status: TodoStatus.COMPLETED,
  },
  {
    text: "Build API endpoints",
    description:
      "Create RESTful API endpoints for all CRUD operations with proper validation",
    active: true,
    status: TodoStatus.IN_PROGRESS,
  },
  {
    text: "Design UI components",
    description:
      "Create reusable React components with consistent styling and responsive design",
    active: true,
    status: TodoStatus.NOT_STARTED,
  },
  {
    text: "Write unit tests",
    description:
      "Add comprehensive test coverage for all components and API endpoints",
    active: true,
    status: TodoStatus.NOT_STARTED,
  },
  {
    text: "Set up CI/CD pipeline",
    description:
      "Configure automated testing, building, and deployment processes",
    active: false,
    status: TodoStatus.NOT_STARTED,
  },
  {
    text: "Implement error handling",
    description:
      "Add proper error boundaries and user-friendly error messages throughout the app",
    active: true,
    status: TodoStatus.IN_PROGRESS,
  },
  {
    text: "Add logging and monitoring",
    description:
      "Set up application logging, error tracking, and performance monitoring",
    active: true,
    status: TodoStatus.NOT_STARTED,
  },
  {
    text: "Optimize database queries",
    description:
      "Review and optimize database queries for better performance and scalability",
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
