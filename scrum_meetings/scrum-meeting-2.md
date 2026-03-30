# SCRUM Meeting 2 - March 28, 2026

**Date:** Friday, March 28, 2026
**Time:** 10:00 AM - 10:15 AM (15 minutes)
**Location:** ZACH 310 (Lab)
**Attendees:** Charles Schlichenmeyer, Hunter Garrett, Mathew Nguyen, Kent Le, Stepan Kuzmin, Caleb Santos

---

## What did you do since the last meeting?

- **Charles:** Implemented the Orders API endpoints including `createOrder` and `getOrders` in the backend. Refactored the OrdersController. Fixed README formatting for the `.env` section. Merged PR #7 and PR #8.
- **Hunter:** Built a working MVP of the self-serve customer kiosk with full backend connection. Orders placed through the kiosk now update the database correctly. Merged via PR #9.
- **Kent:** Created the employee database schema with columns for id, name, role, wage, shift, work status, and email. Added an email column for potential Google OAuth login support.
- **Mathew:** Created the initial menu board component files and page layout. Got a working version of the menu board displaying items from the database.
- **Stepan:** Started working on the cashier interface, building out the layout and item selection components.
- **Caleb:** Contributed initial project files and began exploring the kitchen display interface structure.

## What are you planning to do before the next meeting?

- **Charles:** Review and merge incoming pull requests for the menu board and cashier interface. Address any deployment or CORS issues that arise.
- **Hunter:** Polish the self-serve kiosk UI and test edge cases in the ordering flow.
- **Mathew:** Finish the bare-bones menu board with proper item display and pricing. Add code comments and clean up. Open a PR for review.
- **Kent:** Build the mock frontend for the manager interface with navigation between management sub-pages. Begin styling and layout work.
- **Stepan:** Complete the cashier interface with a customization modal for order modifications. Open a PR for review.
- **Caleb:** Continue working on the kitchen display interface frontend components.

## Are there any blockers?

- The menu board needs toppings pricing logic implemented, which depends on how the backend returns item customization data.
- Need to finalize the order data model so all frontend views (kiosk, cashier, kitchen) are using a consistent format when interacting with the Orders API.
- Some team members are running into minor merge conflicts when pulling from main due to concurrent work on shared files.
