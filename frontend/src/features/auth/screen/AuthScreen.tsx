import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/ui/loader/Loader";
import { FormInput } from "../../../components/ui/input/FormInput";
import { Button } from "../../../components/ui/button/Button";

interface AuthForm {
  email: string;
  password: string;
  passwordConfirm?: string;
}

function AuthScreen() {
  const user = "";
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthForm>();

  useEffect(() => {
    if (user) {
      navigate("/tasks");
    }
  }, [user]);

  const handleLogin = () => {};

  const handleFormToggle = () => {
    setIsLogin(!isLogin);
  };

  const isLoading = false;

  const password = watch("password");
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-[#f3f4f6] from-[#302943] via-slate-900 to-black pt-36 md:justify-center md:pt-0 lg:flex-row dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]">
      <div className="flex w-full flex-col items-center justify-center gap-16 md:w-auto md:flex-row md:gap-40">
        <div className="flex h-full w-full flex-col items-center justify-center lg:w-2/3">
          <div className="flex w-full flex-col items-center justify-center gap-5 md:max-w-lg md:gap-y-10 2xl:-mt-20 2xl:max-w-3xl">
            <p className="flex flex-col gap-4 text-center text-4xl font-black text-blue-700 md:text-6xl 2xl:text-7xl dark:text-gray-400">
              <span className="text-6xl">Offpista</span>
              <span>Task Manager</span>
            </p>

            <div className="cell hidden md:block">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center p-4 md:w-1/3 md:p-1">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="form-container flex w-full flex-col gap-y-8 bg-white px-10 pt-14 pb-14 md:w-[400px] dark:bg-slate-900"
          >
            <div>
              <p className="text-center text-3xl font-bold text-blue-600">
                {isLogin ? "Welcome back!" : "Create an account"}
              </p>

              <p className="text-center text-base text-gray-700 dark:text-gray-500">
                Keep all your credentials safe!
              </p>
            </div>

            <div className="flex flex-col gap-y-10 md:gap-y-5">
              <FormInput
                placeholder="you@example.com"
                type="email"
                name="email"
                label="Email Address"
                registration={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email}
              />
              <FormInput
                placeholder="password"
                type="password"
                name="password"
                label="Password"
                registration={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />

              {!isLogin && (
                <FormInput
                  placeholder="confirm password"
                  type="password"
                  name="passwordConfirm"
                  label="Confirm Password"
                  registration={register("passwordConfirm", {
                    required: "Confirm Password is required!",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  error={errors.passwordConfirm?.message}
                />
              )}
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <Button
                type="submit"
                className="h-10 w-full rounded-full bg-blue-700 text-white"
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            )}

            <div className="mx-auto flex items-center">
              <p>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <Button variant="link" onClick={handleFormToggle}>
                {isLogin ? "Sign Up" : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
