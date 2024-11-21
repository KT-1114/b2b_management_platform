import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import supabase from '../supabaseClient';

export default function Home() {
  const { user, userBusinessData } = useAuth();
  const [sellersCount, setSellersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);  // To store the employee count
  const [orders, setOrders] = useState([]);  // To store the orders

  // State for business relations
  const [businessRelations, setBusinessRelations] = useState([]);
  const [connectedBusinesses, setConnectedBusinesses] = useState(new Set());

  // Function to fetch business relations and update counts
  const fetchBusinessRelations = async () => {
    if (!user || !userBusinessData) return;

    // Fetch business relations
    const { data, error } = await supabase
      .from('business_relations')
      .select(`
        relation_id, 
        relation_type, 
        business_uid_1, 
        business_uid_2, 
        business_1:businesses!business_uid_1(business_name, owner_name, contact, business_id), 
        business_2:businesses!business_uid_2(business_name, owner_name, contact, business_id)
      `)
      .or(`business_uid_1.eq.${userBusinessData.business_uid},business_uid_2.eq.${userBusinessData.business_uid}`);

    if (error) {
      console.error('Error fetching business relations:', error.message);
      // Handle the error as necessary
    }

    if (data) {
      setBusinessRelations(data);

      const customers = new Set();
      const sellers = new Set();

      // Determine unique customers and sellers
      data.forEach(relation => {
        if (relation.business_uid_1 === userBusinessData.business_uid) {
          // business_uid_1 is the customer
          sellers.add(relation.business_uid_2);  // Add seller (business_uid_2)
        } else {
          // business_uid_2 is the customer
          customers.add(relation.business_uid_1);  // Add seller (business_uid_1)
        }
      });

      setCustomersCount(customers.size);  // Unique customers
      setSellersCount(sellers.size);      // Unique sellers (you can adjust this logic based on your relation type)

      // Set connected businesses for additional use (if needed)
      setConnectedBusinesses(customers);
    }
  };

  // Function to fetch employee count
  const fetchEmployeeCount = async () => {
    if (!user || !userBusinessData) return;

    const { data, error } = await supabase
      .from('employees')
      .select('employee_id')
      .eq('works_at', userBusinessData.business_uid);

    if (error) {
      console.error('Error fetching employee count:', error.message);
    }

    if (data) {
      setEmployeeCount(data.length);  // Set the employee count
    }
  };

  // Function to fetch orders associated with the user's business
  const fetchOrders = async () => {
    if (!user || !userBusinessData) return;

    const { data, error } = await supabase
      .from('orders')
      .select('order_id, created_at, from_store, to_store, amount, placed_by')
      .or(`from_store.eq.${userBusinessData.business_uid},to_store.eq.${userBusinessData.business_uid}`)
      .order('created_at', { ascending: false });  // Fetch orders in descending order of created_at

    if (error) {
      console.error('Error fetching orders:', error.message);
    }

    if (data) {
      setOrders(data);  // Store the fetched orders in state
    }
  };

  useEffect(() => {
    fetchBusinessRelations();  // Fetch business relations
    fetchEmployeeCount();  // Fetch employee count
    fetchOrders();  // Fetch orders
  }, [user, userBusinessData]);  // Re-run the fetch whenever user or business data changes

  // Function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-IN', options);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const features = [
    {
      title: 'Place Orders',
      description: 'Easily place and manage your orders with a few clicks.',
      icon: '🛒',
      route: '/place-order',
    },
    {
      title: 'Manage Inventory',
      description: 'Keep track of your stock levels and update items efficiently.',
      icon: '📦',
      route: '/inventory',
    },
    {
      title: 'Sell',
      description: 'Manage your sales process and monitor performance.',
      icon: '💰',
      route: '/sell',
    },
    {
      title: 'Manage Employees',
      description: 'Organize and manage your team effectively.',
      icon: '👥',
      route: '/manage-employees',
    },
  ];

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
            <h5 className='m-0'>{user ? user.name : 'John Doe'}</h5>
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
                <Link to={feature.route} className="btn btn-primary">
                  Go to {feature.title}
                </Link>
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
            <th>Amount</th>
            <th>Placed By</th>
            <th>From Store</th>
            <th>To Store</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{formatDateTime(order.created_at)}</td>
              <td>{order.amount}</td>
              <td>{order.placed_by}</td>
              <td>{order.from_store}</td>
              <td>{order.to_store}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
