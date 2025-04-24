-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create storage buckets for file uploads
insert into storage.buckets (id, name, public) values 
('payslips', 'payslips', false),
('bank_statements', 'bank_statements', false);

-- Create user profiles table
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
    preferences jsonb default '{
        "currency": "GBP",
        "dateFormat": "DD/MM/YYYY",
        "theme": "system"
    }'::jsonb,
    onboarding_completed boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create payslips table
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

-- Create tax records table
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

-- Create savings goals table
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

-- Create bank statements table
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

-- Create transactions table
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

-- Create notifications table
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

-- Create function to handle updated_at columns
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id, email)
    values (new.id, new.email);
    return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger update_user_profiles_updated_at
    before update on public.user_profiles
    for each row execute function public.update_updated_at_column();

create trigger update_payslips_updated_at
    before update on public.payslips
    for each row execute function public.update_updated_at_column();

create trigger update_savings_goals_updated_at
    before update on public.savings_goals
    for each row execute function public.update_updated_at_column();

create trigger update_bank_statements_updated_at
    before update on public.bank_statements
    for each row execute function public.update_updated_at_column();

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Enable Row Level Security
alter table public.user_profiles enable row level security;
alter table public.payslips enable row level security;
alter table public.tax_records enable row level security;
alter table public.savings_goals enable row level security;
alter table public.bank_statements enable row level security;
alter table public.transactions enable row level security;
alter table public.notifications enable row level security;

-- Create RLS Policies
create policy "Users can view own profile"
    on public.user_profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on public.user_profiles for update
    using (auth.uid() = id);

create policy "Users can manage own payslips"
    on public.payslips for all
    using (auth.uid() = user_id);

create policy "Users can manage own tax records"
    on public.tax_records for all
    using (auth.uid() = user_id);

create policy "Users can manage own savings goals"
    on public.savings_goals for all
    using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Users can manage own bank statements"
    on public.bank_statements for all
    using (auth.uid() = user_id);

create policy "Users can manage own transactions"
    on public.transactions for all
    using (auth.uid() = user_id);

create policy "Users can manage own notifications"
    on public.notifications for all
    using (auth.uid() = user_id);

-- Create indexes for performance
create index idx_payslips_user_month on public.payslips(user_id, month);
create index idx_tax_records_user_year on public.tax_records(user_id, tax_year);
create index idx_transactions_user_date on public.transactions(user_id, transaction_date);
create index idx_notifications_user_read on public.notifications(user_id, read);
create index idx_savings_goals_user on public.savings_goals(user_id);
create index idx_bank_statements_user_date on public.bank_statements(user_id, statement_date); 