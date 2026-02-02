"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = [
    "cornelabshq@gmail.com"
];

export async function checkAndPromoteAdmin() {
    try {
        // 1. Get current user session
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) return;

        // 2. Check if email is in admin list
        if (ADMIN_EMAILS.includes(user.email)) {
            // 3. Promote using admin client
            const adminClient = createAdminClient();

            // Check current role first to avoid unnecessary updates
            const { data: profile } = await adminClient
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                await adminClient
                    .from('profiles')
                    .update({ role: 'admin' })
                    .eq('id', user.id);
            }
        }
    } catch (error) {
        // Silently fail - this is a background check
        console.error('Error in checkAndPromoteAdmin:', error);
    }
}
