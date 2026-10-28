import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

const todoSchema = new mongoose.Schema(
  {
    id: Number,
    test: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { versionKey: false }
);

const Todo = mongoose.model("Todo", todoSchema);

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ id: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Could not get todos" });
  }
});

// Add a todo
app.post("/todos", async (req, res) => {
  try {
    const test = req.body.test?.trim();

    if (!test) {
      return res.status(400).json({ message: "Todo text is required" });
    }

    const savedTodo = await Todo.create({
      id: Date.now(),
      test,
    });

    res.status(201).json({
      id: savedTodo.id,
      test: savedTodo.test,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not add todo" });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await Todo.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete todo" });
  }
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });