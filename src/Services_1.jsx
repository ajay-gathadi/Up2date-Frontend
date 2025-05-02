import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Services.css";

function Services({ value = [], onChange, gender }) {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickingOutsideTheDropdown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickingOutsideTheDropdown);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickingOutsideTheDropdown
      );
    };
  }, [isOpen]);

  useEffect(() => {
    //Fetch services from the backend
    const fetchServices = async () => {
      try {
        const response = await fetch("/services");

        const contentType = response.headers.get("Content-Type");

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response: ", errorText);
          console.error("Status: ", response.status);
          throw new Error("Failed to fetch services");
        }

        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response from services: ", text);
          throw new Error("Services Response is not JSON");
        }

        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    if (!gender || gender === "") {
      return services;
    } else if (gender === "Male") {
      return services.filter(
        (currentService) => currentService.forMale === true
      );
    } else if (gender === "Female") {
      return services.filter((currentService) => {
        return currentService.forFemale === true;
      });
    }
    return services;
  }, [services, gender]);

  const handleServiceChange = (serviceId) => {
    if (value.includes(serviceId)) {
      onChange(value.filter((id) => id !== serviceId));
    } else {
      onChange([...value, serviceId]);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  // if (loading) {
  //   return <div>Loading Services...</div>;
  // }

  // if (error) {
  //   return <div>Error loading services: {error}</div>;
  // }

  const selectedServices = services
    .filter((currentService) => value.includes(currentService.serviceId))
    .map((currentService) => currentService.serviceName)
    .join(", ");

  return (
    <div className="services-container" ref={dropdownRef}>
      <label>Services: </label>
      <div className="dropdown-header" onClick={toggleDropdown}>
        {value.length > 0 ? `${selectedServices}` : "Select Services"}
        <span className="dropdown-arrow">{isOpen ? "🔺" : "🔻"}</span>
      </div>
      {isOpen && (
        <div className="dropdown-content">
          {loading ? (
            <div className="service-item">Loading Services...</div>
          ) : error ? (
            <div className="service-item">Error loading services</div>
          ) : filteredServices.length === 0 ? (
            <div className="service-item">No Services available</div>
          ) : filteredServices.length === 0 ? (
            <p>No Services available for {gender || "selected gender"}</p>
          ) : (
            filteredServices.map((currentService) => (
              <div key={currentService.serviceId} className="service-item">
                <label>
                  <input
                    type="checkbox"
                    checked={value.includes(currentService.serviceId)}
                    onChange={() =>
                      handleServiceChange(currentService.serviceId)
                    }
                  />
                  {currentService.serviceName}
                </label>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
export default Services;
