import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useParams(); // Assuming you're using react-router for route params

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchCartData = async () => {
      try {
        // Encrypt the username
        setLoading(true);
        const encryptedUsername = btoa(username);

        // Fetch cart data from the server with POST request
        const res = await fetch("http://localhost:8000/getCart/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: encryptedUsername }),
        });

        const data = await res.json();

        if (data.success) {
          setCartData(data.cart);
        } else {
          setCartData([]);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the async function
    fetchCartData();
  }, [username]);

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    setCartData((prevCartData) => {
      const updatedCart = [...prevCartData];
      updatedCart[index].quantity = newQuantity;
      return updatedCart;
    });
  };

  // Handle dish removal
  const handleRemoveDish = (index) => {
    setCartData((prevCartData) => prevCartData.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (cartData.length === 0) {
    return (
      <div className="cart-container">
        <h1 className="cart-h1">Your Cart is Empty</h1>
        <p className="cart-p">Add some delicious items to your cart!</p>
        <a href={`/restaurant/${username}`} id="cart-btn" className="btn">
          Browse Menu
        </a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f2e8c6" }}>
      <div className="cart-body mx-3">
        <div className="heading">Your Cart</div>
        <div className="shopping-cart-wrapper">
          <table className="table is-fullwidth shopping-cart">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartData.map((item, index) => (
                <tr className="cart-item" key={index} id={item.dish}>
                  <td>
                    <input
                      type="checkbox"
                      className="cart-item-check"
                      checked
                    />
                  </td>
                  <td className="dish" data-dish={item.dish}>
                    {item.dish}
                  </td>
                  <td>&#8377; {item.price}</td>
                  <td>
                    <input
                      className="input is-primary cart-item-qty"
                      style={{ width: "100px" }}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td className="restaurant" data-restaurant={item.restaurant}>
                    {item.restaurant}
                  </td>
                  <td
                    className={`cart-item-total-${item.dish.replace(" ", "")}`}
                  >
                    &#8377; {item.price * item.quantity}
                  </td>
                  <td>
                    <a
                      className="button is-small"
                      style={{ textDecoration: "none", color: "#952323",cursor:"pointer" }}
                      onClick={() => handleRemoveDish(index)}
                    >
                      Remove
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Totals and buttons would go here */}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
