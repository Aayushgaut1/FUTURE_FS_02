import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./pages/DashboardOverview";
import { LeadListing } from "./pages/LeadListing";
import { LeadDetails } from "./pages/LeadDetails";
import { AddLead } from "./pages/AddLead";
import { Notes } from "./pages/Notes";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardOverview,
      },
      {
        path: "leads",
        Component: LeadListing,
      },
      {
        path: "leads/:id",
        Component: LeadDetails,
      },
      {
        path: "leads/new",
        Component: AddLead,
      },
      {
        path: "notes",
        Component: Notes,
      },
      {
        path: "settings",
        Component: Settings,
      },
    ],
  },
]);
