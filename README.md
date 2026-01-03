# Pariksha
> *Clarity over Complexity. Exams, made human.*

Pariksha is a modern, secure, and student-centric examination platform designed to make the assessment process fair, calm, and reliable. It bridges the gap between strict integrity and a respectful user experience.

## ✨ Key Features

### For Students
- **Dashboard**: A personalized space to view upcoming, active, and completed exams.
- **My Journey**: Visual analytics to track your progress and performance over time.
- **Exam Player**: A distraction-free, robust exam interface that auto-saves progress.
- **Instant Results**: View detailed performance breakdowns immediately after results are declared.
- **Request Access**: Simple flow to request an account if you are not yet registered.

### For Administrators
- **Exam Management**: Create, edit, and schedule exams with flexible configurations (duration, passing marks, etc.).
- **User Management**: Manage students and organize them into groups for easy assignment.
- **Comprehensive Audit Logs**: Every critical action (creating exams, deleting students, etc.) is logged for accountability.
- **Result Management**: Control exactly when results are published. Approve or deny retest requests.
- **Analytics**: High-level dashboard insights into pass rates, active exams, and student engagement.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/pariksha.git
    cd pariksha
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    Create a `.env` file and configure your database URL and NextAuth secret.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛡️ Access Control
- **Student**: Can only view assigned exams and their own results.
- **Admin**: Has full access to manage the platform. (Visit `/admin/dashboard` after logging in as admin).

---
*Built with care by [Your Name/Developer Name].*
