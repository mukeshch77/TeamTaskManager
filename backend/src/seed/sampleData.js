import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([User.deleteMany({}), Project.deleteMany({}), Task.deleteMany({})]);

    const [admin, memberA, memberB] = await User.create([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      },
      {
        name: "Member One",
        email: "member1@example.com",
        password: "password123",
        role: "member",
      },
      {
        name: "Member Two",
        email: "member2@example.com",
        password: "password123",
        role: "member",
      },
    ]);

    const project = await Project.create({
      name: "Website Revamp",
      description: "Modernize UI and improve performance",
      members: [admin._id, memberA._id, memberB._id],
      createdBy: admin._id,
    });

    await Task.create([
      {
        title: "Create wireframes",
        description: "Prepare high-fidelity Figma screens",
        status: "in-progress",
        assignedTo: memberA._id,
        project: project._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Set up API integration",
        description: "Connect frontend with backend auth endpoints",
        status: "todo",
        assignedTo: memberB._id,
        project: project._id,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: "Optimize image assets",
        description: "Compress images and implement lazy loading",
        status: "done",
        assignedTo: memberA._id,
        project: project._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
    ]);

    console.log("Sample data seeded successfully");
    console.log("Admin login: admin@example.com / password123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
