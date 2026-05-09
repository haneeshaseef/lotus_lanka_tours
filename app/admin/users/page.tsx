import { createAdminClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createAdminClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, name, role, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = users ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
        <p className="text-sm text-gray-500">{list.length} registered users</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">User</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Email</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Role</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {list.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-sm text-gray-900">{user.name ?? "—"}</p>
                  <p className="text-xs text-gray-400">{user.id.slice(0, 16)}…</p>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-600">{user.email ?? "—"}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.role === "admin"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <p className="text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
