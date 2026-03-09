import { useEffect, useState } from "react";
import { ArrowLeft, BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { useAuth } from "../context/useAuth";
import { api } from "../lib/api";

function PurchasedCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(
          data.courses.filter((course) => user?.purchasedCourseIds?.includes(course.id))
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user?.purchasedCourseIds]);

  return (
    <div className="page-stack">
      <section className="hero-panel glass-panel compact-hero">
        <div className="hero-copy">
          <p className="eyebrow">Course Library</p>
          <h1>Your purchased SkillUp courses</h1>
          <p className="hero-text">
            Access all unlocked courses in one place and return directly to the
            programs you are currently studying.
          </p>
          <div className="hero-actions">
            <Link className="button ghost-button" to="/dashboard">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="hero-stats-grid slim-grid">
          <div className="glass-card floating-card">
            <BookOpenCheck size={18} />
            <strong>{courses.length}</strong>
            <span>Purchased courses</span>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="state-card glass-panel">Loading your course library...</div>
      ) : courses.length > 0 ? (
        <section className="course-grid wide-course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} purchased />
          ))}
        </section>
      ) : (
        <div className="state-card glass-panel">
          <h3>No purchased courses yet</h3>
          <p>Unlock a course and it will appear here in your personal library.</p>
          <Link className="button primary-button" to="/">
            Browse Catalogue
          </Link>
        </div>
      )}
    </div>
  );
}

export { PurchasedCoursesPage };
