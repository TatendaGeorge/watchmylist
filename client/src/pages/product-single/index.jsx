import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Stepline from "./Stepline";
import { getProduct, addUserEmailToProduct } from "@/services/productService";
import { useUser } from "@clerk/clerk-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import InputGroup from "@/components/ui/InputGroup";
import Switch from "@/components/ui/Switch";

const schema = yup
  .object({
    setDesiredPriceValue: yup.string().required("Price is Required"),
  })
  .required();

const ProductSingle = () => {
  const { id } = useParams();
  const { user, isLoaded } = useUser();
  const [userId, setUserId] = useState("");
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onSaleChecked, setOnSaleChecked] = useState(false);
  const [inStockChecked, setInStockChecked] = useState(false);
  const [priceDropChecked, setPriceDropChecked] = useState(false);
  const [desiredPriceChecked, setDesiredPriceChecked] = useState(false);
  const [atLeastOneOptionEnabled, setAtLeastOneOptionEnabled] = useState(false);
  const [desiredPriceValue, setDesiredPriceValue] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchProductData(id);
    const userId = user.id;
    const userEmail = user.primaryEmailAddress.emailAddress;

    setUserId(userId);
    setUserEmail(userEmail);
  }, [id, isLoaded, user, userId]);

  const fetchProductData = async (productId) => {
    try {
      const response = await getProduct({ id: productId });

      if (response) {
        setProduct(response);

        if (userId) {
          const currentUserTrackingInfo = response.users.find(
            (userObj) => userObj.userId === userId
          );

          if (currentUserTrackingInfo) {
            setOnSaleChecked(currentUserTrackingInfo.onSale);
            setInStockChecked(currentUserTrackingInfo.inStock);
            setPriceDropChecked(currentUserTrackingInfo.priceDrop);
            setDesiredPriceChecked(currentUserTrackingInfo.desiredPrice);
            setDesiredPriceValue(currentUserTrackingInfo.desiredPriceValue);
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  const handleOptionChange = () => {
    // Check if at least one option is enabled
    const atLeastOneEnabled =
      onSaleChecked ||
      inStockChecked ||
      priceDropChecked ||
      desiredPriceChecked;
    setAtLeastOneOptionEnabled(atLeastOneEnabled);
  };

  const trackProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trackingOptions = {
      userId: userId,
      productId: product._id,
      email: userEmail,
      onSale: onSaleChecked,
      inStock: inStockChecked,
      priceDrop: priceDropChecked,
      desiredPrice: desiredPriceChecked,
      desiredPriceValue: desiredPriceValue,
    };

    try {
      const response = await addUserEmailToProduct(trackingOptions);

      setLoading(false);
      toast.success("Successfully added to your list", {
        position: "bottom-left",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        icon: false,
      });
    } catch (error) {
      console.error("Error tracking product:", error);
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  return (
    <>
      <ToastContainer />
      <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg">
        <div className="pb-5">
          <div className="grid grid-cols-12  md:space-x-6 md:space-y-0 space-y-4 sm:space-y-4  rtl:space-x-reverse ">
            <div className=" col-span-12 md:col-span-5 lg:col-span-4 space-y-4 ">
              <div className="swiper swiper-initialized swiper-horizontal swiper-pointer-events mySwiper2">
                <div className="swiper-wrapper">
                  <div
                    className="swiper-slide h-[409px] w-[396px] py-11 px-14 rounded-md swiper-slide-active bg-secondary-0 border border-slate-200 dark:border-slate-700"
                    style={{ width: "445px", marginRight: "10px" }}
                  >
                    <img
                      className="  h-full w-full  object-contain  transition-all duration-300 group-hover:scale-105"
                      src={product.image}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="flex mt-6 space-x-3 rtl:space-x-reverse "></div>
            </div>
            <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-2 ">
              <div className="space-y-2">
                <h1 className="text-slate-900 dark:text-slate-300 text-xl lg:text-2xl font-medium ">
                  {product.title}
                </h1>
                <p className="flex items-center text-slate-900 dark:text-slate-300  font-normal text-sm lg:text-base space-x-1.5 rtl:space-x-reverse">
                  <span className="rtl:pr-2 text-slate-500 dark:text-slate-400">
                    {product.category}
                  </span>
                </p>
                <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                <div className="overflow-x-auto ">
                  <div className="inline-block max-w-full align-middle">
                    <div className="overflow-hidden ">
                      <table className="min-w-full   ">
                        <tbody className="bg-white  dark:bg-slate-800 ">
                          <tr className="space-x-6 rtl:space-x-reverse">
                            <td className="table-td py-2 pl-0 rtl:pr-0 font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400  ">
                              Price:
                            </td>
                            <td className="table-td py-2 space-x-2 rtl:space-x-reverse">
                              <span className="text-slate-900 dark:text-slate-300 font-semibold	text-base lg:text-xl">
                                R {product.currentPrice}
                              </span>
                              {/* <span className="badge  font-normal text-[10px] bg-danger-600 text-white ">
                                <span className="inline-flex items-center">
                                  <span>40%</span>
                                </span>
                              </span> */}
                            </td>
                          </tr>
                          <tr className="space-x-6 rtl:space-x-reverse">
                            <td className="table-td py-2 pl-0 rtl:pr-0 font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400  ">
                              Original Price:
                            </td>
                            <td className="table-td py-2 space-x-2 rtl:space-x-reverse">
                              <span className="text-slate-500 dark:text-slate-300	text-base lg:text-xl">
                                R {product.originalPrice}
                              </span>
                              {/* <span className="badge  font-normal text-[10px] bg-danger-600 text-white ">
                                <span className="inline-flex items-center">
                                  <span>40%</span>
                                </span>
                              </span> */}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 rtl:space-x-reverse pb-5">
                  <Modal
                    title="Track Product Price"
                    label="Track Price"
                    labelClass="btn btn inline-flex justify-center btn-outline-dark w-[180px] btn-sm  font-medium hover:bg-slate-900 dark:text-white hover:text-white dark:hover:text-white  dark:hover:bg-slate-700 flex items-center"
                    uncontrol
                    centered
                    onClose={showModal}
                    // disableBackdrop
                    footerContent={
                      <Button
                        text="Save"
                        className="btn-dark "
                        onClick={trackProduct}
                        isLoading={loading}
                        // disabled={!atLeastOneOptionEnabled}
                      />
                    }
                  >
                    <h4 className="font-medium text-lg mb-3 text-slate-900">
                      Tracking Options
                    </h4>
                    <div className="border shadow-base dark:shadow-none rounded-md p-3 mb-2">
                      <div className="flex flex-wrap mb-3 justify-between">
                        <div>On Sale </div>
                        <Switch
                          label=""
                          value={onSaleChecked}
                          onChange={() => setOnSaleChecked(!onSaleChecked)}
                        />
                      </div>
                    </div>
                    <div className="border shadow-base dark:shadow-none rounded-md p-3 mb-2">
                      <div className="flex flex-wrap mb-3 justify-between">
                        <div>In stock </div>
                        <Switch
                          label=""
                          value={inStockChecked}
                          onChange={() => setInStockChecked(!inStockChecked)}
                        />
                      </div>
                    </div>

                    <div className="border shadow-base dark:shadow-none rounded-md p-3 mb-2">
                      <div className="flex flex-wrap mb-3 justify-between">
                        <div>Price Drop </div>
                        <Switch
                          label=""
                          value={priceDropChecked}
                          onChange={() =>
                            setPriceDropChecked(!priceDropChecked)
                          }
                        />
                      </div>
                    </div>

                    <div className="border shadow-base dark:shadow-none rounded-md p-3 mb-2">
                      <div className="flex flex-wrap mb-3 justify-between">
                        <div>Desired Price</div>
                        <Switch
                          label=""
                          value={desiredPriceChecked}
                          onChange={() =>
                            setDesiredPriceChecked(!desiredPriceChecked)
                          }
                        />
                      </div>
                      {desiredPriceChecked ? (
                        <form onSubmit={handleSubmit(trackProduct)}>
                          <div className="mb-3">
                            <InputGroup
                              onChange={(e) =>
                                setDesiredPriceValue(e.target.value)
                              }
                              defaultValue={desiredPriceValue}
                              register={register}
                              error={errors.setDesiredPriceValue}
                              className="w-[46px]"
                              type="text"
                              prepend="R"
                              placeholder="100"
                            />
                          </div>
                        </form>
                      ) : null}
                    </div>
                  </Modal>
                  <Link
                    to={product.url}
                    target="_blank"
                    type="button"
                    className="btn inline-flex justify-center btn-outline-dark w-[180px] btn-sm bg-slate-900 dark:bg-slate-800  font-medium hover:bg-white text-white hover:text-slate-900 dark:hover:text-white  dark:hover:!bg-slate-700 flex items-center"
                  >
                    <span className="flex items-center">
                      <span>Buy Now On Takelot</span>
                    </span>
                  </Link>
                </div>
              </div>
              <div className="border-t border-slate-300 dark:border-slate-600">
                <Stepline priceHistory={product.priceHistory} />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5"></div>
      </div>
    </>
  );
};

export default ProductSingle;
