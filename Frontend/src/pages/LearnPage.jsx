import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LessonSidebar } from "../components/LessonSidebar";
import { useAuth } from "../context/useAuth";
import { api } from "../lib/api";

function LearnPage() {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadLesson = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: treeData }, { data: lessonData }] = await Promise.all([
        api.get(`/courses/${slug}/tree`),
        api.get(`/courses/${slug}/lessons/${lessonId}`),
      ]);

      setCourse(treeData.course);
      setLesson(lessonData.lesson);

      if (!lessonData.lesson.locked) {
        await api.post(`/progress/lessons/${lessonId}`, {
          lastPositionSecs: 0,
          isCompleted: lessonData.lesson.isCompleted,
        });
      }

      const progressResponse = await api.get(
        `/progress/courses/${lessonData.lesson.courseId}`
      );
      setProgress(progressResponse.data);
    } finally {
      setLoading(false);
    }
  }, [lessonId, slug]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  const embedUrl = useMemo(() => {
    if (!lesson) {
      return "";
    }

    return `https://www.youtube.com/embed/videoseries?list=${lesson.playlistId}&index=${lesson.playlistIndex}&rel=0`;
  }, [lesson]);

  const handlePurchase = async () => {
    setProcessing(true);
    try {
      await api.post(`/courses/${lesson.courseId}/purchase`);
      await refreshProfile();
      await loadLesson();
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    setProcessing(true);
    try {
      await api.post(`/progress/lessons/${lesson.id}`, {
        lastPositionSecs: lesson.lastPositionSecs || 0,
        isCompleted: true,
      });
      await loadLesson();

      if (lesson.nextLessonId) {
        navigate(`/learn/${slug}/${lesson.nextLessonId}`);
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="state-card glass-panel">Preparing your lesson view...</div>;
  }

  if (!course || !lesson) {
    return <div className="state-card glass-panel">Lesson not found.</div>;
  }

  return (
    <div className="learn-layout">
      <LessonSidebar course={course} currentLessonId={lesson.id} />

      <div className="learn-main">
        <section className="video-shell glass-panel">
          <div className="video-topbar">
            <div>
              <p className="eyebrow">Now learning</p>
              <h1>{lesson.title}</h1>
              <p>{lesson.description}</p>
            </div>
          </div>

          {lesson.locked ? (
            <div className="locked-state">
              <Lock size={28} />
              <h3>Lesson access restricted</h3>
              <p>{lesson.lockReason}</p>
              <button className="button primary-button" onClick={handlePurchase} disabled={processing}>
                <ShoppingBag size={16} />
                {processing ? "Processing access..." : "Unlock full course"}
              </button>
            </div>
          ) : (
            <>
              <div className="video-frame">
                <iframe
                  src={embedUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="lesson-info-grid">
                <article className="glass-card lesson-info-card">
                  <p className="eyebrow">Lesson Overview</p>
                  <h3>{lesson.title}</h3>
                  <p>
                    {lesson.description}
                  </p>
                </article>

                <article className="glass-card lesson-info-card">
                  <p className="eyebrow">Learning Outcomes</p>
                  <h3>What this lesson covers</h3>
                  <ul className="lesson-outcomes">
                    <li>Review the primary topic introduced in this lesson.</li>
                    <li>Build the context required for the next lesson in sequence.</li>
                    <li>Strengthen your understanding as part of the wider course pathway.</li>
                  </ul>
                </article>
              </div>

              <div className="video-actions">
                <div className="progress-meta">
                  <strong>Course progress: {progress?.percentComplete || 0}%</strong>
                  <div className="progress-bar">
                    <span style={{ width: `${progress?.percentComplete || 0}%` }} />
                  </div>
                  <small>
                    Mark the lesson as complete after watching to unlock the next step in the course.
                  </small>
                </div>

                <div className="video-button-row">
                  {lesson.previousLessonId ? (
                    <Link className="button ghost-button" to={`/learn/${slug}/${lesson.previousLessonId}`}>
                      <ArrowLeft size={16} />
                      Previous
                    </Link>
                  ) : (
                    <Link className="button ghost-button" to={`/courses/${slug}`}>
                      <ArrowLeft size={16} />
                      Course Overview
                    </Link>
                  )}

                  <button className="button primary-button" onClick={handleComplete} disabled={processing || lesson.isCompleted}>
                    <CheckCircle2 size={16} />
                    {lesson.isCompleted ? "Completed" : processing ? "Saving..." : "Mark as Complete"}
                  </button>

                  {lesson.nextLessonId && (
                    <Link className="button ghost-button" to={`/learn/${slug}/${lesson.nextLessonId}`}>
                      Next
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export { LearnPage };
