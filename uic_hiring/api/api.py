import time
from flask import jsonify
from datetime import datetime
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask import request

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uin = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f"Student('{self.name}', '{self.email}')"    

class JobPostings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"JobPosting('{self.title}', '{self.department}')"

class Applications(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_uin = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('job_postings.id'), nullable=False)
    applied_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"Application('{self.student_id}', '{self.job_posting_id}', '{self.status}')"

@app.route('/api/time')
def get_current_time():
    return {'message': "Hello from Flask!"}

@app.route('/api/get_students', methods=['GET'])
def get_students():
    students = Students.query.all()
    return jsonify({
        'students': [
            {'id': s.id, 'uin': s.uin, 'name': s.name, 'email': s.email}
            for s in students
        ]
    })

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    jobs = JobPostings.query.all()
    return jsonify({
        'jobs': [
            {'id': j.id, 'title': j.title, 'department': j.department}
            for j in jobs
        ]
    })

@app.route('/api/apply', methods=['POST'])
def apply():
    data = request.json
    print(data)
    student_uin = data.get('student_uin')

    validUin = Students.query.filter_by(uin=student_uin).first()
    if not validUin:
        return jsonify({'message': 'Invalid UIN'}), 400
    
    job_id = data.get('job_id')
    validJob = JobPostings.query.filter_by(id=job_id).first()
    if not validJob:
        return jsonify({'message': 'Invalid Job ID'}), 400
    
    if(validUin and validJob):
        existingApplication = Applications.query.filter_by(student_uin=student_uin, job_id=job_id).first()
        if existingApplication:
            return jsonify({'message': 'Application already exists'}), 400
        application = Applications(student_uin=student_uin, job_id=job_id, applied_at=datetime.now())
        db.session.add(application)
        db.session.commit()
        return jsonify({'message': 'Application submitted successfully'})
    else:
        return jsonify({'message': 'Invalid UIN or Job ID'}), 400


@app.route('/api/applications', methods=['GET'])
def get_applications():
    applications = Applications.query.all()
    return jsonify({
        'applications': [
            {'id': a.id, 'student_uin': a.student_uin, 'job_id': a.job_id, 'applied_at': a.applied_at}
            for a in applications
        ]
    })

@app.route('/api/delete_application', methods=['DELETE'])
def delete_application():
    data = request.json
    application_id = data.get('application_id')
    application = Applications.query.filter_by(id=application_id).first()
    if not application:
        return jsonify({'message': 'Invalid Application ID'}), 400
    db.session.delete(application)
    db.session.commit()
    return jsonify({'message': 'Application deleted successfully'})

@app.route('/api/edit_job', methods=['PUT'])
def edit_job():
    data = request.json
    job_id = data.get('job_id')
    job = JobPostings.query.filter_by(id=job_id).first()
    if not job:
        return jsonify({'message': 'Invalid Job ID'}), 400
    job.title = data.get('title') if data.get('title') else job.title
    job.department = data.get('department') if data.get('department') else job.department
    db.session.commit()
    return jsonify({'message': 'Job updated successfully'})