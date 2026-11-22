import BG from "../assets/BG.avif";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Context";
import { registerUser, validateUser } from "../api";
import { dynaura } from "dynaura";
import "dynaura/styles.css";

export default function Authentication() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(true);
  const changeForms = () => setForm((prev) => !prev);

  // Section related to signin form and login form data
  const [loginUser, setLoginUser] = useState({ name: "", password: "" });
  const [signUpUser, setSignUpUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignInChange = (event) => {
    setSignUpUser({ ...signUpUser, [event.target.name]: event.target.value });
  };

  async function registerUsers(e) {
    e.preventDefault();

    if (signUpUser.password.length < 8) {
      dynaura.error({
        title: "Length too short for password!.",
        description: "Dude we aint in 90's, Upgrade Your password..",
      });
      return;
    }

    const response = await registerUser(signUpUser);

    if (response.message !== "Successfull.") {
      const message =
        response.message === "Record Exists."
          ? "Record Exists."
          : "Internal server error.";
      dynaura.error({ title: `${message}`, description: "Please Try Again!" });
    } else {
      dynaura.success({
        title: "Registration Successfull.",
        description: "Let's start a Chat to have some Chits...",
      });
      setUser(response.data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    }
  }

  // Section related to the login form
  const handleLoginChange = (event) => {
    setLoginUser({ ...loginUser, [event.target.name]: event.target.value });
  };

  async function validateUsers(e) {
    e.preventDefault();

    const response = await validateUser(loginUser);

    if (response.message !== "Successfull.") {
      dynaura.error({
        title: "Invalid Credentials.",
        description: "Please Try Again",
      });
    } else {
      dynaura.success({
        title: "Login Successfull.",
        description: "Entering ChitToChat....",
      });
      setUser(response.data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    }
  }
  return (
    <>
      <div className="min-h-screen">
        <div
          className="h-screen w-auto flex flex-wrap justify-center place-items-center bg-fixed bg-cover"
          style={{ backgroundImage: `url(${BG})` }}
        >
          {form ? (
            <div className="p-10 mx-70 bg-linear-to-r from-from to-to rounded-2xl">
              <div className="mb-5">
                {/* //TODO: check why the h1 tags are not working */}
                <p className="font-extrabold w-auto text-2xl">
                  Welcome back, Let's have some chit-chat.
                </p>
                <p>The fun to have a chat with friend is amazing.</p>
              </div>
              <form onSubmit={validateUsers}>
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-extrabold flex flex-col">
                    Email
                    <input
                      type="text"
                      name="name"
                      onChange={handleLoginChange}
                      className="border border-black p-2 rounded-sm w-100 outline-none"
                      placeholder="EnterYourEmail@gmail.com"
                      required
                    />
                  </label>

                  <label className="text-lg font-extrabold flex flex-col">
                    Password
                    <input
                      type="password"
                      name="password"
                      onChange={handleLoginChange}
                      className="border border-black p-2 rounded-sm w-100 outline-none"
                      placeholder="Enter your password"
                      required
                    />
                  </label>
                </div>
                <Link to={"/resetpassword"}>Forgot Password?</Link>
                <br />
                <button className="w-100 font-mono cursor-pointer font-extrabold bg-blue-700 p-2 rounded-2xl my-4">
                  Login
                </button>
              </form>
              <span className="flex gap-2">
                <p>Don't have an account yet?</p>
                <button
                  onClick={changeForms}
                  className="cursor-pointer font-extrabold"
                >
                  Signup
                </button>
              </span>
            </div>
          ) : (
            <div className="p-10 mx-70 bg-linear-to-r from-from2 to-to2 rounded-2xl">
              <div className="mb-5">
                {/* //TODO: check why the h1 tags are not working */}
                <p className="font-extrabold w-auto text-2xl">
                  Hello, Let's create some chit to chat.
                </p>
                <p>The fun to have a chat with friend is amazing.</p>
              </div>
              <form onSubmit={registerUsers}>
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-extrabold flex flex-col">
                    User Name
                    <input
                      type="text"
                      name="name"
                      onChange={handleSignInChange}
                      className="border border-black p-2 rounded-sm w-100 outline-none"
                      placeholder="Enter your username"
                      required
                    />
                  </label>

                  <label className="text-lg font-extrabold flex flex-col">
                    Email Address
                    <input
                      type="email"
                      name="email"
                      onChange={handleSignInChange}
                      className="border border-black p-2 rounded-sm w-100 outline-none"
                      placeholder="EnterYourEmail@gmail.com"
                      required
                    />
                  </label>

                  <label className="text-lg font-extrabold flex flex-col">
                    Password
                    <input
                      type="password"
                      name="password"
                      onChange={handleSignInChange}
                      className="border border-black p-2 rounded-sm w-100 outline-none"
                      placeholder="Enter your password"
                      required
                    />
                  </label>
                </div>
                <Link to={"/resetpassword"}>Forgot Password?</Link>
                <br />
                <button className="w-100 font-mono cursor-pointer font-extrabold bg-pink-400 p-2 rounded-2xl my-4 ">
                  Sign up
                </button>
              </form>
              <span className="flex gap-2">
                <p>Already have an account?</p>
                <button
                  onClick={changeForms}
                  className="cursor-pointer font-extrabold"
                >
                  Login
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
