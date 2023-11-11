import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    
  return (
    <Card key={product._id} className="lg:col-span-3 col-span-12 bg-white">
      <Link to={{ pathname: "/product/" + product._id, state: product }} target="_blank">
        <div className="bg-secondary-0 border border-slate-200 dark:border-slate-700 dark:rounded relative h-[191px] flex flex-col justify-center items-center mb-3 rounded-md">
          <div className="h-[146px]">
            <img
              src={product.image}
              alt=""
              className="h-full w-full object-contain transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </Link>
      <div>
        <h6 className="text-slate-900 dark:text-slate-300 text-base font-medium mt-2 truncate">
          <Link to="#">{product.title}</Link>
        </h6>
        <p className="pb-4">
          <span className="text-slate-900 dark:text-slate-300 text-base font-medium mt-2 ltr:mr-2 rtl:mr-2">
            R {product.currentPrice}
          </span>
          <del className="text-slate-500 dark:text-slate-500 font-normal text-base">
            R {product.originalPrice}
          </del>
        </p>
        <Button className="btn btn inline-flex justify-center btn-outline-dark w-full btn-sm font-medium hover:bg-slate-900 hover:text-white dark:hover:text-white dark:hover:bg-slate-700">
          <span className="flex items-center">
            <span className="ltr:mr-2 rtl:ml-2 text-sm leading-none"></span>
            <span>Add to Cart</span>
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
