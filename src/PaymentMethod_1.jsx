import React from "react";

function PaymentMethod({ value = { cash: 0, online: 0 }, onChange }) {
  /*
  const [paymentMethod, setPaymentMethod] = useState({
    cash: value.cash > 0,
    online: value.online > 0,
  });

  const [amounts, setAmounts] = useState({
    cash: value.cash || 0,
    online: value.online || 0,
  });

  useEffect(() => {
    if (value.cash === 0 && value.online === 0) {
      setPaymentMethod({
        cash: false,
        online: false,
      });

      setAmounts({
        cash: 0,
        online: 0,
      });
    }
  }, [value]);
  

  const handleMethodChange = (method) => {
    const newPaymentMethod = {
      ...paymentMethod,
      [method]: !paymentMethod[method],
    };
    setPaymentMethod(newPaymentMethod);

    onChange({
      cash: newPaymentMethod.cash ? Number(amounts.cash) : 0,
      online: newPaymentMethod.online ? Number(amounts.online) : 0,
    });
  };

  const handleAmountChange = (method, value) => {
    const newAmount = {
      ...amounts,
      [method]: value,
    };
    setAmounts(newAmount);

    onChange({
      cash: paymentMethod.cash ? Number(newAmount.cash) : 0,
      online: paymentMethod.online ? Number(newAmount.online) : 0,
    });
  };
*/

  const handlePaymentMethodChange = (methodOfPayment) => {
    const newPaymentMethod = { ...value };

    if (methodOfPayment === "cash") {
      newPaymentMethod.cash = newPaymentMethod.cash === 0 ? "" : 0;
    } else if (methodOfPayment === "online") {
      newPaymentMethod.online = newPaymentMethod.online === 0 ? "" : 0;
    }
    onChange(newPaymentMethod);
  };

  const handleAmountChange = (methodOfPayment, amount) => {
    onChange({
      ...value,
      [methodOfPayment]: Number(amount),
    });
  };

  return (
    <div className="payment-container">
      <label>Payment Method</label>

      <div className="payment-method">
        <label className="payment-option">
          <input
            type="checkbox"
            value="cash"
            checked={value.cash !== 0}
            onChange={() => handlePaymentMethodChange("cash")}
          />
          <span>Cash</span>
        </label>

        {value.cash !== 0 &&
          value.cash !== null &&
          value.cash !== undefined && (
            <div className="amount-input">
              <label>Amount: ₹</label>
              <input
                type="number"
                value={value.cash || ""}
                onChange={(event) =>
                  handleAmountChange("cash", event.target.value)
                }
                min="0"
                placeholder="Enter amount"
              />
            </div>
          )}
      </div>

      <div className="payment-method">
        <label className="payment-option">
          <input
            type="checkbox"
            checked={value.online !== 0}
            onChange={() => handlePaymentMethodChange("online")}
          />
          <span>Online</span>
        </label>

        {value.online !== 0 &&
          value.online !== null &&
          value.online !== undefined && (
            <div className="amount-input">
              <label>Amount: ₹</label>
              <input
                type="number"
                value={value.online || ""}
                onChange={(event) =>
                  handleAmountChange("online", event.target.value)
                }
                min="0"
                placeholder="Enter amount"
              />
            </div>
          )}
      </div>

      <div className="total-amount">
        Total: ₹{Number(value.cash || 0) + Number(value.online || 0)}
      </div>
    </div>
  );
}

export default PaymentMethod;
