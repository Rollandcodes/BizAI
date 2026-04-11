import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service_role key to bypass RLS and use Admin Auth API
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function provisionAdmin() {
  console.log("Creating or finding auth user...");

  const email = 'muhanguzirollands@gmail.com';
  const password = 'Rolland90@';
  const fullName = 'Rolland';
  const orgName = 'CypAI Platform'; // You can change this later in DB

  // 1. Create or get Auth User
  let { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });

  let userId;

  if (authError) {
    if (authError.message.includes("User already registered") || authError.status === 422) {
      console.log("User already exists in Auth. Fetching user ID...");
      // Find user ID using listUsers (since admin API doesn't have getUserByEmail directly easy without scanning)
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error("Error listing users to find existing ID:", listError);
        return;
      }
      const existingUser = usersData.users.find(u => u.email === email);
      if (!existingUser) {
        console.error("Could not find the existing user by email!");
        return;
      }
      userId = existingUser.id;
      
      // Auto-confirm email if it's an existing user
      console.log(`Ensuring email is confirmed for user ${userId}...`);
      const { error: confirmError } = await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true
      });
      if (confirmError) {
        console.error("Failed to confirm existing user email:", confirmError);
      } else {
        console.log("User email confirmed successfully.");
      }
    } else {
      console.error("Failed to create auth user:", authError);
      return;
    }
  } else {
    userId = authData.user.id;
    console.log(`Created new auth user with ID: ${userId}`);
  }

  // 2. Upsert into public.profiles
  console.log(`Upserting profile for user ${userId}...`);
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: fullName
    });

  if (profileError) {
    console.error("Error upserting profile:", profileError);
    return;
  }

  // 3. Upsert into public.organizations
  // Check if an org already exists for this owner
  const { data: existingOrgs, error: orgCheckError } = await supabase
    .from('organizations')
    .select('id')
    .eq('owner_id', userId);

  if (orgCheckError) {
    console.error("Error checking existing organizations:", orgCheckError);
    return;
  }

  if (existingOrgs && existingOrgs.length > 0) {
    console.log(`Organization already exists for profile. Skipping org creation.`);
  } else {
    console.log(`Creating organization '${orgName}' for profile...`);
    const { error: orgError } = await supabase
      .from('organizations')
      .insert({
        owner_id: userId,
        name: orgName,
        plan: 'Business', // Or however you want to mark the admin testing tier
        v3_enabled: true
      });

    if (orgError) {
      console.error("Error creating organization:", orgError);
      return;
    }
  }

  console.log("✅ Super Admin successfully provisioned!");
  console.log(`Login Email: ${email}`);
}

provisionAdmin().catch(err => {
  console.error("Fatal error during provisioning:", err);
});
