import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetVendorDetailsMutation } from '../App/Services/RestaurantApi';
import { useAddCartMutation } from '../App/Services/CartApi';

function RestaurantPage() {
  const { id } = useParams();
  const [getVendorDetails] = useGetVendorDetailsMutation();
  const [addCart]=useAddCartMutation()
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAddToCart = async(id) => {
     await addCart({id,quantiy:1}).then((res)=>{
       console.log("Item added to cart successfully")
     })
  };



  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await getVendorDetails({ id }).unwrap();
        setVendorDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch vendor details:", err);
        setError("Failed to load restaurant details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchVendorDetails();
    } else {
      setError("Restaurant ID is missing.");
    }
  }, []);

  // Redirect to the home page if no vendor ID is available
  if (!id) {
    navigate('/');
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-center">{vendorDetails.restaurantName}</h2>
      <div className="flex items-center mb-6">
        <p className="text-gray-600 mr-4">{vendorDetails.cuisineType}</p>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
          {vendorDetails.averageRating || "N/A"} ★
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-4 text-center">Menu</h3>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {vendorDetails.menuItems?.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-4 flex items-center gap-4"
          >
            {/* Menu Item Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            {/* Menu Item Details */}
            <div className="flex flex-col flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <span className="mt-2 font-bold">₹{item.price}</span>
            </div>
            {/* Add to Cart / Increment-Decrement */}
            <div className="flex items-center ml-auto">
              (
                <>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDecrement(item)}
                  >
                    -
                  </button>
                  <span className="mx-2">{cart[item._id]}</span>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => handleIncrement(item)}
                  >
                    +
                  </button>
                </>
              ) : (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleAddToCart(item)}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantPage;
