import "./App.css";
import Card from "./components/card/card";
import { getData } from "./constants/db";
import Cart from "./components/cart/cart";
import { useCallback, useEffect, useState } from "react";

const courses = getData();

const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    telegram.ready();
  });

  const onAddItem = (item) => {
    const existItem = cartItems.find((c) => c.id == item.id);

    if (existItem) {
      const newData = cartItems.map((c) =>
        c.id == item.id ? { ...existItem, quantity: existItem.quantity + 1 } : c
      );

      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];

      setCartItems(newData);
    }
  };

  const onRemoveItem = (item) => {
    const existItem = cartItems.find((c) => c.id == item.id);
    console.log("existItem", existItem);

    if (existItem.quantity === 1) {
      const newData = cartItems.filter((c) => c.id !== existItem.id);
      console.log("delete_item_quantity_0", newData);

      setCartItems(newData);
    } else {
      const newData = cartItems.map((c) =>
        c.id === existItem.id
          ? { ...existItem, quantity: existItem.quantity - 1 }
          : c
      );
      console.log("delete_1_item_quantity", newData);

      setCartItems(newData);
    }
  };

  const onCheckout = () => {
    telegram.MainButton.text = "Sotib olish";
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    const queryId = telegram.initDataUnsave?.query_id;

    if (queryId) {
      fetch("http://localhost:8000/web-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItems),
      });
    } else {
      telegram.sendData(
        JSON.stringify({ products: cartItems, queryId: queryId })
      );
    }
  }, [cartItems]);

  useEffect(() => {
    telegram.onEvent("mainButtonClicked", onSendData);

    return () => telegram.offEvent("mainButtonClicked", onSendData);
  }, [onSendData]);

  return (
    <>
      <h1 className="heading">Sammi kurslar</h1>

      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards_container">
        {courses.map((course) => (
          <Card
            key={course.id}
            course={course}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </>
  );
};

export default App;
