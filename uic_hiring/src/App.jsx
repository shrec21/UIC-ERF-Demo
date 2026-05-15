import { useState, useEffect } from 'react'
import './App.css'


function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const uin = e.target.uin.value
    console.log(uin)

    const jobId = e.target.jobId.value
    console.log(jobId)

    fetch('/api/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_uin: uin, job_id: jobId }),
    })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to apply')
      return res.json()
    })

    console.log('Form submitted', uin, jobId)
  }

  const handleDeleteApplication = (applicationId) => {
    fetch('/api/delete_application', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ application_id: applicationId }),
    })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to delete application')
      return res.json()
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false))
  }

  const handleEditJob = (e) => {
    e.preventDefault()
    const jobId = e.target.jobId.value
    console.log(jobId)

    const title = e.target.title.value
    console.log(title)

    const department = e.target.department.value
    console.log(department)

    fetch('/api/edit_job', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_id: jobId, title: title, department: department }),
    })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to edit job')
      return res.json()
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false))
  }

  useEffect(() => {
  fetch('/api/get_students', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load students')
      return res.json()
    })
    .then((json) => setStudents(json.students))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/applications', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load applications')
      return res.json()
    })
    .then((json) => setApplications(json.applications))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false))
  }, [handleSubmit])


  useEffect(() => {
    fetch('/api/jobs', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load jobs')
      return res.json()
    })
    .then((json) => setJobs(json.jobs))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false))
  }, [])


  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return (
    <>
    <h1 align="center">UIC Hiring</h1>
    <div>
      <h2 align="left">Students</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>UIN</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.uin}</td>
            <td>{student.name}</td>
            <td>{student.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    <br />
    <div>
      <h2 align="left">Job Postings</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id}>
            <td>{job.id}</td>
            <td>{job.title}</td>
            <td>{job.department}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <br />
    <div>
      <h2 align="left">Applications</h2>'
      
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Student UIN</th>
          <th>Job ID</th>
          <th>Applied At</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application) => (
          <tr key={application.id}>
            <td>{application.id}</td>
            <td>{application.student_uin}</td>
            <td>{application.job_id}</td>
            <td>{application.applied_at}</td>
            <td><button onClick={() => handleDeleteApplication(application.id)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>

    <h1>Apply for a job</h1>
    <form onSubmit={handleSubmit}>
    <label>UIN:</label>
      <input type="number" name="uin" defaultValue="" />
      <label>Job ID:</label>
      <input type="number" name="jobId" defaultValue="" />
      <button type="submit">Submit</button>
    </form>


    <h1>Edit a job</h1>
    <form onSubmit={handleEditJob}>
    <label>Job ID:</label>
      <input type="number" name="jobId" defaultValue="" />
      <label>Title:</label>
      <input type="text" name="title" defaultValue="" />
      <label>Department:</label>
      <input type="text" name="department" defaultValue="" />
      <button type="submit">Submit</button>
    </form>


    </div>

    
    </>
  )
}

export default App
