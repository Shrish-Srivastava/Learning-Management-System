import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

function LessonSidebar({ course, currentLessonId }) {
  return (
    <aside className="lesson-sidebar glass-panel">
      <div className="sidebar-header">
        <p className="eyebrow">Course structure</p>
        <h3>{course.title}</h3>
        <span className="glass-chip">
          {course.purchased ? "Purchased" : "First lesson free"}
        </span>
      </div>

      <div className="sidebar-sections">
        {course.sections.map((section) => (
          <section key={section.id} className="sidebar-section">
            <div className="sidebar-section-title">
              <span>Section {section.orderIndex}</span>
              <strong>{section.title}</strong>
            </div>

            <div className="sidebar-lessons">
              {section.lessons.map((lesson) => {
                const isCurrent = currentLessonId === lesson.id;
                const Icon = lesson.locked
                  ? Lock
                  : lesson.isCompleted
                    ? CheckCircle2
                    : PlayCircle;

                return (
                  <Link
                    key={lesson.id}
                    className={`lesson-link ${isCurrent ? "active" : ""} ${lesson.locked ? "locked" : ""}`}
                    to={`/learn/${course.slug}/${lesson.id}`}
                  >
                    <div>
                      <Icon size={16} />
                    </div>
                    <div>
                      <strong>{lesson.title}</strong>
                      <span>{lesson.durationLabel}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}

export { LessonSidebar };
