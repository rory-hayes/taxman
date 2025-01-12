-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users profile table
create table public.user_profiles (
    id uuid references auth.users on delete cascade,
    email text unique not null,
    age_range text not null,
    location text not null,
    job_field text not null,
    monthly_savings_goal decimal(10,2),
    payday_date integer check (payday_date between 1 and 31),
    bank_account_details jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    primary key (id)
);

-- Enable RLS (Row Level Security)
alter table public.user_profiles enable row level security;

-- Create RLS policies
create policy "Users can view own profile"
    on public.user_profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on public.user_profiles for update
    using (auth.uid() = id);

-- Create function to handle user creation
create function public.handle_new_user() 
returns trigger as $$
begin
    insert into public.user_profiles (id, email)
    values (new.id, new.email);
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 