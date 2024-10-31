import React, { useState } from 'react';

const Orders = () => {
    const [customer, setCustomer] = useState('');
    const [item, setItem] = useState('');
    const [mrp, setMrp] = useState('');
    const [rate, setRate] = useState('');
    const [quantityPcs, setQuantityPcs] = useState(1);
    const [quantityCrtn, setQuantityCrtn] = useState(0);
    const [items, setItems] = useState([]);

    const handleAddItem = () => {
        const total = (rate * quantityPcs) + (rate * quantityCrtn * 10); // Assuming 10 pcs in a carton
        const newItem = { item, mrp, rate, quantityPcs, quantityCrtn, total };
        setItems([...items, newItem]);
        resetFields();
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const resetFields = () => {
        setItem('');
        setMrp('');
        setRate('');
        setQuantityPcs(1);
        setQuantityCrtn(0);
    };

    return (
        <div className="container mt-5">
            <h2>Create Sale Order</h2>
            <div className="mb-3">
                <label htmlFor="customer" className="form-label">Customer Name</label>
                <input type="text" className="form-control" id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="item" className="form-label">Item Name</label>
                <input type="text" className="form-control" id="item" value={item} onChange={(e) => setItem(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="mrp" className="form-label">MRP</label>
                <input type="number" className="form-control" id="mrp" value={mrp} onChange={(e) => setMrp(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="rate" className="form-label">Rate</label>
                <input type="number" className="form-control" id="rate" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="quantityPcs" className="form-label">Quantity (pcs)</label>
                <input type="number" className="form-control" id="quantityPcs" value={quantityPcs} onChange={(e) => setQuantityPcs(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="quantityCrtn" className="form-label">Quantity (crtn)</label>
                <input type="number" className="form-control" id="quantityCrtn" value={quantityCrtn} onChange={(e) => setQuantityCrtn(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleAddItem}>Add Item</button>

            <h3 className="mt-5">Item Summary</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>MRP</th>
                        <th>Rate</th>
                        <th>Quantity (pcs)</th>
                        <th>Quantity (crtn)</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.item}</td>
                            <td>{item.mrp}</td>
                            <td>{item.rate}</td>
                            <td>{item.quantityPcs}</td>
                            <td>{item.quantityCrtn}</td>
                            <td>{item.total.toFixed(2)}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleRemoveItem(index)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
