import React, { useState } from "react";
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import Button from "@/components/ui/Button";
import useDarkMode from "@/hooks/useDarkMode";
import { colors } from "@/constant/data";

const WatchListStepline = ({ priceHistory }) => {
    // console.log(priceHistory);
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
      name: "Current Price",
      data: filteredData.map((item) => item.price),
    },
  ];

  const options = {
    chart: {
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
      offsetX: 0,
      offsetY: 0,
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: [colors.primary],
    tooltip: {
      theme: "light",
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      type: "solid",
      opacity: [0.1],
    },
    legend: {
      show: false,
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
  };
  return <Chart options={options} series={series} type="area" height={48}/>;
};

export default WatchListStepline;

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
