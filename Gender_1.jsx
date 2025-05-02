function Gender({ value, onChange }) {
  const handleGenderChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="gender-container">
      <label className="gender-label">Gender</label>
      <div className="gender-options">
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={value === "Male"}
            onChange={handleGenderChange}
          />
          Male
        </label>

        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={value === "Female"}
            onChange={handleGenderChange}
          />
          Female
        </label>
      </div>
    </div>
  );
}

export default Gender;
