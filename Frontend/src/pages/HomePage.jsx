import { useEffect, useState } from "react";
import { ArrowRight, Shield, Sparkles, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { useAuth } from "../context/useAuth";
import { api } from "../lib/api";

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data.courses);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="page-stack">
      <section className="hero-panel glass-panel">
        <div className="hero-copy">
          <p className="eyebrow">Premium LMS Experience</p>
          <h1>SkillUp helps students learn with a focused, paid-course journey.</h1>
          <p className="hero-text">
            Every course is split into a professional 4-section flow with 20
            guided lessons, a free first preview, and a clean learning dashboard
            built around structured video delivery.
          </p>
          <div className="hero-actions">
            <Link className="button primary-button" to={user ? "/dashboard" : "/register"}>
              {user ? "Open My Learning" : "Start Learning"}
              <ArrowRight size={16} />
            </Link>
            <Link className="button ghost-button" to="/login">
              Admin / Student Login
            </Link>
          </div>
        </div>

        <div className="hero-stats-grid">
          <div className="glass-card floating-card">
            <Sparkles size={18} />
            <strong>Designer-focused UI</strong>
            <span>Blur borders, hover motion, compact layouts, and polished cards.</span>
          </div>
          <div className="glass-card floating-card">
            <Video size={18} />
            <strong>YouTube lesson delivery</strong>
            <span>Organized on the LMS side with clear sections and sequential flow.</span>
          </div>
          <div className="glass-card floating-card">
            <Shield size={18} />
            <strong>Preview + paid unlock</strong>
            <span>The first lesson is free, then students unlock the remaining course.</span>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Curated Catalog</p>
          <h2>Structured courses students can actually follow</h2>
        </div>
        <span className="glass-chip">5 professional learning tracks</span>
      </section>

      {loading ? (
        <div className="state-card glass-panel">Loading courses...</div>
      ) : (
        <section className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              purchased={user?.purchasedCourseIds?.includes(course.id)}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export { HomePage };
