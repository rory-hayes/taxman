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

Database Schema
--------------

### Core Tables

#### 1. user_profiles
- Primary user information and preferences
```sql
create table public.user_profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    display_name text,
    age_range text not null,
    location text not null,
    job_field text not null,
    monthly_income decimal(10,2),
    monthly_savings_goal decimal(10,2),
    payday_date integer check (payday_date between 1 and 31),
    bank_account_details jsonb,
    preferences jsonb,
    onboarding_completed boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
```

#### 2. payslips
- Stores uploaded payslip information and extracted data
```sql
create table public.payslips (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users on delete cascade not null,
    month date not null,
    tax_year text not null,
    file_name text,
    file_path text,
    gross_pay decimal(10,2) not null,
    net_pay decimal(10,2) not null,
    tax_paid decimal(10,2) not null,
    ni_paid decimal(10,2) not null,
    pension decimal(10,2) default 0,
    other_deductions decimal(10,2) default 0,
    data jsonb not null,
    processed boolean default false,
    processed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, month)
);
```

#### 3. tax_records
- Annual tax summaries and calculations
```sql
create table public.tax_records (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users on delete cascade not null,
    tax_year text not null,
    total_gross_pay decimal(10,2) default 0,
    total_tax_paid decimal(10,2) default 0,
    total_ni_paid decimal(10,2) default 0,
    total_pension decimal(10,2) default 0,
    estimated_annual_tax decimal(10,2),
    last_updated timestamptz default now(),
    created_at timestamptz default now(),
    unique(user_id, tax_year)
);
```

### Financial Management

#### 4. savings_goals
- User savings targets and progress tracking
```sql
create table public.savings_goals (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    target_amount decimal(10,2) not null,
    current_amount decimal(10,2) default 0,
    target_date date,
    category text,
    is_shared boolean default false,
    partner_id uuid references auth.users(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
```

#### 5. bank_statements
- Uploaded bank statement records
```sql
create table public.bank_statements (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users on delete cascade not null,
    statement_date date not null,
    file_name text,
    file_path text,
    processed boolean default false,
    data jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
```

#### 6. transactions
- Individual financial transactions
```sql
create table public.transactions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users on delete cascade not null,
    bank_statement_id uuid references public.bank_statements(id),
    transaction_date date not null,
    description text not null,
    amount decimal(10,2) not null,
    category text,
    type text check (type in ('income', 'expense', 'transfer')),
    created_at timestamptz default now()
);
```

### Notifications & Communication

#### 7. notifications
- System notifications and reminders
```sql
create table public.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users on delete cascade not null,
    type text not null,
    title text not null,
    message text not null,
    read boolean default false,
    data jsonb,
    created_at timestamptz default now()
);
```

### Security & Performance

#### Storage Buckets
- `payslips`: Secure storage for payslip files
- `bank_statements`: Secure storage for bank statement files

#### Indexes
- `idx_payslips_user_month`: Optimize payslip queries by user and month
- `idx_tax_records_user_year`: Optimize tax record queries by user and year
- `idx_transactions_user_date`: Optimize transaction queries by user and date
- `idx_notifications_user_read`: Optimize unread notification queries
- `idx_savings_goals_user`: Optimize savings goal queries by user
- `idx_bank_statements_user_date`: Optimize bank statement queries by user and date

#### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data or shared data (in the case of savings goals with partners).

* * * * *
