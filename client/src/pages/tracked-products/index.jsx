import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import ProductCard from "@/components/ui/ProductCard";
import Card from "@/components/ui/Card";
import WatchList from "./watch-list";
import { getUserTrackedProducts } from "@/services/authService";

const TrackedProducts = () => {
  const { user, isLoaded } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.id;
    setUserId(userId);

    fetchData(userId);
  }, [isLoaded]);

  const fetchData = async (userId) => {
    try {
      const response = await getUserTrackedProducts({ userId: userId });
      setProducts(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Breadcrumbs title="My List" /> */}
      <div className="grid grid-cols-12  md:space-x-6 md:space-y-0 space-y-4 sm:space-y-4  rtl:space-x-reverse">
        <div className="xl:col-span-12 lg:col-span-12 col-span-12">
          <Card title="My Watchlist" noborder >
            <WatchList products={products}  />
          </Card>
        </div>
      </div>
      <div>
        {/* {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-12 gap-5">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        )} */}
      </div>
    </>
  );
};

export default TrackedProducts;
