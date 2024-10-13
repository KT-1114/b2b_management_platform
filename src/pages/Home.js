import React from 'react'
import '../components/buttons.css'

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

  return (
    <>
      <div className="container my-5">
        <h1 className="text-center mb-4">Feature Dashboard</h1>
        <div className="row">
          {features.map((feature, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card text-center h-100">
                <div className="card-body">
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
      </div>
    </>
  )
}
