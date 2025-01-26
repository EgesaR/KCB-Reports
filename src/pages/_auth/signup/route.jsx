import { useState } from "react";
import { Link } from "react-router"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaApple, FaTriangleExclamation, FaCheck, FaArrowLeft, FaEnvelope, FaPhone, FaUser } from "react-icons/fa6";
import { FormLayout, FormHeader, FormBody } from "../../../layouts/FormLayout";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Alert from "../../../components/Alert";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: 0,
    email: "",
    date: "",
  });
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  // Function to create alerts
  const createAlert = (status, message) => {
    const newAlert = {
      id: Math.random().toString(),
      alertBody: message,
      status: status ? "success" : "error",
      icon: status ? <FaCheck className="w-4 h-4" /> : <FaTriangleExclamation className="w-4 h-4" />,
    };
    setAlerts((prevAlerts) => [...prevAlerts.slice(-4), newAlert]); // Limit alerts to last 5
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, email, date, age } = formData;

    try {
      const data = {
        user: {
          name: username,
          email,
          password,
          DOB: date,
          age,
          createdAt: new Date(),
        },
      };
      const response = await axios.post("https://kcb-reports-api.vercel.app/auth/signup", data);
      
      createAlert(true, response?.data.message || "Sign-up successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign up:", error.response?.data.message);
      createAlert(false, error.response?.data.message || "Sign-up failed. Please try again.");
    }
  };

  // Function to handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "age" ? parseInt(value) : value, // Convert age to number
    }));
  };
  
  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Name and Password Slide*/}
      <FormLayout className="hidden">
      <div className="fixed top-0 right-0 w-[75%] sm:w-[40%] px-1 pt-6 z-50  ">
        {alerts.map((alert) => (
          <Alert key={alert.id} {...alert} setAlerts={setAlerts} />
        ))}
      </div>
      <FormHeader className={`overflow-hidden transition duration-600`}>
        <div className={`delay-[1200ms] duration-[1600ms] w-full flex flex-col z-10 gap-3`}>
          <h1 className={`delay-[600ms] duration-[1200ms] text-4xl font-[500] text-white`}>
            Welcome to KCB Reports
          </h1>
          <p className={`delay-[1200ms] duration-[1200ms] text-base text-slate-300`}>
            Let's first get some basic info about you.
          </p>
        </div>
      
        <Link to="/" className={`flex justify-center items-center absolute bottom-3 left-3 z-10 gap-2 rounded-lg text-slate-200/80 px-1 py-1 active:bg-gray-300/50 hover:bg-gray-200/60  delay-[1400ms] duration-[1200ms]`}>
          <FaArrowLeft />
          Go back Home
        </Link>
      </FormHeader>
      <FormBody className={`overflow-hidden overflow-y-scroll pb-4 transition duration-[1200ms]`}>
        <div className="w-full px-3 grid grid-cols-2 gap-5 mb-2">
          <Button className="py-2 border border-gray-200 rounded-lg flex justify-center items-center gap-3">
            <FaGoogle />
            Google
          </Button>
          <Button className="py-2 border border-gray-200 rounded-lg flex justify-center items-center gap-3">
            <FaApple />
            Apple
          </Button>
        </div>
        <div className="w-full grid grid-cols-3 items-center my-4">
          <hr />
          <p className="text-center">OR</p>
          <hr />
        </div>
        <form className="w-full flex flex-col my-2">
          <Input type="text" label="Username" name="username" required />
          <Input type="password" label="Password" name="password" required />
          <Button
            className="py-2 w-full rounded-lg bg-green-500 text-black my-3"
            type="button"
          >
            Continue
          </Button>
        </form>
      </FormBody>
    </FormLayout>
      <FormLayout className="">
        <FormHeader className="h-screen">
            <div className="w-full flex items-center flex-col z-10">
              
              <div className="flex gap-4">
                <div className="h-20 w-20 bg-gray-800/80 text-2xl grid place-content-center text-white rounded-full">
                  <div className="w-12 h-12  grid place-content-center bg-gray-900/80 rounded-full">
                    <FaEnvelope/>
                  </div>
                </div>
              <FaUser className="text-6xl text-white"/>
              <div className="h-20 w-20 bg-gray-800/80 text-2xl grid place-content-center text-white rounded-full">
                <div className="w-12 h-12  grid place-content-center bg-gray-900/80 rounded-full">
                  <FaPhone/>
                </div>
              </div>
              
              </div>
              
              <div className="mt-6 text-center mb-[24rem]">
                <h1 className="text-xl text-white font-medium">
                  Please enter your contact info
                </h1>
                <p className="text-gray-100 font-light text-sm">
                  Providing your contacts enables other users to interact and get or give feedback to or from you.
                </p>
              </div>
              <div className="w-full h-[50vh] fixed bottom-0 left-0 bg-white flex justify-center pt-12 px-4">
                <form className="w-[85%] flex flex-col gap-1">
                  <Input type="email" label="Email" name="email"/>
                  <Input type="tel" label="Phone number" name="phoneNumber"/>
                  <div className="flex w-full mt-12">
                    <Button className="ml-auto px-10 py-2 rounded-xl border border-slate-500">
                      Next
                    </Button>
                  </div>
                </form>
              </div>
            </div>
        </FormHeader>
      </FormLayout>
    </div>
  );
};

export default SignUp;
