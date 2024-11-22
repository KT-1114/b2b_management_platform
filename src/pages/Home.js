import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import supabase from "../supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function Home() {
  const { user, userBusinessData } = useAuth();
  const [businessRelations, setBusinessRelations] = useState([]);
  const [connectedBusinesses, setConnectedBusinesses] = useState(new Set());
  const [sellersCount, setSellersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0); // To store the employee count
  const [orders, setOrders] = useState([]); // To store the orders
  const [userNames, setUserNames] = useState({}); // Store the user names for placed_by IDs

  // Fetch business relations and update counts
  const fetchBusinessRelations = async () => {
    if (!user || !userBusinessData) return;

    const { data, error } = await supabase
      .from("business_relations")
      .select(
        `
        relation_id, 
        relation_type, 
        business_uid_1, 
        business_uid_2, 
        business_1:businesses!business_uid_1(business_name, owner_name, contact, business_id), 
        business_2:businesses!business_uid_2(business_name, owner_name, contact, business_id)
      `
      )
      .or(
        `business_uid_1.eq.${userBusinessData.business_uid},business_uid_2.eq.${userBusinessData.business_uid}`
      );

    if (error) {
      console.error("Error fetching business relations:", error.message);
    }

    if (data) {
      setBusinessRelations(data);

      const customers = new Set();
      const sellers = new Set();

      // Determine unique customers and sellers
      data.forEach((relation) => {
        if (relation.business_uid_1 === userBusinessData.business_uid) {
          sellers.add(relation.business_uid_2);
        } else {
          customers.add(relation.business_uid_1);
        }
      });

      setCustomersCount(customers.size);
      setSellersCount(sellers.size);
    }
  };

  // Fetch employee count
  const fetchEmployeeCount = async () => {
    if (!user || !userBusinessData) return;

    const { data, error } = await supabase
      .from("employees")
      .select("employee_id")
      .eq("works_at", userBusinessData.business_uid);

    if (error) {
      console.error("Error fetching employee count:", error.message);
    }

    if (data) {
      setEmployeeCount(data.length);
    }
  };

  // Fetch orders associated with the user's business and fetch user names separately
  const fetchOrders = async () => {
    if (!user || !userBusinessData) return;

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        order_id, 
        created_at, 
        from_store, 
        to_store,
        amount, 
        from_store:businesses!from_store(business_name), 
        to_store:businesses!to_store(business_name),
        placed_by
      `
      )
      .or(
        `from_store.eq.${userBusinessData.business_uid},to_store.eq.${userBusinessData.business_uid}`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error.message);
    }

    if (data) {
      setOrders(data);

      // Now, fetch user names of all users who placed orders
      const placedByIds = [...new Set(data.map((order) => order.placed_by))]; // Extract unique user IDs
      fetchUserNames(placedByIds);
    }
  };

  // Function to fetch user names from profiles table
  const fetchUserNames = async (userIds) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", userIds); // Get user names for the given user IDs

    if (error) {
      console.error("Error fetching user names:", error.message);
    }

    if (data) {
      const names = {};
      data.forEach((user) => {
        names[user.id] = user.name; // Map user ID to name
      });
      setUserNames(names); // Update state with the user names
    }
  };

  useEffect(() => {
    fetchBusinessRelations();
    fetchEmployeeCount();
    fetchOrders();
  }, [user, userBusinessData]);

  // Function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-IN", options);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const features = [
    {
      title: "Place Orders",
      description: "Easily place and manage your orders with a few clicks.",
      icon: "🛒",
      route: "/place-order",
    },
    {
      title: "Manage Products",
      description:
        "Keep track of your stock levels and update items efficiently.",
      icon: "📦",
      route: "/products",
    },
  ];

  return (
    <div className="container my-5">
      <div className="card mb-4">
        <div className="card-body d-flex align-items-center">
          <div className="me-4">
            <div>
            <span>Buisness Name: </span><strong>{userBusinessData.business_name}</strong>
            </div>
            <div>
            <span>Public Id: </span><strong>{userBusinessData.business_id}</strong>
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="row text-center">
              <div className="col">
                <div className="stat-value fw-bold">{customersCount}</div>
                <div className="stat-label fw-bolder">Customers</div>
              </div>
              <div className="col">
                <div className="stat-value fw-bold">{sellersCount}</div>
                <div className="stat-label fw-bolder">Sellers</div>
              </div>
              <div className="col">
                <div className="stat-value fw-bold">{employeeCount}</div>
                <div className="stat-label fw-bolder">Employees</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-5">
        {features.map((feature, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card h-100 shadow-sm border-primary">
              <div className="card-body text-center">
                <h5 className="card-title">
                  {feature.icon} {feature.title}
                </h5>
                <p className="card-text">{feature.description}</p>
                <Link to={feature.route} className="btn btn-primary">
                  Go to {feature.title}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-center mb-4">Recent Orders</h2>
      <Table className="bg-light rounded shadow-lg">
        <TableHead className="bg-black">
          <TableRow>
            <TableCell style={{ color: "white" }}>Date & Time</TableCell>
            <TableCell style={{ color: "white" }}>Amount</TableCell>
            <TableCell style={{ color: "white" }}>From Store</TableCell>
            <TableCell style={{ color: "white" }}>To Store</TableCell>
            <TableCell style={{ color: "white" }}>Placed By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => (
            <tr key={index}>
              <TableCell>{formatDateTime(order.created_at)}</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{order.from_store.business_name}</TableCell>
              <TableCell>{order.to_store.business_name}</TableCell>
              <TableCell>
                {userNames[order.placed_by] || "Unknown"}
              </TableCell>{" "}
              {/* User Name from profiles */}
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
