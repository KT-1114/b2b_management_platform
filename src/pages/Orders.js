import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import supabase from "../supabaseClient";
import { useAuth } from "../components/AuthProvider";
import Toast from "../components/Toast";

const Orders = () => {
  const navigate = useNavigate();  // Initialize navigate hook
  const { userBusinessData } = useAuth();
  const [fromOrders, setFromOrders] = useState([]);
  const [toOrders, setToOrders] = useState([]);
  const [toast, setToast] = useState({ type: "", message: "", show: false });

  // Fetch Orders where the user’s business is `from_store` or `to_store`
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders where the business is `from_store`
        const { data: fromData, error: fromError } = await supabase
          .from("orders")
          .select("*, from_store (business_name), to_store (business_name)")
          .eq("from_store", userBusinessData.business_uid);

        if (fromError) throw fromError;
        setFromOrders(fromData);

        // Fetch orders where the business is `to_store`
        const { data: toData, error: toError } = await supabase
          .from("orders")
          .select("*, from_store (business_name), to_store (business_name)")
          .eq("to_store", userBusinessData.business_uid);

        if (toError) throw toError;
        setToOrders(toData);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        setToast({
          type: "danger",
          message: `Failed to fetch orders: ${error.message}`,
          show: true,
        });
        setTimeout(() => setToast({ ...toast, show: false }), 5000);
      }
    };

    if (userBusinessData?.business_uid) {
      fetchOrders();
    }
  }, [userBusinessData?.business_uid]);

  // Handle + button click for navigation
  const handleAddOrderClick = () => {
    navigate("/place-order");  // Redirect to "Place Order" page
  };

  return (
    <div className="container mt-5">
      {/* Toast Notifications */}
      {toast.show && (
        <Toast type={toast.type} message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
      )}

      <h2>Orders</h2>

      {/* Floating Action Button */}
      <div className="position-fixed bottom-0 end-0 m-4 d-flex flex-column align-items-center" style={{ zIndex: 1050 }}>
        <button
          className="btn btn-dark rounded-circle p-3 mb-3 shadow-lg"
          style={{ transition: "transform 0.3s ease-in-out" }}
          onClick={handleAddOrderClick}  // On click, redirect to the Place Order page
        >
          <i className="bx bx-plus" style={{ fontSize: "30px" }}></i>
        </button>
      </div>

      {/* From Store Orders Table */}
      <div className="mb-4">
        <h4>Orders from Your Store</h4>
        <table className="table table-bordered table-hover table-striped">
          <thead className="bg-primary text-white">
            <tr>
              <th>Order ID</th>
              <th>Created At</th>
              <th>From Store</th>
              <th>To Store</th>
              <th>Amount</th>
              <th>Placed By</th>
            </tr>
          </thead>
          <tbody>
            {fromOrders.length > 0 ? (
              fromOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>{order.from_store.business_name}</td>
                  <td>{order.to_store.business_name}</td>
                  <td>{order.amount.toFixed(2)}</td>
                  <td>{order.placed_by.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* To Store Orders Table */}
      <div className="mb-4">
        <h4>Orders to Your Store</h4>
        <table className="table table-bordered table-hover table-striped">
          <thead className="bg-success text-white">
            <tr>
              <th>Order ID</th>
              <th>Created At</th>
              <th>From Store</th>
              <th>To Store</th>
              <th>Amount</th>
              <th>Placed By</th>
            </tr>
          </thead>
          <tbody>
            {toOrders.length > 0 ? (
              toOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>{order.from_store.business_name}</td>
                  <td>{order.to_store.business_name}</td>
                  <td>{order.amount.toFixed(2)}</td>
                  <td>{order.placed_by.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
