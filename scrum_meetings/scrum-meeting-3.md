# SCRUM Meeting 3 - March 30, 2026

**Date:** Monday, March 30, 2026
**Time:** 11:30 AM - 11:45 AM (15 minutes)
**Location:** ZACH 310 (Lab)
**Attendees:** Charles Schlichenmeyer, Hunter Garrett, Mathew Nguyen, Kent Le, Stepan Kuzmin, Caleb Santos

---

## What did you do since the last meeting?

- **Charles:** Merged PR #10 (cashier interface) and PR #11 (menu board) into main. Reviewed code and resolved integration issues between branches.
- **Hunter:** Continued refining the self-serve kiosk. Began working on the kitchen display view implementation.
- **Mathew:** Completed the bare-bones menu board with item display and pricing. Added comments to the code for clarity. Opened and merged PR via #11 and follow-up fixes through PRs #14, #15.
- **Kent:** Built the mock frontend for the manager interface with pages for employee management and inventory. Applied styling and recoloring to match the project theme. Updated the backend README to document the employee database. Merged via PR #13.
- **Stepan:** Completed the cashier interface with a customization modal for modifying orders. Merged via PR #10.
- **Caleb:** Worked on kitchen interface frontend components. Attempted initial implementation and pushed code for team review.

## What are you planning to do today (final sprint day)?

- **Charles:** Resolve CORS issues blocking the production frontend from communicating with the backend API. Implement dynamic origin handling and Vercel configuration for proper CORS headers.
- **Hunter:** Complete the kitchen display view with real-time order tracking so kitchen staff can see and manage incoming orders.
- **Mathew:** Fix remaining menu board display bugs and ensure the fetch URL points to the correct production API endpoint.
- **Kent:** Connect the manager and employee management pages to the backend using the API service layer so data is pulled from the database instead of hardcoded.
- **Stepan:** Add order numbers to the checkout process, implement an item count badge on the order panel, and add an Escape key shortcut to close the customization modal.
- **Caleb:** Support the kitchen interface implementation and assist with final integration testing.

## Are there any blockers?

- CORS configuration is blocking frontend-to-backend communication in production. Charles is actively debugging the Vercel CORS headers and dynamic origin allowlist to unblock the team.
- The menu board fetch URL needs to be updated to use the production API base URL instead of localhost, which is causing issues in the deployed version.
- Connecting the manager pages to the backend requires the API service layer to be fully set up, which Kent is working through.
