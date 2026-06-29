# My Project Journey

## Date: 25 June 2026

Today I started my Employee Leave Management System project.

### What I completed today

* Understood the project requirements.
* Divided the project into small phases.
* Created a GitHub repository.
* Created the basic folder structure.
* Added README.
* Wrote the SRS document.
* Created HLD documentation.
* Created ERD documentation.
* Generated HLD and ERD diagrams.
* Started Django backend setup.

---

### What I learned

I learned that a real software project should not start with coding.

The correct order is:

Requirements
→ Documentation
→ System Design
→ Database Design
→ Backend
→ Frontend
→ Testing
→ Deployment

---

### Problems I faced

I accidentally created the Django project outside the backend folder.

This was because I created the project from the wrong directory.

---

### Current Status

Documentation is almost complete.

Backend setup has started.

Coding has not started yet.

---

### Next Task

Fix the backend folder structure if needed.

Then create Django apps:

* accounts
* employees
* leaves
* holidays
* reports

---

### Notes for Future Me

Whenever I return to this project, I should first open this file.

Then check TODO.md.

Then continue from the "Next Task" section.

There is no need to remember everything because everything is written here.

## Date: 30 June 2026

### What I completed today

* Fixed the project folder structure.
* Moved `manage.py` into the `backend` folder.
* Recreated the virtual environment inside `backend`.
* Reinstalled Django.
* Verified that the project runs correctly.

### Why I did this

Keeping all backend-related files inside one folder makes the project cleaner, easier to maintain, and follows common Django project organization.

### Next Task

* Create Django apps.
* Register them in `settings.py`.
* Start building the database models.
