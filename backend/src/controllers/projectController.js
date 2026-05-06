import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const ensureMembersExist = async (memberIds = []) => {
  if (!memberIds.length) {
    return [];
  }

  const users = await User.find({ _id: { $in: memberIds } }).select("_id");
  const validIds = users.map((user) => user._id.toString());

  const missing = memberIds.filter((id) => !validIds.includes(id.toString()));
  if (missing.length) {
    throw new Error(`Invalid member IDs: ${missing.join(", ")}`);
  }

  return memberIds;
};

const createProject = async (req, res, next) => {
  try {
    const { name, description, members = [] } = req.body;
    const cleanMembers = await ensureMembersExist(members);

    const memberSet = new Set(cleanMembers.map((id) => id.toString()));
    memberSet.add(req.user._id.toString());

    const project = await Project.create({
      name,
      description,
      members: Array.from(memberSet),
      createdBy: req.user._id,
    });

    const populated = await Project.findById(project._id)
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    return res.status(201).json({ message: "Project created", project: populated });
  } catch (error) {
    if (error.message.startsWith("Invalid member IDs")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { members: req.user._id };

    const projects = await Project.find(filter)
      .populate("members", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (req.user.role !== "admin" && !isMember) {
      return res.status(403).json({ message: "You do not have access to this project" });
    }

    return res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = name ?? project.name;
    project.description = description ?? project.description;

    await project.save();

    const populated = await Project.findById(project._id)
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    return res.status(200).json({ message: "Project updated", project: populated });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    return res.status(200).json({ message: "Project and related tasks deleted" });
  } catch (error) {
    next(error);
  }
};

const addMembers = async (req, res, next) => {
  try {
    const { memberIds } = req.body;
    await ensureMembersExist(memberIds);

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const merged = new Set([
      ...project.members.map((id) => id.toString()),
      ...memberIds.map((id) => id.toString()),
      req.user._id.toString(),
    ]);

    project.members = Array.from(merged);
    await project.save();

    const populated = await Project.findById(project._id)
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    return res.status(200).json({ message: "Members added", project: populated });
  } catch (error) {
    if (error.message.startsWith("Invalid member IDs")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const removeMembers = async (req, res, next) => {
  try {
    const { memberIds } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.members = project.members.filter(
      (memberId) =>
        !memberIds.map((id) => id.toString()).includes(memberId.toString()) ||
        memberId.toString() === req.user._id.toString()
    );

    await project.save();

    const populated = await Project.findById(project._id)
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    return res.status(200).json({ message: "Members removed", project: populated });
  } catch (error) {
    next(error);
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMembers,
  removeMembers,
};
