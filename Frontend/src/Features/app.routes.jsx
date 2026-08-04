import { createBrowserRouter } from "react-router-dom";
import Login from "./auth/pages/Login";
import  Register  from "./auth/pages/register";
import Protected from "./auth/components/Protected";
import Home from "./interview/pages/Home";
import Interview from "./interview/pages/interview";
import Landing from "./landing/pages/Landing";
import JobSearch from "./jobs/pages/JobSearch";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/dashboard",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/jobs",
        element: <Protected><JobSearch /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview/></Protected>
    }

]);