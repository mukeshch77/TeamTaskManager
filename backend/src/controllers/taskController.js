import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const canAccessProject = (project, user) => {
  if (user.role === "admin") {
    return true;
  }

  return project.members.some((memberId) => memberId.toString() === user._id.toString());
};

const canAccessTask = (task, user) => {
  if (user.role === "admin") {
    return true;
  }

  return task.assignedTo.toString() === user._id.toString();
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, assignedTo, project, dueDate } = req.body;

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const isProjectMember = projectDoc.members.some(
      (memberId) => memberId.toString() === assignedTo.toString()
    );

    if (!isProjectMember) {
      return res.status(400).json({
        message: "Assigned user must be a member of the project",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo,
      project,
      dueDate,
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("project", "name description")
      .populate("createdBy", "name email role");

    return res.status(201).json({ message: "Task created", task: populated });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { project, assignedTo, status } = req.query;

    const filter = {};
    if (project) filter.project = project;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (status) filter.status = status;

    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email role")
      .populate("project", "name description members")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    const visibleTasks = req.user.role === "admin"
      ? tasks
      : tasks.filter((task) =>
          task.project.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
          )
        );

    return res.status(200).json({ tasks: visibleTasks });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate("project", "name description members")
      .populate("createdBy", "name email role");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({ message: "You do not have access to this task" });
    }

    return res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("project", "members");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "member") {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only update your own tasks" });
      }

      const allowedKeys = ["status"];
      const invalidField = Object.keys(req.body).find((key) => !allowedKeys.includes(key));
      if (invalidField) {
        return res.status(403).json({
          message: "Members can only update task status",
        });
      }
    }

    if (req.body.project || req.body.assignedTo) {
      const nextProjectId = req.body.project || task.project._id;
      const nextAssigneeId = req.body.assignedTo || task.assignedTo;

      const projectDoc = await Project.findById(nextProjectId);
      if (!projectDoc) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!canAccessProject(projectDoc, req.user)) {
        return res.status(403).json({ message: "No access to target project" });
      }

      const isMember = projectDoc.members.some(
        (memberId) => memberId.toString() === nextAssigneeId.toString()
      );

      if (!isMember) {
        return res.status(400).json({
          message: "Assigned user must be part of the target project",
        });
      }
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.status = req.body.status ?? task.status;
    task.assignedTo = req.body.assignedTo ?? task.assignedTo;
    task.project = req.body.project ?? task.project;
    task.dueDate = req.body.dueDate ?? task.dueDate;

    await task.save();

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("project", "name description")
      .populate("createdBy", "name email role");

    return res.status(200).json({ message: "Task updated", task: populated });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tasks" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
