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
          <p className="eyebrow">Structured Learning Platform</p>
          <h1>Professional online courses designed for clear, structured progress.</h1>
          <p className="hero-text">
            SkillUp organizes each course into a carefully sequenced learning
            path with guided lessons, preview access, and a focused dashboard
            built for consistent progress.
          </p>
          <div className="hero-actions">
            <Link className="button primary-button" to={user ? "/dashboard" : "/register"}>
              {user ? "Go to My Learning" : "Get Started"}
              <ArrowRight size={16} />
            </Link>
            <Link className="button ghost-button" to="/login">
              Sign In
            </Link>
          </div>
        </div>

        <div className="hero-stats-grid">
          <div className="glass-card floating-card">
            <Sparkles size={18} />
            <strong>Refined interface</strong>
            <span>Clean layouts, polished card design, and a distraction-free learning experience.</span>
          </div>
          <div className="glass-card floating-card">
            <Video size={18} />
            <strong>Structured video delivery</strong>
            <span>Lessons are organized into clear sections with a consistent sequence for every course.</span>
          </div>
          <div className="glass-card floating-card">
            <Shield size={18} />
            <strong>Preview-based enrollment</strong>
            <span>Students can access the first lesson before unlocking the complete course experience.</span>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Course Catalogue</p>
          <h2>Explore curated learning paths across core technical subjects</h2>
        </div>
        <span className="glass-chip">Five curated learning tracks</span>
      </section>

      {loading ? (
        <div className="state-card glass-panel">Loading course catalogue...</div>
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
