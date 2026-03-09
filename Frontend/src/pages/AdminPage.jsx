import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { getApiErrorMessage } from "../lib/getApiErrorMessage";

const emptyCourseForm = {
  title: "",
  slug: "",
  description: "",
  category: "",
  level: "",
  duration: "",
  thumbnail: "",
  price: 999,
  playlistId: "",
  isPublished: true,
};

const emptySectionForm = {
  courseId: "",
  title: "",
  orderIndex: 1,
};

const emptyLessonForm = {
  courseId: "",
  sectionId: "",
  title: "",
  description: "",
  orderIndex: 1,
  sectionOrder: 1,
  courseOrder: 1,
  playlistIndex: 0,
  durationLabel: "10 min",
  isFreePreview: false,
  playlistId: "",
  youtubeUrl: "https://www.youtube.com/playlist?list=",
};

function AdminPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [courseEditingId, setCourseEditingId] = useState(null);
  const [sectionForm, setSectionForm] = useState(emptySectionForm);
  const [sectionEditingId, setSectionEditingId] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [lessonEditingId, setLessonEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateError = (text) => {
    setError(text);
    window.setTimeout(() => setError(""), 3500);
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/courses");
      setCourses(data.courses);
      setError("");
    } catch (requestError) {
      updateError(getApiErrorMessage(requestError, "Unable to load admin data right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (!courses.length) {
      return;
    }

    const firstCourse = courses[0];
    const firstSection = firstCourse.sections[0];

    setSectionForm((current) =>
      current.courseId
        ? current
        : {
            ...current,
            courseId: firstCourse.id,
          }
    );

    setLessonForm((current) =>
      current.courseId
        ? current
        : {
            ...current,
            courseId: firstCourse.id,
            sectionId: firstSection?.id || "",
            playlistId: firstCourse.playlistId,
            youtubeUrl: `https://www.youtube.com/playlist?list=${firstCourse.playlistId}`,
          }
    );
  }, [courses]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === lessonForm.courseId) || null,
    [courses, lessonForm.courseId]
  );

  const selectedSections = selectedCourse?.sections || [];

  const resetCourseForm = () => {
    setCourseForm(emptyCourseForm);
    setCourseEditingId(null);
  };

  const resetSectionForm = () => {
    setSectionForm({
      ...emptySectionForm,
      courseId: courses[0]?.id || "",
    });
    setSectionEditingId(null);
  };

  const resetLessonForm = () => {
    setLessonForm({
      ...emptyLessonForm,
      courseId: courses[0]?.id || "",
      sectionId: courses[0]?.sections?.[0]?.id || "",
      playlistId: courses[0]?.playlistId || "",
      youtubeUrl: courses[0]
        ? `https://www.youtube.com/playlist?list=${courses[0].playlistId}`
        : emptyLessonForm.youtubeUrl,
    });
    setLessonEditingId(null);
  };

  const updateMessage = (text) => {
    setMessage(text);
    setError("");
    window.setTimeout(() => setMessage(""), 2500);
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...courseForm, price: Number(courseForm.price) };
    try {
      if (courseEditingId) {
        await api.put(`/admin/courses/${courseEditingId}`, payload);
        updateMessage("Course updated.");
      } else {
        await api.post("/admin/courses", payload);
        updateMessage("Course created.");
      }
      resetCourseForm();
      await loadCourses();
    } catch (requestError) {
      updateError(getApiErrorMessage(requestError, "Unable to save the course."));
    }
  };

  const handleSectionSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...sectionForm,
      orderIndex: Number(sectionForm.orderIndex),
    };
    try {
      if (sectionEditingId) {
        await api.put(`/admin/sections/${sectionEditingId}`, payload);
        updateMessage("Section updated.");
      } else {
        await api.post("/admin/sections", payload);
        updateMessage("Section created.");
      }
      resetSectionForm();
      await loadCourses();
    } catch (requestError) {
      updateError(getApiErrorMessage(requestError, "Unable to save the section."));
    }
  };

  const handleLessonSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...lessonForm,
      orderIndex: Number(lessonForm.orderIndex),
      sectionOrder: Number(lessonForm.sectionOrder),
      courseOrder: Number(lessonForm.courseOrder),
      playlistIndex: Number(lessonForm.playlistIndex),
    };

    try {
      if (lessonEditingId) {
        await api.put(`/admin/lessons/${lessonEditingId}`, payload);
        updateMessage("Lesson updated.");
      } else {
        await api.post("/admin/lessons", payload);
        updateMessage("Lesson created.");
      }
      resetLessonForm();
      await loadCourses();
    } catch (requestError) {
      updateError(getApiErrorMessage(requestError, "Unable to save the lesson."));
    }
  };

  const handleDelete = async (type, id) => {
    const confirmed = window.confirm(`Delete this ${type}?`);
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/${type}s/${id}`);
      updateMessage(`${type[0].toUpperCase()}${type.slice(1)} deleted.`);
      await loadCourses();
    } catch (requestError) {
      updateError(getApiErrorMessage(requestError, `Unable to delete the ${type}.`));
    }
  };

  return (
    <div className="page-stack">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h1>Manage SkillUp courses, sections, and lessons</h1>
        </div>
        {message && <span className="glass-chip">{message}</span>}
      </section>
      {error && <div className="form-error">{error}</div>}

      <section className="admin-forms-grid">
        <form className="glass-panel admin-form-card" onSubmit={handleCourseSubmit}>
          <div className="admin-card-header">
            <h3>{courseEditingId ? "Edit course" : "Create course"}</h3>
            {courseEditingId && (
              <button className="button ghost-button" type="button" onClick={resetCourseForm}>
                Reset
              </button>
            )}
          </div>
          <div className="form-grid">
            {[
              ["title", "Course title"],
              ["slug", "Slug"],
              ["category", "Category"],
              ["level", "Level"],
              ["duration", "Duration"],
              ["thumbnail", "Thumbnail URL"],
              ["playlistId", "Playlist ID"],
            ].map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  value={courseForm[key]}
                  onChange={(event) =>
                    setCourseForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                  required
                />
              </label>
            ))}
            <label>
              <span>Price</span>
              <input
                type="number"
                value={courseForm.price}
                onChange={(event) =>
                  setCourseForm((current) => ({ ...current, price: event.target.value }))
                }
                required
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={courseForm.isPublished}
                onChange={(event) =>
                  setCourseForm((current) => ({ ...current, isPublished: event.target.checked }))
                }
              />
              Published
            </label>
            <label className="full-span">
              <span>Description</span>
              <textarea
                value={courseForm.description}
                onChange={(event) =>
                  setCourseForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                required
              />
            </label>
          </div>
          <button className="button primary-button full-width" type="submit">
            <Plus size={16} />
            {courseEditingId ? "Update course" : "Create course"}
          </button>
        </form>

        <form className="glass-panel admin-form-card" onSubmit={handleSectionSubmit}>
          <div className="admin-card-header">
            <h3>{sectionEditingId ? "Edit section" : "Create section"}</h3>
            {sectionEditingId && (
              <button className="button ghost-button" type="button" onClick={resetSectionForm}>
                Reset
              </button>
            )}
          </div>
          <div className="form-grid">
            <label>
              <span>Course</span>
              <select
                value={sectionForm.courseId}
                onChange={(event) =>
                  setSectionForm((current) => ({ ...current, courseId: event.target.value }))
                }
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Section title</span>
              <input
                value={sectionForm.title}
                onChange={(event) =>
                  setSectionForm((current) => ({ ...current, title: event.target.value }))
                }
                required
              />
            </label>
            <label>
              <span>Order index</span>
              <input
                type="number"
                value={sectionForm.orderIndex}
                onChange={(event) =>
                  setSectionForm((current) => ({ ...current, orderIndex: event.target.value }))
                }
                required
              />
            </label>
          </div>
          <button className="button primary-button full-width" type="submit">
            <Plus size={16} />
            {sectionEditingId ? "Update section" : "Create section"}
          </button>
        </form>

        <form className="glass-panel admin-form-card" onSubmit={handleLessonSubmit}>
          <div className="admin-card-header">
            <h3>{lessonEditingId ? "Edit lesson" : "Create lesson"}</h3>
            {lessonEditingId && (
              <button className="button ghost-button" type="button" onClick={resetLessonForm}>
                Reset
              </button>
            )}
          </div>
          <div className="form-grid">
            <label>
              <span>Course</span>
              <select
                value={lessonForm.courseId}
                onChange={(event) => {
                  const course = courses.find((item) => item.id === event.target.value);
                  setLessonForm((current) => ({
                    ...current,
                    courseId: event.target.value,
                    sectionId: course?.sections?.[0]?.id || "",
                    playlistId: course?.playlistId || "",
                    youtubeUrl: course
                      ? `https://www.youtube.com/playlist?list=${course.playlistId}`
                      : current.youtubeUrl,
                  }));
                }}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Section</span>
              <select
                value={lessonForm.sectionId}
                onChange={(event) =>
                  setLessonForm((current) => ({ ...current, sectionId: event.target.value }))
                }
              >
                {selectedSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </label>

            {[
              ["title", "Lesson title"],
              ["durationLabel", "Duration label"],
              ["playlistId", "Playlist ID"],
              ["youtubeUrl", "YouTube URL"],
            ].map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  value={lessonForm[key]}
                  onChange={(event) =>
                    setLessonForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                  required
                />
              </label>
            ))}

            {[
              ["orderIndex", "Lesson order"],
              ["sectionOrder", "Section order"],
              ["courseOrder", "Course order"],
              ["playlistIndex", "Playlist index (0-based)"],
            ].map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  type="number"
                  value={lessonForm[key]}
                  onChange={(event) =>
                    setLessonForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                  required
                />
              </label>
            ))}

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={lessonForm.isFreePreview}
                onChange={(event) =>
                  setLessonForm((current) => ({ ...current, isFreePreview: event.target.checked }))
                }
              />
              Free preview lesson
            </label>

            <label className="full-span">
              <span>Description</span>
              <textarea
                value={lessonForm.description}
                onChange={(event) =>
                  setLessonForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                required
              />
            </label>
          </div>
          <button className="button primary-button full-width" type="submit">
            <Plus size={16} />
            {lessonEditingId ? "Update lesson" : "Create lesson"}
          </button>
        </form>
      </section>

      <section className="admin-course-stack">
        {loading ? (
          <div className="state-card glass-panel">Loading admin data...</div>
        ) : (
          courses.map((course) => (
            <article key={course.id} className="glass-panel admin-course-card">
              <div className="admin-course-header">
                <div>
                  <p className="eyebrow">{course.category}</p>
                  <h2>{course.title}</h2>
                  <span className="subtle-text">
                    {course.slug} · Rs. {course.price}
                  </span>
                </div>
                <div className="card-actions">
                  <button
                    className="button ghost-button"
                    onClick={() => {
                      setCourseEditingId(course.id);
                      setCourseForm({
                        title: course.title,
                        slug: course.slug,
                        description: course.description,
                        category: course.category,
                        level: course.level,
                        duration: course.duration,
                        thumbnail: course.thumbnail,
                        price: course.price,
                        playlistId: course.playlistId,
                        isPublished: course.isPublished,
                      });
                    }}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button className="button danger-button" onClick={() => handleDelete("course", course.id)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              {course.sections.map((section) => (
                <div key={section.id} className="admin-section-block">
                  <div className="admin-section-header">
                    <strong>
                      Section {section.orderIndex}: {section.title}
                    </strong>
                    <div className="card-actions">
                      <button
                        className="button ghost-button"
                        onClick={() => {
                          setSectionEditingId(section.id);
                          setSectionForm({
                            courseId: course.id,
                            title: section.title,
                            orderIndex: section.orderIndex,
                          });
                        }}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button className="button danger-button" onClick={() => handleDelete("section", section.id)}>
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="admin-lesson-list">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="admin-lesson-item">
                        <div>
                          <strong>{lesson.title}</strong>
                          <span>
                            Lesson {lesson.orderIndex} · Playlist index {lesson.playlistIndex}
                          </span>
                        </div>
                        <div className="card-actions">
                          <button
                            className="button ghost-button"
                            onClick={() => {
                              setLessonEditingId(lesson.id);
                              setLessonForm({
                                courseId: course.id,
                                sectionId: section.id,
                                title: lesson.title,
                                description: lesson.description,
                                orderIndex: lesson.orderIndex,
                                sectionOrder: lesson.sectionOrder,
                                courseOrder: lesson.courseOrder,
                                playlistIndex: lesson.playlistIndex,
                                durationLabel: lesson.durationLabel,
                                isFreePreview: lesson.isFreePreview,
                                playlistId: lesson.playlistId,
                                youtubeUrl: lesson.youtubeUrl,
                              });
                            }}
                          >
                            <Pencil size={16} />
                            Edit
                          </button>
                          <button className="button danger-button" onClick={() => handleDelete("lesson", lesson.id)}>
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export { AdminPage };
