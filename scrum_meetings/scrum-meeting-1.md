# SCRUM Meeting 1 - March 27, 2026

**Date:** Thursday, March 27, 2026
**Time:** 11:30 AM - 11:45 AM (15 minutes)
**Location:** ZACH 310 (Lab)
**Attendees:** Charles Schlichenmeyer, Hunter Garrett, Mathew Nguyen, Kent Le, Stepan Kuzmin, Caleb Santos

---

## What did you do since the last meeting (backlog creation)?

- **Charles:** Set up the project repository with boilerplate frontend (Next.js) and backend (NestJS) code. Deployed the application to Vercel. Created the portal landing page with responsive card layout. Integrated the PostgreSQL database into the backend configuration. Updated the README with tech stack details, setup instructions, and production deployment links.
- **Hunter:** Cloned the repository and set up the local development environment. Reviewed the backend API structure and started planning the self-serve customer kiosk.
- **Mathew:** Set up the local development environment and reviewed the frontend project structure. Began researching the Next.js App Router for the menu board implementation.
- **Kent:** Cloned the repo and configured the local environment. Started planning the employee database schema and manager interface.
- **Stepan:** Set up the development environment locally. Reviewed the existing frontend code and began planning the cashier interface layout.
- **Caleb:** Set up the local environment and reviewed the project structure. Started looking into the kitchen display interface requirements.

## What are you planning to do before the next meeting?

- **Charles:** Build the Orders API endpoint in the backend to support creating and retrieving orders from the database.
- **Hunter:** Develop an initial MVP of the self-serve customer kiosk with a working frontend and backend connection for placing orders.
- **Mathew:** Start building the menu board frontend page, including component files and page layout.
- **Kent:** Create the employee database schema with columns for id, name, role, wage, shift, work status, and email.
- **Stepan:** Begin implementing the cashier interface with item selection and order management.
- **Caleb:** Research the kitchen display interface and begin outlining frontend components.

## Are there any blockers?

- Team members need to make sure their local `.env` files are configured correctly with the shared database credentials to connect to the remote PostgreSQL instance.
- Need to coordinate on the Orders API request/response format so the frontend kiosk and cashier views can integrate smoothly with the backend.
