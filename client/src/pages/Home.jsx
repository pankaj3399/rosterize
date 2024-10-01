import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import CompanyProfile from "./CompanyProfile";
import Department from "./Department"; // Example additional page
import CompanyDashboard from "./Dashboard/CompanyDashboard";
import UserDashboard from "./Dashboard/UserDashboard";
import ClockInOut from "./ClockInOut";
import Schedule from "./Schedule/UserSchedule";
import RoleManagement from "./Roles";
import Billing from "./Billing";
import { useAuth } from "../context/AuthContext";
import UserManagement from "./UserManagement";
import SubmitReview from "./SubmitReview";
import {
  HomeIcon,
  User,
  LogOut,
  Receipt,
  Calendar,
  Star,
  ChartNoAxesGantt,
  Settings,
  ChartPie,
  BriefcaseMedical,
  Bell,
  DollarSign,
  NotebookPen,
  Package,
  ProjectorIcon,
} from "lucide-react";
import ApplyLeave from "./ApplyLeave";
import StatusPage from "./Status";
import UserProfile from "./Profile/UserProfile";
import ManageCustomers from "./Admin/ManageCustomer";
import ApproveRejectLeaves from "./Department/ApproveLeaves";
import AdminDashboard from "./Admin/AdminDashboard";
import ManageCustomerRatings from "./Admin/ManageReviews";
import ManagePrice from "./Admin/ManagePrice";
import EmployeeProfile from "./Profile/EmployeeProfile";
import HodDashboard from "./Dashboard/HodDashboard";
import HodSchedule from "./Schedule/HodSchedule";
import AdminSchedule from "./Schedule/AdminSchedule";
import Notifications from "./Notifications";
import Payslips from "./Payslips";
import ManageCustomerEnquiries from "./Admin/ManageEnquiries";
import SkillsManagement from "./Skills";
import ProjectsManagement from "./ProjectManagement";
import Project from "./Project/Project";

const roleToRoute = {
  superadmin: [
    {
      path: "/",
      component: <AdminDashboard />,
      name: "Dashboard",
      icon: <HomeIcon />,
    },
    {
      path: "/managecustomer",
      component: <ManageCustomers />,
      name: "Manage Customers",
      icon: <User />,
    },
    {
      path: "/managereview",
      component: <ManageCustomerRatings />,
      name: "Manage Review",
      icon: <Star />,
    },
    {
      path: "/manageprice",
      component: <ManagePrice />,
      name: "Manage Price",
      icon: <Receipt />,
    },
    {
      path: "/manageenquiries",
      component: <ManageCustomerEnquiries />,
      name: "Manage Enquiries",
      icon: <NotebookPen />,
    },
  ],
  companyadmin: [
    {
      path: "/",
      component: <CompanyDashboard />,
      name: "Dashboard",
      icon: <HomeIcon />,
    },
    {
      path: "/profile",
      component: <CompanyProfile />,
      name: "Company Profile",
      icon: <User />,
    },
    {
      path: "/department",
      component: <Department />,
      name: "Department",
      icon: <LogOut />,
    },
    {
      path: "/roles",
      component: <RoleManagement />,
      name: "Role Management",
      icon: <Settings />,
    },
    {
      path: "/schedule",
      component: <AdminSchedule />,
      name: "Schedule",
      icon: <Calendar />,
    },
    {
      path: "/billing",
      component: <Billing />,
      name: "Billing",
      icon: <Receipt />,
    },
    {
      path: "/users",
      component: <UserManagement />,
      name: "User Management",
      icon: <ChartNoAxesGantt />,
    },
    {
      path: "/review",
      component: <SubmitReview />,
      name: "Submit Review",
      icon: <Star />,
    },
    {
      path: "/project",
      component: <ProjectsManagement />,
      name: "Manage Project",
      icon: <ProjectorIcon />,
    },
    {
      path: "/skill",
      component: <SkillsManagement />,
      name: "Manage Skill",
      icon: <Package />,
    },
  ],
  departmenthead: [
    {
      path: "/",
      component: <HodDashboard />,
      name: "Dashboard",
      icon: <HomeIcon />,
    },
    {
      path: "/profile",
      component: <UserProfile />,
      name: "Profile",
      icon: <User />,
    },
    {
      path: "/clockinout",
      component: <ClockInOut />,
      name: "Clock In/Out",
      icon: <LogOut />,
    },
    {
      path: "/leave",
      component: <ApplyLeave />,
      name: "Apply Leave",
      icon: <BriefcaseMedical />,
    },
    {
      path: "/schedule",
      component: <HodSchedule />,
      name: "Schedule",
      icon: <Calendar />,
    },
    {
      path: "/payslips",
      component: <Payslips />,
      name: "Payslips",
      icon: <DollarSign />,
    },
    {
      path: "/status",
      component: <StatusPage />,
      name: "Status",
      icon: <ChartPie />,
    },
    {
      path: "/employeeprofile",
      component: <EmployeeProfile />,
      name: "Employee Profile",
      icon: <User />,
    },
    {
      path: "/approveleaves",
      component: <ApproveRejectLeaves />,
      name: "Approve/Reject Leaves",
      icon: <Bell />,
    },
    {
      path: "/project",
      component: <Project />,
      name: "Manage Project",
      icon: <ProjectorIcon />,
    },
  ],
  user: [
    {
      path: "/",
      component: <UserDashboard />,
      name: "Dashboard",
      icon: <HomeIcon />,
    },
    {
      path: "/profile",
      component: <UserProfile />,
      name: "User Profile",
      icon: <User />,
    },
    {
      path: "/clockinout",
      component: <ClockInOut />,
      name: "Clock In/Out",
      icon: <LogOut />,
    },
    {
      path: "/schedule",
      component: <Schedule />,
      name: "Schedule",
      icon: <Calendar />,
    },
    {
      path: "/leave",
      component: <ApplyLeave />,
      name: "Apply Leave",
      icon: <BriefcaseMedical />,
    },
    {
      path: "/payslips",
      component: <Payslips />,
      name: "Payslips",
      icon: <DollarSign />,
    },
    {
      path: "/status",
      component: <StatusPage />,
      name: "Status",
      icon: <ChartPie />,
    },
    {
      path: "/review",
      component: <SubmitReview />,
      name: "Submit Review",
      icon: <Star />,
    },
    {
      path: "/notifications",
      component: <Notifications />,
      name: "Notifications",
      icon: <Bell />,
    },
  ],
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authData, setAuth } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden flex items-center p-5 fixed">
        <button
          className="text-black p-2 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-0 md:inset-auto w-64 bg-gray-800 text-white p-5 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 z-20 md:z-auto`}
      >
        <nav className="">
          <div className="md:hidden flex items-center p-5 fixed right-0 top-0">
            <button
              className="text-white p-2 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>

          <ul>
            {roleToRoute[authData?.role].map((route, index) => {
              return (
                <li key={index} className="mb-4">
                  <Link
                    to={route.path}
                    className="flex items-center space-x-2 text-white"
                  >
                    <span className="flex flex-row gap-2">
                      {route.icon} {route.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-auto">
        <Routes>
          {authData?.role &&
            roleToRoute[authData?.role].map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={route.component}
                />
              );
            })}
          {/* Add more routes here */}
        </Routes>
      </main>
    </div>
  );
};

export default Home;
