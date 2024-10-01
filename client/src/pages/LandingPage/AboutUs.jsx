import React from "react";
import img from "../../assets/about.png";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listPlansAndReviews } from "../../api/Public";
import Loader from "../../Components/Loader/Loader";
import companyLogo from "../../assets/rosterize.png";

function AboutUs() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["plansAndReviews"],
    queryFn: listPlansAndReviews,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen sm:px-[120px] px-6 bg-[#00221c]">
      <header className="flex justify-between items-center py-6">
        <img src={companyLogo} width="60px" alt="Logo" />
      </header>
      <div className="grid sm:grid-cols-2 justify-between">
        <div className="grid-cols-1 flex items-center justify-center">
          <img className="object-cover" src={img} alt="" />
        </div>
        <div className="grid-cols-1 w-full">
          <div className="text-white mt-[30px]">
            <h3 className="text-[28px] font-bold">What we offer? Price plan</h3>

            <div className="flex flex-col">
              {data.plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-[#0E2442] text-white p-4 mt-4"
                >
                  <h3 className="text-[18px] font-bold">{plan.name}</h3>
                  <p className="sm:text-[16px] mt-1">
                    Number of Employees: {plan.range}
                  </p>
                  <p className="text-[16px] mt-1">Price: ${plan.cost}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-white mt-[30px]">
            <h3 className="text-[28px] font-bold">Testimonials:</h3>

            {data.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#0E2442] text-white p-4 mt-4"
              >
                <p className="sm:text-[16px] mt-1">
                  <span className="underline">“{review.review}”</span> -{" "}
                  {review.user.role},{" "}
                  {review.user.firstName || review.company.name}{" "}
                </p>
              </div>
            ))}
          </div>
          <div className="sm:flex-row flex-col justify-center lg:justify-start mt-10 sm:space-x-4 space-y-4">
            <Link to="/register" className="bg-[#0E2442] text-white py-2 px-9">
              Register
            </Link>
            <Link to="/login" className="bg-[#2E2E41] text-white py-2 px-9">
              Login
            </Link>
            <Link
              to="/enquiries"
              className="bg-[#0E2442] text-white py-2 px-9 "
            >
              Enquiries
            </Link>
            <Link to="/about-us" className="bg-[#2E2E41] text-white py-2 px-9">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
