import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputGroup from "@/components/ui/InputGroup";
import ProductCard from "@/components/ui/ProductCard";
import {
  scrapeAndStoreProduct,
  getRecentProducts,
  updateProductDetails,
} from "@/services/authService";

const schema = yup
  .object({
    searchUrl: yup.string().required("Url is Required"),
  })
  .required();

const disallowedFilters = [
  "sort=Price",
  "sort=Rating",
  "filter=Price",
  "filter=Rating",
  "filter=Availability",
  // Add other disallowed filter patterns here
];

const Overview = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchUrl, setSearchUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await getRecentProducts();
        setProducts(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if the searchUrl contains disallowed filters
    if (disallowedFilters.some((filter) => searchUrl.includes(filter))) {
      // Handle the case where a disallowed URL is entered
      alert("Sorry, this URL contains disallowed filters.");
    } else {
      const product = await scrapeAndStoreProduct({ url: searchUrl });

      if (product) {
        navigate(`/product/${product._id}`);
      }
    }

    setLoading(false);
  };

  const scrapeAllProducts = async () => {
    setLoading(true);

    const product = await updateProductDetails();
    setLoading(false);
  };

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  return (
    <div>
      <Card className="mb-10" title="Search" titleClass="card-title">
        <div className="space-y-5">
          <InputGroup
            label="Search"
            placeholder="Paste your product url here"
            type="text"
            register={register}
            error={errors.searchUrl}
            className="h-[48px]"
            onChange={(e) => setSearchUrl(e.target.value)}
            id="searchUrl"
            append={
              <Button
                text="Search"
                className=" btn-dark"
                onClick={handleSubmit}
                isLoading={loading}
              />
            }
          />
        </div>
        <div className="m-5">
          <Button
            text="Search"
            className="btn-dark"
            onClick={scrapeAllProducts}
          />
        </div>
      </Card>
      <Card title="Recent Searches">
        {isLoading ? (
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
        )}
      </Card>
    </div>
  );
};

export default Overview;
