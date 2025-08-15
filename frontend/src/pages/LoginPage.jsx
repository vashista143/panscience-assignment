import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setauthuser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch(
        "https://panscience-assignment-nfvf.onrender.com/api/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const resdata = await res.json();
      if (res.ok) {
        setauthuser(resdata);
        navigate("/", { replace: true });
      } else {
        setServerError(resdata.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[url('/loginbackground.png')] bg-cover bg-center bg-no-repeat px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl px-6 sm:px-12 py-6 sm:py-8 flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
          Sign In
        </h1>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="text-sm sm:text-base font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Enter Email"
              className="mt-1 block w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/60 placeholder:text-gray-400 transition"
            />
            {errors.email && (
              <p className="text-xs sm:text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm sm:text-base font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter Password"
              className="mt-1 block w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/60 placeholder:text-gray-400 transition"
            />
            {errors.password && (
              <p className="text-xs sm:text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          {serverError && (
            <p className="text-xs sm:text-sm text-red-500">{serverError}</p>
          )}
          <p className="m-0 p-0 text-right text-xs sm:text-sm">
            Forgot Password?
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 sm:gap-0">
            <button
              onClick={() => navigate("/signup")}
              type="button"
              className="text-blue-600 text-sm hover:underline transition"
            >
              Sign up instead
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow transition disabled:opacity-50 w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
