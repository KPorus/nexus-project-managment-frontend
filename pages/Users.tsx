import React, { useEffect, useState } from "react";
import { Role, UserStatus } from "../types";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { RootState } from "../store/store";
import {
  fetchAllUsers,
  inviteUser,
  updateUser,
} from "../store/slices/helper/dataThunks";

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading: usersLoading } = useAppSelector(
    (state: RootState) => state.data
  );

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteRole, setInviteRole] = useState<Role>(Role.STAFF);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const currentUsers = users?.users || [];
  const total = users?.total || 0;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    dispatch(fetchAllUsers({ page, limit }));
  }, [dispatch, page, limit]);

  const handleUpdate = (
    id: string,
    field: "status" | "role",
    value: UserStatus | Role
  ) => {
    dispatch(
      updateUser({
        id,
        [field]: value,
      })
    );
    dispatch(fetchAllUsers({ page, limit }));
  };
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const result = await dispatch(
        inviteUser({ email: inviteEmail, role: inviteRole })
      )
      if(result){
        alert("Invitation success")
      }
      setInviteEmail("");
      setIsInviteModalOpen(false);
      setInviteRole(Role.STAFF);
    } catch (error: any) {
      alert(error.message || "Invite failed");
    }
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteEmail("");
    setInviteRole(Role.STAFF);
  };

  if (usersLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          User Management ({total})
        </h2>
        <Button onClick={() => setIsInviteModalOpen(true)}>Invite User</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name / Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentUsers.map((user) => (
              <tr key={`${user.email}-${user.status}-${user.role}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.email.split("@")[0]}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === UserStatus.ACTIVE
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    // Role change
                    onChange={(e) =>
                      handleUpdate(user.id, "role", e.target.value as Role)
                    }
                    className="bg-transparent border border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-primary focus:border-primary"
                  >
                    {Object.values(Role).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() =>
                      handleUpdate(
                        user.id,
                        "status",
                        user.status === UserStatus.ACTIVE
                          ? UserStatus.INACTIVE
                          : UserStatus.ACTIVE
                      )
                    }
                    className={` ${
                      user.status === UserStatus.ACTIVE
                        ? "text-red-600 hover:text-red-900"
                        : "text-green-600 hover:text-green-900"
                    } hover:underline`}
                  >
                    {user.status === UserStatus.ACTIVE
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">{currentUsers.length}</span> of{" "}
                <span className="font-medium">{total}</span> (
                {Math.ceil(total / limit)} pages)
              </p>
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                variant="secondary"
                size="sm"
                className="rounded-r-none"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300">
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                variant="secondary"
                size="sm"
                className="rounded-l-none"
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        title="Invite New User"
      >
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                {Object.values(Role).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={closeInviteModal}
              >
                Cancel
              </Button>
              <Button type="submit">Send Invite</Button>
            </div>
          </form>
      </Modal>
    </div>
  );
};

export default Users;
