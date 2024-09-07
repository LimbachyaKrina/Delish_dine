import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleQuantityChange = (index, newQuantity) => {
    setCartData((prevCartData) => {
      const updatedCart = [...prevCartData];
      updatedCart[index].quantity = newQuantity;
      return updatedCart;
    });
  };

  const handleRemoveDish = async (index, dish, restaurant, all = false) => {
    try {
      const res = await fetch("http://localhost:8000/removeDish/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, dish, restaurant, all }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.all) {
          setCartData([]);
          return;
        }
        setCartData((prevCartData) =>
          prevCartData.filter((_, i) => i !== index)
        );
      }
    } catch (error) {}
  };

  const handleClearCart = async () => {
    await handleRemoveDish(null, null, null, true);
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
  };

  const calculateTotalPrice = () => {
    return cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (cartData.length === 0) {
    return (
      <div className="cart-body my-4">
        <div className="cart-container">
          <h1 className="cart-h1">Your Cart is Empty</h1>
          <p className="cart-p">Add some delicious items to your cart!</p>
          <a href={`/restaurants/${id}`} id="cart-btn" className="btn">
            Browse Menu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="cart-body my-4">
        <div className="heading">Your Cart</div>
        <div className="shopping-cart-wrapper">
          <table className="table is-fullwidth shopping-cart">
            <thead>
              <tr>
                <th></th>
                <th>Dish</th>
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
                    <img
                      src={item.image}
                      alt={item.dish}
                      className="dish-image"
                    />
                  </td>
                  <td className="dish" data-dish={item.dish}>
                    {item.dish}
                  </td>
                  <td>&#8377; {item.price}</td>
                  <td>
                    <input
                      className="input is-primary cart-item-qty"
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
                  <td className={`cart-item-total-${item.dish}`}>
                    &#8377; {item.price * item.quantity}
                  </td>
                  <td>
                    <a
                      className="button is-small"
                      onClick={() =>
                        handleRemoveDish(index, item.dish, item.restaurant)
                      }
                    >
                      <i
                        class="fa-solid fa-trash-can"
                        style={{ color: "red" }}
                      ></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-totals">
            <h3>Total Price: &#8377; {calculateTotalPrice()}</h3>
          </div>
          <div className="cart-buttons">
            <button className="btn btn-clear" onClick={handleClearCart}>
              Clear
            </button>
            <button className="btn btn-order" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
