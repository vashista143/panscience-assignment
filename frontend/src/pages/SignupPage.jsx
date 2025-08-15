import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const password = watch("password");
  const confirmPassword = watch("confirmpassword");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmpassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const { name, email, password, admin } = data;
    const role = admin ? "admin" : "user";
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      const result = await res.json();

      if (res.ok) {
        setMessage("Signup successful!");
        navigate("/");
      } else {
        setMessage(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-full h-screen bg-[url('/loginbackground.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
      <div className="ml-15 justify-center w-full max-w-md h-[73%] bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl px-12 py-3 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-800 text-center my-1">Sign up</h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-base font-medium text-gray-700">Username</label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Enter Username"
              className="mt-1 block w-full h-10 px-4 border border-gray-300 rounded-lg bg-white/60"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-base font-medium text-gray-700">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Enter Email"
              className="mt-1 block w-full h-10 px-4 border border-gray-300 rounded-lg bg-white/60"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-base font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Enter Password"
                className="mt-1 block w-full h-10 px-4 border border-gray-300 rounded-lg bg-white/60"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="flex-1">
              <label className="text-base font-medium text-gray-700">Confirm</label>
              <input
                type="password"
                {...register("confirmpassword", { required: "Confirm password is required" })}
                placeholder="Confirm Password"
                className="mt-1 block w-full h-10 px-4 border border-gray-300 rounded-lg bg-white/60"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-600 pl-1">
            Use 8 or more characters with a mix of letters, numbers &amp; symbols
          </p>
          <div className="flex gap-3 text-[15px] text-gray-600">
            <input type="checkbox" {...register("admin")} />
            <label>Check if admin</label>
          </div>
          {message && <p className="text-sm text-red-500">{message}</p>}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => navigate("/login")}
              type="button"
              className="text-blue-600 text-sm hover:underline transition"
            >
              Log in instead
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
