alter table auth.users
add column display_name text;

-- Add a trigger to ensure display_name is set during registration
create or replace function auth.handle_new_user() 
returns trigger as $$
begin
  update auth.users
  set display_name = coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure auth.handle_new_user(); 