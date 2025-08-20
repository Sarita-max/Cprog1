import { useEffect, useState } from 'react'
import { apiFetch } from '../api'

type Course = { id: number; code: string; title: string }
type Enrollment = { course: Course }
type Student = { id: number; firstName: string; lastName: string; enrollments: Enrollment[] }

export function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const me = await apiFetch<Student>('/students/me')
        setStudent(me)
      } catch (e) {
        setErr((e as Error).message)
      }
    })()
  }, [])

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, Arial' }}>
      <h1>Student Dashboard</h1>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      {student && (
        <>
          <h2>{student.firstName} {student.lastName}</h2>
          <h3>Enrolled Courses</h3>
          <ul>
            {student.enrollments?.map((e, idx) => (
              <li key={idx}>{e.course.code} - {e.course.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
