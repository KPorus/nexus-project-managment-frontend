import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { acceptInvite } from "../store/slices/helper/dataThunks";
import { logout } from "../store/slices/authSlice";
import type { Invite } from "../types";

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [invite, setInvite] = useState<Invite | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!token) return <Navigate to="/login" replace />;
  useEffect(() => {
    if (token) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      try {
        const result = await dispatch(
          acceptInvite({ token, password }) as any
        ).unwrap();
        if (result) {
          alert("Account created successfully! Please login.");
        }
        console.log("after accepting ", result);
        setInvite(result.user.email || result.email);
        navigate("/login");
      } catch (err) {
        console.error("Failed to accept invite:", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Accept Invitation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            For {invite?.email}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* {error && <div className="text-red-500 text-sm mb-4">{error}</div>} */}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Set Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Create Account & Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
