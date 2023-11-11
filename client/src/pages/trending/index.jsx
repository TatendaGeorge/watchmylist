import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import Loading from "@/components/Loading";
import { getAllProducts } from "@/services/authService";

const Trending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [limit, setLimit] = useState(16);
  const [skip, setSkip] = useState(0);

  const fetchData = async (limit, skip) => {
    try {
      const response = await getAllProducts(limit, skip);
      setLoading(false);
      return response; 
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(limit, skip).then((initialProducts) => {
      if (initialProducts) {
        setProducts(initialProducts);
      }
      setLoading(false);
    });
  }, []);

  const loadMore = () => {
    setLoadMoreLoading(true);
    const newLimit = limit;
    const newSkip = skip + 16;
    setLimit(newLimit);
    setSkip(newSkip);
  
    // Fetch the new products
    fetchData(newLimit, newSkip).then((newProducts) => {
      if (newProducts) {
        // Update the products state with the new data
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      }
      setLoadMoreLoading(false);
    });
  };

  return (
    <>
      <Breadcrumbs title="Trending" />
      <div>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-12 gap-5">
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard product={product} key={index} />
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        )}
        <div style={{ alignItems: "center" }} className="flex justify-center">
          <Button className="btn btn-dark m-3" text="Load More" onClick={loadMore} isLoading={loadMoreLoading} />
        </div>
      </div>
    </>
  );
};

export default Trending;