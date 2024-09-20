import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BillPage.css";

// Constants for GST and Tax Rates
const GST_RATE = 0.18; // 18% GST
const TAX_RATE = 0.05; // 5% Tax

const BillingPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/getCart/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();

        if (data.success) {
          setCartData(data.cart);
          calculateTotals(data.cart);
        } else {
          setCartData([]);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [id]);

  const calculateTotals = (cart) => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const gst = subtotal * GST_RATE;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + gst + tax;

    setTotalAmount(total);
    setGstAmount(gst);
    setTaxAmount(tax);
  };

  const handlePlaceOrder = async () => {
    alert("All items will be confirmed as orders!");

    // Prepare the items to send for order confirmation
    const itemsToUpdate = cartData.map((item) => ({
      id: item.id, // Ensure this matches your model's identifier
    }));

    // Update all cart items to set conf_orders to true
    try {
      const res = await fetch("http://localhost:8000/update_orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Orders updated successfully!");
      } else {
        alert("Failed to update orders: " + data.error);
      }
    } catch (error) {
      console.error("Error updating orders:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="billing-page">
      <div className="billing-header">Billing Details</div>
      <div className="billing-content">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cartData.map((item, index) => (
              <tr key={index}>
                <td>{item.dish}</td>
                <td>&#8377;{item.price}</td>
                <td>{item.quantity}</td>
                <td>&#8377;{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="billing-summary">
          <h3>
            Subtotal:{" "}
            <span>
              &#8377;{" "}
              {cartData
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </h3>
          <h3>
            GST (18%): <span>&#8377; {gstAmount.toFixed(2)}</span>
          </h3>
          <h3>
            Tax (5%): <span>&#8377; {taxAmount.toFixed(2)}</span>
          </h3>
          <h3>
            Total Price: <span>&#8377; {totalAmount.toFixed(2)}</span>
          </h3>
        </div>
        <div className="billing-actions">
          <button className="btn btn-order" onClick={handlePlaceOrder}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
