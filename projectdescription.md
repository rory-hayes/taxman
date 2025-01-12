Project Goal
------------

To develop a **web and mobile-friendly financial dashboard** that enables users to upload payslips, analyze tax information, and gain actionable financial insights. The application leverages **OCR and AI technologies** to provide a user-friendly experience, helping users understand their finances, track income, and optimize savings while maintaining data privacy and compliance.

Overview
--------

This web application is designed to empower users by providing a personalized financial dashboard that simplifies the management of their payslips, tax obligations, and overall financial health. By leveraging OCR and AI technologies, the application offers detailed insights into payslip data, identifies potential tax savings, and assists users in budgeting and tracking their finances.

Features
--------

### 1\. **Account Creation**

-   **Authentication**:

    -   Email/password and Gmail OAuth options.

-   **Onboarding Process**:

    -   Collect user data: Age range, location, job field, savings goals, payday date, and optional bank account details.

    -   Present a terms and conditions agreement, highlighting that this application provides guidance but not professional tax advice.

### 2\. **Dashboard**

-   **Key Metrics**:

    -   Total salary, total taxes paid, take-home pay, and savings goals.

-   **Graphs & Visualizations**:

    -   Interactive and dynamic graphs/charts displaying:

        -   Tax breakdowns and deductions.

        -   Savings goals progress.

    -   Powered by libraries like Chart.js or Recharts.

-   **File Upload Buttons**:

    -   Payslip and bank statement upload options.

### 3\. **Payslip Analysis**

-   **OCR Integration**:

    -   Extract data from uploaded payslips.

    -   Display extracted details to users for confirmation before submission.

-   **AI Insights**:

    -   Detailed breakdown of:

        -   Taxes paid.

        -   Deductions.

        -   Potential overpayments.

    -   Recommendations on how to claim overpaid tax.

### 4\. **Budgeting**

-   **Budgeting Tool**:

    -   Allocate take-home pay into predefined categories.

    -   Track progress toward savings goals.

-   **Savings Projections**:

    -   Show potential savings growth over time.

### 5\. **Notifications**

-   **Payday Reminders**:

    -   Email reminders for payslip uploads.

-   **Periodic Summaries**:

    -   Monthly financial summaries sent via email.

### 6\. **Bank Statement Integration**

-   **OCR-Based Analysis**:

    -   Extract and categorize transactions from uploaded statements (e.g., income, expenses, savings).

-   **Dashboard Integration**:

    -   Combine bank statement data with payslip data for a holistic financial view.

### 7\. **Data Privacy & Compliance**

-   **Security Measures**:

    -   Encryption of sensitive data.

    -   Secure file storage and retrieval using a proper tool.

-   **Compliance**:

    -   Adherence to GDPR/CCPA standards.

* * * * *

Milestones
----------

### **Milestone 1: Initial Setup and Foundation**

-   **Tasks**:

    1.  Set up a boilerplate locally.

    2.  Configure the tool for authentication (email/password and Gmail OAuth).

    3.  Establish the database schema for user profiles, including:

        -   Age range, location, job field, savings goals, payday date, and optional bank account details.

    4.  Build the onboarding process with terms and conditions.

-   **Outcome**: A functional authentication system and user onboarding flow.

### **Milestone 2: Dashboard Development**

-   **Tasks**:

    1.  Revise the boilerplate's dashboard UI using Tailwind CSS.

    2.  Implement widgets for:

        -   Total salary.

        -   Taxes paid.

        -   Savings goals.

    3.  Add interactive charts (Chart.js or Recharts).

-   **Outcome**: A visually appealing, responsive dashboard.

### **Milestone 3: Payslip Upload and OCR**

-   **Tasks**:

    1.  Add file upload functionality for payslips.

    2.  Integrate OCR using Tesseract or a similar tool.

    3.  Display extracted data to users for confirmation before saving.

-   **Outcome**: Users can upload and process payslips with accurate data extraction.

### **Milestone 4: AI-Powered Insights**

-   **Tasks**:

    1.  Integrate OpenAI API for analyzing confirmed payslip data.

    2.  Display AI-generated insights and tax recommendations.

-   **Outcome**: Personalized insights and actionable advice based on user data.

### **Milestone 5: Budgeting Tool**

-   **Tasks**:

    1.  Build a budgeting tool for allocating take-home pay.

    2.  Display progress toward savings goals.

    3.  Add savings projection graphs.
    4. option to invite a partner to join the account so you can create shared goals and build together financially 

-   **Outcome**: Users can plan and visualize their financial goals effectively.

### **Milestone 6: Bank Statement Integration**

-   **Tasks**:

    1.  Add file upload functionality for bank statements.

    2.  Extract and categorize transactions.

    3.  Integrate bank data into dashboard metrics.

-   **Outcome**: A holistic financial view combining payslip and bank data.

### **Milestone 7: Notifications and Testing**

-   **Tasks**:

    1.  Set up email notifications for payday reminders.

    2.  Implement monthly financial summary emails.

    3.  Conduct thorough testing (unit, integration, and UI).

-   **Outcome**: A polished, fully functional application ready for deployment.

### **Milestone 8: Deployment**

-   **Tasks**:

    1.  Prepare the app for local hosting.

    2.  Deploy to Visualiser for user testing.

    3.  Gather user feedback for further iterations.

-   **Outcome**: A live, testable application accessible to users.

* * * * *

Technical Stack
--------------

### Frontend
- **Framework**: Next.js 14 (React 18+)
  - App Router for modern routing
  - Server Components for improved performance
  - Built-in API routes
- **Styling**: 
  - Tailwind CSS
  - Shadcn/ui (Component Library)
  - Framer Motion (Animations)
- **State Management**: 
  - TanStack Query (React Query) for server state
  - Zustand for client state
- **Charts & Visualization**:
  - Recharts (primary)
  - Chart.js (secondary, for complex visualizations)
- **Forms**:
  - React Hook Form
  - Zod (validation)

### Backend & Infrastructure
- **Database**: 
  - Supabase (PostgreSQL)
  - Redis (caching & session management)
- **Authentication**: 
  - Supabase Auth
  - NextAuth.js for OAuth
- **File Storage**: 
  - Supabase Storage
  - AWS S3 (backup option)
- **OCR Processing**:
  - Tesseract.js
  - AWS Textract (backup option)

### AI & Machine Learning
- **Language Models**:
  - OpenAI API (GPT-4)
  - Langchain for AI orchestration
- **Analytics**:
  - Vercel Analytics
  - PostHog (self-hosted option)

### DevOps & Deployment
- **Hosting**: 
  - Vercel (primary)
  - Docker containers for local development
- **CI/CD**:
  - GitHub Actions
  - Husky for pre-commit hooks
- **Monitoring**:
  - Sentry for error tracking
  - Uptime Robot for monitoring

### Testing
- **Unit Testing**: 
  - Vitest
  - React Testing Library
- **E2E Testing**: 
  - Playwright
- **API Testing**:
  - Postman
  - Thunder Client

### Development Tools
- **Package Manager**: 
  - pnpm (for better dependency management)
- **Code Quality**:
  - ESLint
  - Prettier
  - TypeScript
- **Documentation**:
  - Storybook for component documentation
  - Swagger/OpenAPI for API documentation

* * * * *

Deployment Environments
----------------------

### Local Development Environment
- **Database**:
  - SQLite for local development
  - Docker-compose setup with:
    - Local PostgreSQL instance
    - Redis container
    - MinIO (S3-compatible storage)
- **Environment Variables**:
  - `.env.local` for development settings
  - `.env.example` with dummy values for quick setup
- **Seed Data**:
  - Mock user profiles
  - Sample payslips and bank statements
  - Predefined financial metrics
- **Services**:
  - Mock OpenAI endpoints
  - Fake OCR processing
  - Simulated email service

### Production Environment (Vercel)
- **Database**: 
  - Supabase (PostgreSQL)
  - Redis Cloud
- **Storage**:
  - Supabase Storage
  - AWS S3 (backup)
- **Services**:
  - Live OpenAI API integration
  - Production OCR processing
  - SendGrid for emails
- **Monitoring**:
  - Sentry for error tracking
  - Vercel Analytics
  - Uptime monitoring

### Environment Switching
- **Feature Flags**:
  - Toggle between mock and real services
  - Enable/disable specific features
- **Configuration**:
  - Environment-specific API endpoints
  - Service-level feature toggles
- **Testing**:
  - E2E tests work in both environments
  - Integration tests use local services
  - CI pipeline validates both configurations

* * * * *
