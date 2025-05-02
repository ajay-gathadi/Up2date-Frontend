function MobileNumber({ value, onChange }) {
  const handleMobileChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="mobileNumber">
      <label htmlFor="inputMobileNumber" style={{ fontFamily: "Inter" }}>
        Mobile Number
      </label>
      <input
        id="inputMobileNumber"
        type="tel"
        placeholder="Enter Mobile Number"
        style={{ fontFamily: "Inter" }}
        onChange={handleMobileChange}
        value={value}
      />
    </div>
  );
}

export default MobileNumber;
