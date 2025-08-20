import { useEffect, useState } from 'react'
import { apiFetch } from '../api'

type Student = { id: number; firstName: string; lastName: string }
type Course = { id: number; code: string; title: string }

export function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const s = await apiFetch<Student[]>('/students')
        setStudents(s)
        const c = await apiFetch<Course[]>('/courses')
        setCourses(c)
      } catch (e) {
        setErr((e as Error).message)
      }
    })()
  }, [])

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, Arial' }}>
      <h1>Admin Dashboard</h1>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <section>
        <h2>Students</h2>
        <ul>
          {students.map(s => (<li key={s.id}>{s.firstName} {s.lastName}</li>))}
        </ul>
      </section>
      <section>
        <h2>Courses</h2>
        <ul>
          {courses.map(c => (<li key={c.id}>{c.code} - {c.title}</li>))}
        </ul>
      </section>
    </div>
  )
}
