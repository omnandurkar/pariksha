# Pariksha - Full Shot Testing Guide

This guide describes the complete end-to-end flow of the Pariksha application, covering both Admin and Student roles. Follow these steps to verify all features are working correctly.

---

## 1. Setup & Pre-requisites

1.  **Database**: Ensure your database is running and reachable.
2.  **Server**: Run `npm run dev` to start the application.
3.  **Accounts**: You will need at least one **Admin** account and one **Student** account.

---

## 2. Admin Workflow (Preparation)

**Goal**: Create an exam and assign it to students.

1.  **Login as Admin**: Go to `/auth/login` and sign in with admin credentials.
2.  **Dashboard Overview**: Verify you land on `/admin/dashboard`. Check the stats cards and charts.
3.  **Create Exam**:
    *   Navigate to **Exams** (`/admin/exams`).
    *   Click **"Create Exam"**.
    *   Fill details: Title ("Math Final"), Duration (e.g., 60 mins), Passing % (e.g., 40).
    *   *Check*: The new exam should appear in the list as "Draft".
4.  **Add Questions**:
    *   Click on the exam title to manage it.
    *   Use the **"Add Question"** form to add at least 2 questions.
    *   Set marks for each question.
5.  **Assign Students**:
    *   On the exam management page, locate the **"Assignments"** section.
    *   Use **"Select Students"** to assign specific students OR **"Assign Group"** if you have groups.
6.  **Activate Exam**:
    *   Click the **"Edit Exam"** icon (near the title).
    *   Toggle **"Active"** to ON. Save changes.
    *   *Check*: Status badge changes to "Active".

---

## 3. Student Workflow (Execution)

**Goal**: Login, take the exam, and submit it.

1.  **Login as Student**: Open an Incognito window (or logout admin) and login as a student.
2.  **Dashboard**:
    *   You should see "Math Final" under **"Active Exams"**.
    *   *Check*: Status should say "Active Now" or "Start Exam".
3.  **Start Exam**:
    *   Click **"Start Exam"**. Read instructions.
    *   Click **"I am ready to begin"**.
4.  **Take Exam**:
    *   **Answer Questions**: Select options for the questions you added.
    *   **Navigation**: Use "Next", "Previous", or the Question Palette to move around.
    *   **Mark for Review**: Flag a question and see if it turns purple in the palette.
    *   *Test Robustness*: Try reloading the page. You should resume exactly where you left off.
5.  **Submit**:
    *   Click **"Finish Exam"**. Confirm the modal.
    *   *Check*: You are redirected to the Dashboard. The exam card now says "Results hidden by admin" (unless auto-published).

---

## 4. Admin Workflow (Results & Audit)

**Goal**: View results, audit the student's attempt, and publish scores.

1.  **Switch to Admin**.
2.  **Audit Logs**:
    *   Click the **History Icon** (clock) in the top-right of the dashboard header.
    *   *Check*: You should see logs like "Created exam 'Math Final'", "Updated exam", "Student started exam" (if logged).
3.  **View Results**:
    *   Go to **Results** (`/admin/results`).
    *   Click on "Math Final".
    *   You should see the student's attempt listed with their score.
4.  **Review Attempt**:
    *   Click **"Review"** on the student's row.
    *   See their specific answers. Verify the "Answer Sheet" view.
5.  **Publish Results**:
    *   Go back to the Exam Management page (`/admin/exams` -> "Math Final").
    *   Toggle **"Declare Results"** to ON.
    *   *Check*: A toast confirms "Results Published".

---

## 5. Student Workflow (Feedback)

**Goal**: View the published result.

1.  **Switch to Student**.
2.  **Check Result**:
    *   Refresh the Dashboard.
    *   The "Math Final" card should now show a green **"View Results"** button.
    *   Click it to see the detailed scorecard (Marks, Percentage, Pass/Fail status).

---

## 6. Advanced Flows (Retests & Requests)

1.  **Request Access (New User)**:
    *   Logout. Click **"Request Access"** on login page.
    *   Fill name, email, and message. Submit.
    *   *Admin Side*: Go to **Access Requests** (`/admin/access-requests`). Approve the request.
2.  **Retest Request**:
    *   As a student, in the Result View, click **"Request Retest"** (if implemented/visible).
    *   *Admin Side*: Go to **Results** -> **Retest Requests**. Approve it.
    *   *Check*: Student can take the exam again.
