# Full-Stack Student Job Marketplace

You are a senior full-stack developer, UI/UX designer, software architect, and QA engineer.

Build a complete, production-quality web application for a **student-focused job marketplace** that connects university students/job seekers with companies and recruiters.

Do not merely create a mockup or static frontend. The application must be functional, connected to a backend/database, and ready to run locally and push to GitHub.

You are free to decide the architecture, project structure, libraries, database design, implementation strategy, and development workflow. Choose technologies that are stable, maintainable, beginner-friendly, and easy to deploy.

---

## Core Product

The platform has two primary user types:

### Students / Job Seekers

Students should be able to:

* Create an account
* Log in and log out
* Create and edit their professional profile
* Upload and manage their CV
* Add education, skills, experience, projects, and portfolio links
* Search for jobs
* Filter and sort jobs
* View job details
* Save/bookmark jobs
* Apply for jobs
* Select a CV when applying
* Submit a cover letter
* Track applications
* View application status
* Manage their account settings

### Companies / Recruiters

Companies should be able to:

* Create a company account
* Log in and log out
* Create and edit a company profile
* Upload a company logo
* Create job postings
* Edit job postings
* Publish/unpublish job postings
* Close or delete job postings
* View applicants
* View candidate profiles
* View/download candidate CVs
* Review applications
* Change application status

---

# Required User Interfaces

Create a complete responsive UI for all major states and flows.

## Public Interface

Include:

* Landing page
* Job search page
* Job detail page
* Company directory
* Company detail page
* Login
* Registration
* About/platform information
* Responsive navigation
* Footer

The landing page should contain:

* Hero section
* Job search
* Featured jobs
* Popular job categories
* Featured companies
* Platform benefits
* Call-to-action sections

---

## Authentication Interface

Create polished interfaces for:

* Login
* Student registration
* Company registration
* Forgot password
* Password reset
* Logout
* Authentication errors
* Validation errors

Registration should clearly distinguish between:

* Student
* Company

Implement proper authentication and authorization.

---

# Student Interface

Create a complete student dashboard.

Include:

* Dashboard overview
* Profile completion indicator
* Recommended jobs
* Saved jobs
* Applied jobs
* Application statistics
* Notifications if appropriate

Student navigation should include:

* Dashboard
* Find Jobs
* Saved Jobs
* Applications
* My Profile
* My CV
* Settings
* Logout

---

## Student Profile

Allow students to manage:

### Personal Information

* Full name
* Avatar
* Email
* Phone
* Location
* Bio

### Education

* University
* Major
* Graduation year
* GPA

### Skills

* Skill name
* Skill level

### Experience

* Company
* Position
* Description
* Start date
* End date

### Projects

* Project name
* Description
* Technologies
* Project URL

### Portfolio / Social Links

* LinkedIn
* GitHub
* Personal portfolio

---

# CV Management

Students must be able to:

* Upload CV
* Replace CV
* Delete CV
* Preview CV when possible
* Download CV
* Select an existing CV when applying

Support common document formats such as PDF and DOC/DOCX.

Implement reasonable file-size and file-type validation.

---

# Job Search

Create a powerful job discovery interface.

Include:

* Keyword search
* Location filter
* Industry/category filter
* Salary filter
* Job type filter
* Experience filter
* Remote/Hybrid/On-site filter
* Sorting
* Pagination or infinite scrolling

Job cards should display:

* Company logo
* Job title
* Company name
* Location
* Salary
* Job type
* Experience
* Posted date
* Save button

---

# Job Detail

A job detail page should contain:

* Job title
* Company
* Company logo
* Location
* Salary
* Job type
* Experience requirement
* Description
* Responsibilities
* Requirements
* Skills
* Benefits
* Deadline
* Apply button
* Save button

Include related jobs and company information where appropriate.

If an unauthenticated user attempts to apply, redirect them to authentication.

---

# Job Application System

Students must be able to apply directly through the platform.

Application form should support:

* CV selection
* Cover letter
* Portfolio URL
* Contact information
* Additional information

After submission, display a clear success state.

Students should have an application management page showing statuses such as:

* Submitted
* Reviewing
* Shortlisted
* Interview
* Accepted
* Rejected

Companies must be able to update application statuses.

---

# Company Interface

Create a complete recruiter/company dashboard.

Include:

* Dashboard overview
* Job posting statistics
* Active jobs
* Closed jobs
* Draft jobs
* Applicant statistics
* Recent applications

Company navigation should include:

* Dashboard
* Job Postings
* Create Job
* Applicants
* Company Profile
* Settings
* Logout

---

# Job Posting Management

Companies should be able to create jobs with:

* Job title
* Description
* Responsibilities
* Requirements
* Benefits
* Location
* Salary range
* Job type
* Experience level
* Required skills
* Application deadline

Support:

* Draft
* Published
* Closed
* Expired

Companies must only be able to modify their own job postings.

---

# Candidate Management

Create an applicant management interface.

Companies should be able to:

* View applicants
* Search/filter applicants
* Open candidate profiles
* View candidate skills
* View education
* View experience
* View projects
* View/download CV
* Change application status

Use a clean recruiter-oriented UI.

---

# Company Profile

Companies should be able to manage:

* Logo
* Company name
* Description
* Industry
* Company size
* Location
* Website
* Contact information
* Social links

The public company page should display current job openings.

---

# Database

Design a proper relational or document-based database appropriate for the application.

At minimum, support entities equivalent to:

* Users
* Student profiles
* Company profiles
* Jobs
* Applications
* Saved jobs
* Skills
* Student skills
* Education
* Experience
* Projects
* CV/files

Use proper relationships, constraints, timestamps, and indexes where appropriate.

---

# Backend / API

Create a real backend API.

Authentication, authorization, CRUD operations, job searching, applications, profile management, and file management must be handled through the backend rather than simulated entirely in frontend state.

Protect private endpoints.

Implement role-based access control.

---

# UI/UX Requirements

The UI should feel like a modern professional job platform designed specifically for students.

Design direction:

* Modern
* Clean
* Minimal
* Professional
* Friendly
* Accessible
* Mobile responsive

Use:

* Consistent spacing
* Strong typography hierarchy
* Reusable components
* Cards
* Clear buttons
* Subtle shadows
* Appropriate border radius
* Good empty states
* Good loading states

Avoid excessive gradients, unnecessary animations, or overly complicated visual effects.

The default interface language should be **Vietnamese**.

Use realistic Vietnamese content instead of lorem ipsum.

---

# Responsive Design

The entire application must work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

Do not simply shrink the desktop layout.

Create appropriate mobile navigation and responsive layouts.

---

# Application States

Every important interface should have proper:

* Loading states
* Skeleton states where appropriate
* Empty states
* Error states
* Success states
* Validation messages
* Confirmation dialogs
* Toast notifications

Do not leave buttons or UI elements that appear functional but do nothing.

---

# Security

Implement reasonable application security including:

* Secure password hashing
* Authentication
* Protected routes
* Role-based authorization
* Input validation
* File validation
* File size limits
* Secure environment variables
* No plaintext passwords
* Proper API authorization
* Prevent users from accessing or modifying other users' private data

---

# Demo Data

Provide realistic seed/demo data.

Include:

* Multiple companies
* At least 20 realistic job postings
* Multiple student profiles
* Skills
* Applications
* Saved jobs

Provide demo accounts for testing.

Example:

Student:

`student@example.com`

Password:

`student123`

Company:

`company@example.com`

Password:

`company123`

If an admin role is implemented, provide a demo admin account as well.

---

# Local Development

The project MUST be easy to run on Windows.

Provide:

`install.bat`

and

`start.bat`

The user should be able to clone the repository, run the installation script, run the start script, and open the website locally without manually executing a long list of commands.

If frontend and backend require separate processes, the `.bat` scripts should handle this automatically.

Use appropriate Windows-compatible commands.

---

# GitHub Readiness

The project must be ready to upload to GitHub.

Include:

* `.gitignore`
* `.env.example`
* `README.md`

Do not commit:

* `node_modules`
* secrets
* passwords
* private environment variables
* unnecessary build artifacts
* private uploaded files

The README must explain:

* Project overview
* Features
* Tech stack
* Requirements
* Installation
* Local development
* Environment variables
* Demo accounts
* Project structure
* API overview
* Database setup
* Git/GitHub setup
* Deployment instructions

---

# Code Quality

Write maintainable production-quality code.

Requirements:

* Strong typing where applicable
* Reusable components
* Modular architecture
* Clear naming
* Separation of concerns
* No unnecessary duplicated code
* No giant monolithic files
* No fake functionality
* No hardcoded data where a real API/database should be used
* No unused dependencies
* No obvious security vulnerabilities

If the repository already contains code, inspect and understand it before making major changes.

Do not unnecessarily rewrite working parts of an existing project.

---

# Testing and Validation

Before considering the project complete, verify that:

* The application starts successfully
* Frontend builds successfully
* Backend starts successfully
* Database works
* Authentication works
* Student registration works
* Company registration works
* Login/logout works
* Protected routes work
* Job search works
* Job filters work
* Job creation works
* Job editing works
* Job publishing works
* Job application works
* CV upload works
* Student application tracking works
* Company applicant management works
* Application status updates work
* Responsive UI works
* No obvious console/runtime errors remain

If something fails, diagnose and fix it rather than simply reporting the failure.

---

# Agent Autonomy

You are responsible for deciding:

* Architecture
* Framework configuration
* Folder structure
* Database technology
* API architecture
* Component architecture
* State management
* Authentication implementation
* Styling system
* Development workflow
* Testing approach

Do not ask unnecessary questions when a reasonable technical decision can be made independently.

Prefer practical, maintainable solutions over unnecessary complexity.

If a feature requires a reasonable implementation decision that was not explicitly specified, make the decision yourself and document it in the README.

---

# REQUIRED FINAL OUTPUT

When the implementation is complete, provide a concise final report containing ONLY the following information:

1. **Project overview**
2. **Tech stack**
3. **Implemented features**
4. **Important routes/pages**
5. **Database overview**
6. **Demo accounts**
7. **How to run locally**
8. **GitHub setup**
9. **Known limitations**, if any

Most importantly:

**Do the actual implementation. Do not only provide an architecture proposal, pseudocode, or instructions.**

The final project must be a working full-stack application that can be run locally, tested, and committed to GitHub.
