import Project from "../models/Project.js";
import Task from "../models/Task.js";

const getDashboardStats = async (req, res, next) => {
  try {
    const { project, assignedTo, status } = req.query;

    const taskFilter = {};
    if (project) taskFilter.project = project;
    if (assignedTo) taskFilter.assignedTo = assignedTo;
    if (status) taskFilter.status = status;

    if (req.user.role === "member") {
      taskFilter.assignedTo = req.user._id;
    }

    let visibleProjectIds = null;
    if (req.user.role === "member") {
      const projects = await Project.find({ members: req.user._id }).select("_id");
      visibleProjectIds = projects.map((item) => item._id.toString());
      taskFilter.project = taskFilter.project
        ? taskFilter.project
        : { $in: visibleProjectIds };
    }

    const now = new Date();

    const [totalTasks, completedTasks, overdueTasks, statusBreakdown, tasks] = await Promise.all([
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: "done" }),
      Task.countDocuments({
        ...taskFilter,
        dueDate: { $lt: now },
        status: { $ne: "done" },
      }),
      Task.aggregate([
        { $match: taskFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Task.find(taskFilter)
        .populate("assignedTo", "name email role")
        .populate("project", "name")
        .sort({ dueDate: 1, createdAt: -1 }),
    ]);

    const filteredTasks = req.user.role === "member" && visibleProjectIds
      ? tasks.filter((task) => visibleProjectIds.includes(task.project._id.toString()))
      : tasks;

    return res.status(200).json({
      stats: {
        totalTasks,
        completedTasks,
        overdueTasks,
      },
      statusBreakdown,
      tasks: filteredTasks,
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboardStats };
