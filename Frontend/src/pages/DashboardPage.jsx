import { useEffect, useState } from "react";
import { BookOpenCheck, CirclePlay, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { useAuth } from "../context/useAuth";
import { api } from "../lib/api";

function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data.courses);

        const purchasedCourses = data.courses.filter((course) =>
          user?.purchasedCourseIds?.includes(course.id)
        );

        const progressResponses = await Promise.all(
          purchasedCourses.map((course) =>
            api.get(`/progress/courses/${course.id}`).then((response) => [
              course.id,
              response.data,
            ])
          )
        );

        setProgressMap(Object.fromEntries(progressResponses));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user?.purchasedCourseIds]);

  const purchasedCourses = courses.filter((course) =>
    user?.purchasedCourseIds?.includes(course.id)
  );

  return (
    <div className="page-stack">
      <section className="hero-panel glass-panel compact-hero">
        <div className="hero-copy">
          <p className="eyebrow">My learning hub</p>
          <h1>Welcome back, {user?.name}</h1>
          <p className="hero-text">
            Track purchased courses, jump back into your last lesson, and keep
            the learning flow moving.
          </p>
        </div>

        <div className="hero-stats-grid slim-grid">
          <div className="glass-card floating-card">
            <BookOpenCheck size={18} />
            <strong>{purchasedCourses.length}</strong>
            <span>Purchased courses</span>
          </div>
          <div className="glass-card floating-card">
            <CirclePlay size={18} />
            <strong>{courses.length}</strong>
            <span>Available tracks</span>
          </div>
          <div className="glass-card floating-card">
            <Sparkles size={18} />
            <strong>Premium</strong>
            <span>Focused learning experience</span>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="state-card glass-panel">Loading your courses...</div>
      ) : purchasedCourses.length > 0 ? (
        <section className="dashboard-grid">
          {purchasedCourses.map((course) => (
            <div key={course.id} className="dashboard-course-card glass-panel">
              <CourseCard course={course} purchased />
              <div className="dashboard-progress">
                <strong>Progress: {progressMap[course.id]?.percentComplete || 0}%</strong>
                <div className="progress-bar">
                  <span style={{ width: `${progressMap[course.id]?.percentComplete || 0}%` }} />
                </div>
                <p>
                  Completed {progressMap[course.id]?.completedLessons || 0} of{" "}
                  {progressMap[course.id]?.totalLessons || course.lessonCount} lessons
                </p>
                <div className="card-actions">
                  <Link className="button primary-button" to={`/courses/${course.slug}`}>
                    Continue Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="state-card glass-panel">
          <h3>No purchased courses yet</h3>
          <p>
            Browse the catalog, preview the first lesson for free, and unlock a
            course when you are ready.
          </p>
          <Link className="button primary-button" to="/">
            Explore courses
          </Link>
        </div>
      )}
    </div>
  );
}

export { DashboardPage };
