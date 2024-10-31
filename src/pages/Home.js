import React from 'react';
import '../components/buttons.css';

export default function Home() {
  const features = [
    {
      title: 'Place Orders',
      description: 'Easily place and manage your orders with a few clicks.',
      icon: '🛒',
    },
    {
      title: 'Manage Inventory',
      description: 'Keep track of your stock levels and update items efficiently.',
      icon: '📦',
    },
    {
      title: 'Sell',
      description: 'Manage your sales process and monitor performance.',
      icon: '💰',
    },
    {
      title: 'Manage Employees',
      description: 'Organize and manage your team effectively.',
      icon: '👥',
    },
  ];

  // Dummy data for sellers and customers
  const sellersCount = 150; 
  const customersCount = 300; 
  const employeeCount = 0;

  // Dummy data for orders
  const orders = [
    { date: '2024-10-28', time: '14:30', name: 'Alice Johnson', amount: '₹120.00', placedBy: 'Admin', status: 'Completed' },
    { date: '2024-10-27', time: '10:15', name: 'Bob Smith', amount: '₹75.00', placedBy: 'Admin', status: 'Pending' },
    { date: '2024-10-26', time: '16:45', name: 'Charlie Brown', amount: '₹200.00', placedBy: 'User', status: 'Cancelled' },
  ];

  // Function to format date and time
  const formatDateTime = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString}`);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-IN', options);

    // Formatting time to 12-hour format with AM/PM
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="container my-5">
      <div className="card mb-4">
        <div className="card-body d-flex align-items-center">
          <div className="text-center me-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile"
              className="profile-pic rounded-circle"
              style={{ width: '70px', height: '70px' }}
            />
            <h5 className='m-0'>John Doe</h5>
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
                <h5 className="card-title">{feature.icon} {feature.title}</h5>
                <p className="card-text">{feature.description}</p>
                <a href="#" className="btn btn-primary">
                  Go to {feature.title}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-center mb-4">Recent Orders</h2>
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th>Date & Time</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Placed By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{formatDateTime(order.date, order.time)}</td>
              <td>{order.name}</td>
              <td>{order.amount}</td>
              <td>{order.placedBy}</td>
              <td>
                <span className={`badge ${order.status === 'Completed' ? 'bg-success' : order.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
