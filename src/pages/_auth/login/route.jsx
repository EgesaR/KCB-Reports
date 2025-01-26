import { useState, useActionState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { FaGoogle, FaApple, FaTriangleExclamation, FaCheck, FaArrowLeft } from "react-icons/fa6";
import { FormLayout, FormHeader, FormBody } from "../../../layouts/FormLayout";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Alert from "../../../components/Alert";

const Login = () => {
  // For managing alerts
  const [alerts, setAlerts] = useState([]); 
  // For managing login logic
  const [data, action, isPending] = useActionState(handleLogin, {}); 
  // Function to handle API call logic
  async function handleLogin(currentData, formData) {
    const form = {
      user: {
        name: formData.get("username"),
        password: formData.get("password"),
      },
    };
    try {
      const response = await axios.post("https://kcb-reports-api.vercel.app/auth/login", form);
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect after successful login
      }, 500); // Reduced artificial delay
      return { status: true, data: response };
    } catch (error) {
      console.error("Login failed:", error.response?.data);
      return { status: false, message: error.response?.data };
    }
  }

  // Function to create alerts
  const createAlert = (status, message) => {
    const newAlert = {
      id: Math.random().toString(),
      alertBody: message,
      status: status ? "success" : "error",
      icon: status ? <FaCheck className="w-4 h-4" /> : <FaTriangleExclamation className="w-4 h-4" />,
    };
    setAlerts((prevAlerts) => [...prevAlerts.slice(-4), newAlert]); // Keep only the last 5 alerts
  };

  return (
    <FormLayout>
      <div className="fixed top-0 right-0 w-[75%] z-50 select-none sm:w-[40%] px-1 pt-6">
        {alerts.map((alert) => (
          <Alert key={alert.id} {...alert} setAlerts={setAlerts} />
        ))}
      </div>
      <FormHeader>
        <div className="w-full flex flex-col z-10 gap-3">
          <h1 className="text-4xl font-[500] text-white">
            Welcome back to KCB Reports
          </h1>
          <p className="text-base text-slate-300">
            Log in to access your reports.
          </p>
        </div>
      
        <Link to="/" className="flex justify-center items-center absolute bottom-3 left-3 z-10 gap-2 rounded-lg text-slate-200/80 px-1 py-1 active:bg-gray-300/50 hover:bg-gray-200/60">
          <FaArrowLeft />
          Go back Home
        </Link>
      </FormHeader> 
      <FormBody>
        <form className="w-full" action={action}>
          <Input type="text" label="Username" name="username" required />
          <Input type="password" label="Password" name="password" required />
          <div className="flex">
            <Link to="/forgot-password" className="text-green-500 ml-auto">
              Forgot Password?
            </Link>
          </div>
          <LoginButton isPending={isPending} data={data} createAlert={createAlert} />
        </form>
        <div className="w-full my-3 grid grid-cols-3 items-center px-3">
          <hr />
          <p className="text-black text-center">Or login with</p>
          <hr />
        </div>
        <div className="w-full px-3 grid grid-cols-2 gap-5">
          <Button className="py-2 border border-gray-200 rounded-lg flex justify-center items-center gap-3">
            <FaGoogle />
            Google
          </Button>
          <Button className="py-2 border border-gray-200 rounded-lg flex justify-center items-center gap-3">
            <FaApple />
            Apple
          </Button>
        </div>
        <div className="w-full px-3 flex justify-center mt-10 gap-3">
          <p>Don't have an account?</p>
          <Link to="/signup" className="text-green-500">
            Sign up
          </Link>
        </div>
        <Link to="/blockers/watch">
          Go to the watch board
        </Link>
      </FormBody>
    </FormLayout>
  );
};

const LoginButton = ({ isPending, data, createAlert }) => {
  const handleLogin = (response) => {
    if (!isPending) {
      if (!response.status) {
        return createAlert(false, response?.message?.message || "Login failed");
      }
      const { user } = response?.data?.data || {};
      createAlert(true, `Successfully logged in as ${user?.username}`);
    }
  };

  return (
    <Button
      className="py-2 w-full rounded-lg bg-green-500 text-black my-3"
      onClick={() => handleLogin(data)}
      type="submit"
    >
      {isPending ? "Logging in..." : "Login"}
    </Button>
  );
};

export default Login;
