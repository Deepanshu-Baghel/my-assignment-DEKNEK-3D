import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask, deleteTask, fetchTasks, updateTask } from "../api/taskApi";
import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editDraft, setEditDraft] = useState({ title: "", description: "" });

  const totalCompleted = useMemo(
    () => tasks.filter((task) => task.isCompleted).length,
    [tasks]
  );

  const loadTasks = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response.tasks || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hydrateTasks = async () => {
      await loadTasks();
    };

    hydrateTasks();
  }, []);

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (!newTask.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      const response = await createTask(newTask);
      setTasks((previous) => [response.task, ...previous]);
      setSuccess("Task created.");
      setNewTask({ title: "", description: "" });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to create task.");
    }
  };

  const handleToggleTask = async (task) => {
    clearFeedback();

    try {
      const response = await updateTask(task._id, { isCompleted: !task.isCompleted });
      setTasks((previous) =>
        previous.map((item) => (item._id === task._id ? response.task : item))
      );
      setSuccess("Task updated.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to update task.");
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setEditDraft({
      title: task.title,
      description: task.description || "",
    });
  };

  const handleSaveEdit = async () => {
    clearFeedback();

    if (!editDraft.title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      const response = await updateTask(editingTaskId, editDraft);
      setTasks((previous) =>
        previous.map((item) => (item._id === editingTaskId ? response.task : item))
      );
      setEditingTaskId(null);
      setSuccess("Task details saved.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to save changes.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    clearFeedback();

    try {
      await deleteTask(taskId);
      setTasks((previous) => previous.filter((task) => task._id !== taskId));
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
      }
      setSuccess("Task deleted.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to delete task.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <span className="brand-tag">Dashboard</span>
          <h1>Hi {user?.name || "there"}, stay on track.</h1>
          <p className="subtitle">
            Tasks: {tasks.length} total, {totalCompleted} completed.
          </p>
        </div>

        <div className="logout-wrap">
          <span className="user-chip">{user?.email}</span>
          <button className="btn btn-secondary" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </header>

      {(error || success) && (
        <div className={`message ${error ? "message-error" : "message-success"}`} role="alert">
          {error || success}
        </div>
      )}

      <section className="dashboard-panels">
        <div className="panel auth-form-wrap">
          <h2 className="section-title">Add a task</h2>
          <form className="auth-form" onSubmit={handleCreateTask}>
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={newTask.title}
                onChange={(event) =>
                  setNewTask((previous) => ({ ...previous, title: event.target.value }))
                }
                maxLength={120}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(event) =>
                  setNewTask((previous) => ({ ...previous, description: event.target.value }))
                }
                maxLength={500}
              />
            </div>

            <button className="btn btn-primary" type="submit">Create task</button>
          </form>
        </div>

        <div className="panel auth-form-wrap">
          <h2 className="section-title">Your tasks</h2>

          {loading ? <p>Loading tasks...</p> : null}

          {!loading && tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Add your first one.</div>
          ) : null}

          <div className="task-list">
            {tasks.map((task) => (
              <article className="task-item" key={task._id}>
                {editingTaskId === task._id ? (
                  <>
                    <div className="input-group">
                      <label htmlFor={`edit-title-${task._id}`}>Title</label>
                      <input
                        id={`edit-title-${task._id}`}
                        value={editDraft.title}
                        onChange={(event) =>
                          setEditDraft((previous) => ({
                            ...previous,
                            title: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label htmlFor={`edit-description-${task._id}`}>Description</label>
                      <textarea
                        id={`edit-description-${task._id}`}
                        value={editDraft.description}
                        onChange={(event) =>
                          setEditDraft((previous) => ({
                            ...previous,
                            description: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="inline-row">
                      <button className="btn btn-primary small" type="button" onClick={handleSaveEdit}>
                        Save
                      </button>
                      <button
                        className="btn btn-secondary small"
                        type="button"
                        onClick={() => setEditingTaskId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="task-head">
                      <div>
                        <div className={`task-title ${task.isCompleted ? "done" : ""}`}>{task.title}</div>
                        {task.description ? <p>{task.description}</p> : null}
                      </div>
                      <span className="task-meta">{task.isCompleted ? "Done" : "Open"}</span>
                    </div>

                    <div className="task-actions">
                      <button
                        className="btn btn-secondary small"
                        type="button"
                        onClick={() => handleToggleTask(task)}
                      >
                        {task.isCompleted ? "Mark Open" : "Mark Done"}
                      </button>

                      <button
                        className="btn btn-secondary small"
                        type="button"
                        onClick={() => handleStartEdit(task)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger small"
                        type="button"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
