import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { useAuth } from "../components/AuthProvider";
import { MdDelete, MdRemoveRedEye } from "react-icons/md";
import ProductModal from "../components/ProductModal"; // Import the ProductModal component

export default function Products() {
  const { userBusinessData } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, product_name, rate, mrp, cost_price, qty_in_ctn, image_url")
        .eq("seller_uid", userBusinessData.business_uid);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
      setIsLoading(false);
    };

    if (userBusinessData.business_uid) {
      fetchProducts();
    } else {
      console.error("User ID (business_id) is not available.");
      setIsLoading(false);
    }
  }, [userBusinessData.business_uid]);

  const handleDelete = async (productId) => {
    setShowDeleteModal(productId);
  };

  const confirmDelete = async (productId) => {
    setDeleteLoading(productId); // Start the delete loader
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error("Error deleting product:", error);
      } else {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    } catch (err) {
      console.error("Error in confirmDelete:", err);
    }
    setDeleteLoading(null); // Stop the delete loader
    setShowDeleteModal(null); // Close the modal
  };

  const cancelDelete = () => {
    setShowDeleteModal(null); // Close the modal without deleting
  };

  const handleViewProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product); // Set the product details for the modal
  };

  const extractMeasurement = (productName) => {
    const regex = /\(([^)]+)\)/; // Extract the content inside parentheses
    const match = productName.match(regex);
    return match ? match[1] : ""; // Return the measurement if found, else an empty string
  };

  return (
    <>
      <div className="container mt-5">
        <h2 className="text-center mb-4">
          Total Products Available: {products.length}
        </h2>
        <p className="text-center mb-5">
          Explore our wide range of products. Below, you'll find details on each item, including a brief description and price.
        </p>

        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {products.map((product) => {
              const measurement = extractMeasurement(product.product_name); // Extract measurement from product name
              const imageUrl = `${userBusinessData.business_uid}_${product.product_name.replace(/\s+/g, '_')}_${measurement}`;

              return (
                <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <img
                      src={`https://your-bucket-url/product-images/${imageUrl}`} // Adjust the URL as needed
                      className="card-img-top"
                      alt={product.product_name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.product_name}</h5>
                      <p className="card-text">Rate: ${product.rate}</p>
                      <p className="card-text">MRP: ${product.mrp}</p>
                      <p className="card-text">Cost Price: ${product.cost_price}</p>
                      <p className="card-text">Quantity in Carton: {product.qty_in_ctn || "N/A"}</p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          <MdRemoveRedEye /> View
                        </button>
                        <button
                          className={`btn btn-danger btn-sm ${deleteLoading === product.id ? "disabled" : ""}`}
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteLoading === product.id}
                        >
                          {deleteLoading === product.id ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <MdDelete />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Product Modal */}
        <ProductModal showModal={showModal} onClose={() => setShowModal(false)} />

        {/* Floating Action Button */}
        <div
          className="position-fixed bottom-0 end-0 m-4 d-flex flex-column align-items-center"
          style={{ zIndex: 1050 }}
        >
          <button
            className="btn btn-dark p-2 shadow-lg"
            onClick={() => setShowModal(true)}
            style={{
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="bx bx-plus" style={{ fontSize: '30px' }}></i>
          </button>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="delete-modal">
            <div className="modal-content">
              <h4>Confirm Delete</h4>
              <p>
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="modal-buttons">
                <button
                  className="btn btn-danger"
                  onClick={() => confirmDelete(showDeleteModal)}
                >
                  Delete
                </button>
                <button className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
