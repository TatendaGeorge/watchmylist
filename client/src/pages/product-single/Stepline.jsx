import React, { useState } from "react";
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import Button from "@/components/ui/Button";
import useDarkMode from "@/hooks/useDarkMode";

const Stepline = ({ priceHistory }) => {
  const [isDark] = useDarkMode();
  const [picker, setPicker] = useState([null, null]);
  const [isFilterActive, setIsFilterActive] = useState(false);

  if (!priceHistory) {
    // Handle the case where priceHistory is undefined
    return <div>No data to display.</div>;
  }

  // Create an object to store the latest data for each unique date
  const latestDataByDate = {};
  priceHistory.forEach((item, index) => {
    const date = new Date(item.date).toLocaleDateString('en-ZA', { timeZone: 'Africa/Johannesburg' });
    const time = new Date(item.date).toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' });
    // console.log(item);
    // console.log(time, date);
    // if(date === '06/11/2023') {
    //   console.log('here', item.price, index);
    // }
    // console.log(item.price, index);
    if (
      !latestDataByDate[date] ||
      new Date(item.date) > new Date(latestDataByDate[date].date)
    ) {
      latestDataByDate[date] = item;
    }
  });

  // Extract unique dates and their associated data
  const uniqueDates = Object.keys(latestDataByDate);
  // const uniqueData = uniqueDates.map((date) => latestDataByDate[date]);

  // Filter the unique data based on the selected date range
  const filteredData = uniqueDates
    .filter((date) => {
      const timestamp = new Date(latestDataByDate[date].date);
      return (
        (picker[0] === null || timestamp >= picker[0]) &&
        (picker[1] === null ||
          timestamp <= new Date(picker[1]).setHours(23, 59, 59, 999)) // Include end of the selected end date
      );
    })
    .map((date) => latestDataByDate[date]);

  // Extract and format the date to display both date and month
  const formattedDates = filteredData.map((item) => {
    const timestamp = new Date(item.date);
    const formattedDate = `${timestamp.getDate()} ${getMonthName(
      timestamp.getMonth()
    )}`;
    return formattedDate;
  });

  const series = [
    {
      name: "Original Price",
      data: filteredData.map((item) => item.originalPrice),
    },
    {
      name: "Current Price",
      data: filteredData.map((item) => item.price),
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "stepline",
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
        formatter: function (value) {
          // Customize the label by appending a currency symbol ('R')
          return "R" + value;
        },
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#334155" : "#e2e8f0",
      position: "back",
    },
    legend: {
      labels: {
        colors: isDark ? "#CBD5E1" : "#475569",
      },
    },
    xaxis: {
      type: "category",
      categories: formattedDates, // Use formatted dates as categories
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
    },
    markers: {
      hover: {
        sizeOffset: 4,
      },
    },
  };

  const clearFilter = () => {
    // Clear the date range filter by setting picker to its initial value
    setPicker([null, null]);
    setIsFilterActive(false);
  };

  return (
    <div>
      <div className="mt-5">
        <label className="form-label" htmlFor="range-picker">
          Filter by date
        </label>
        <div className="flex " style={{ width: "400px" }}>
          <Flatpickr
            value={picker}
            id="range-picker"
            placeholder="Select date range here"
            className="form-control py-2 mr-2"
            onChange={(date) => {
              setPicker(date);
              setIsFilterActive(true);
            }}
            options={{
              mode: "range",
              altInput: true,
              altFormat: "F j, Y",
              dateFormat: "Y-m-d",
              // defaultDate: ["2020-02-01", "2020-02-15"],
            }}
          />
          {isFilterActive && (
            <Button className="btn btn-sm btn-dark items-center" onClick={clearFilter}>
              Clear Filter
            </Button>
          )}
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height="350" />
    </div>
  );
};

export default Stepline;

// Function to get the month name based on the month number
function getMonthName(month) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month];
}
