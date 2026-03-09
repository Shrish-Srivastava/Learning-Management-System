import { useEffect, useMemo, useState } from "react";
import { Check, Lock, PlayCircle, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";

function CoursePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, refreshProfile, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${slug}`);
        setCourse(data.course);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [slug]);

  const previewLesson = useMemo(
    () =>
      course?.sections
        ?.flatMap((section) => section.lessons)
        ?.find((lesson) => lesson.isFreePreview),
    [course]
  );

  const isPurchased = Boolean(
    course && user?.purchasedCourseIds?.includes(course.id)
  );

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${slug}` } });
      return;
    }

    setBuying(true);
    try {
      await api.post(`/courses/${course.id}/purchase`);
      await refreshProfile();
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return <div className="state-card glass-panel">Loading course details...</div>;
  }

  if (!course) {
    return <div className="state-card glass-panel">Course not found.</div>;
  }

  return (
    <div className="page-stack">
      <section className="course-hero glass-panel">
        <img src={course.thumbnail} alt={course.title} className="course-hero-image" />

        <div className="course-hero-content">
          <p className="eyebrow">{course.category}</p>
          <h1>{course.title}</h1>
          <p className="hero-text">{course.description}</p>

          <div className="course-summary-grid">
            <div className="glass-card">
              <strong>{course.sectionCount}</strong>
              <span>Sections</span>
            </div>
            <div className="glass-card">
              <strong>{course.lessonCount}</strong>
              <span>Lessons</span>
            </div>
            <div className="glass-card">
              <strong>{course.level}</strong>
              <span>Level</span>
            </div>
            <div className="glass-card">
              <strong>Rs. {course.price}</strong>
              <span>One-time unlock</span>
            </div>
          </div>

          <div className="course-cta-row">
            {previewLesson && (
              <Link className="button ghost-button" to={`/learn/${course.slug}/${previewLesson.id}`}>
                <PlayCircle size={16} />
                Watch Free Lesson
              </Link>
            )}
            {isPurchased ? (
              <Link className="button primary-button" to={`/learn/${course.slug}/${previewLesson?.id}`}>
                Continue Course
              </Link>
            ) : (
              <button className="button primary-button" onClick={handlePurchase} disabled={buying}>
                <ShoppingBag size={16} />
                {buying ? "Unlocking..." : `Unlock Full Course for Rs. ${course.price}`}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Curriculum</p>
          <h2>Professional section structure shown exactly as students will see it</h2>
        </div>
        <span className="glass-chip">
          {isPurchased ? "Purchased" : "First lesson free"}
        </span>
      </section>

      <section className="curriculum-grid">
        {course.sections.map((section) => (
          <article key={section.id} className="glass-panel curriculum-card">
            <div className="curriculum-card-header">
              <span>Section {section.orderIndex}</span>
              <h3>{section.title}</h3>
            </div>
            <div className="curriculum-lessons">
              {section.lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-preview-row">
                  <div>
                    {lesson.isFreePreview ? <PlayCircle size={16} /> : <Lock size={16} />}
                  </div>
                  <div>
                    <strong>{lesson.title}</strong>
                    <span>{lesson.durationLabel}</span>
                  </div>
                  {lesson.isFreePreview && <Check size={16} />}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export { CoursePage };
