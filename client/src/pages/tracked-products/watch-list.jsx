import React, { useMemo, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { colors } from "@/constant/data";
import { useUser } from "@clerk/clerk-react";
import GlobalFilter from "./GlobalFilter";
import WatchListStepline from "./Stepline";

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
    low: 0,
    offsetX: 0,
    offsetY: 0,
    show: false,
    labels: {
      low: 0,
      offsetX: 0,
      show: false,
    },
    axisBorder: {
      low: 0,
      offsetX: 0,
      show: false,
    },
  },
};

const series = [
  {
    data: [800, 600, 1000, 800, 600, 1000, 800, 900],
  },
];

const actions = [
  {
    name: "view",
    icon: "heroicons-outline:eye",
  },
  {
    name: "edit",
    icon: "heroicons:pencil-square",
  },
  {
    name: "delete",
    icon: "heroicons-outline:trash",
  },
];

const COLUMNS = [
  {
    Header: "Product",
    accessor: "title",
    Cell: (row) => (
      <span className="text-sm text-slate-600 dark:text-slate-300 capitalize truncate">
        {row.value}
      </span>
    ),
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: (row) => (
      <span className="block min-w-[140px] text-left">
        <span className="inline-block text-center mx-auto py-1">
          {row.value === "complete" ? (
            <span className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="h-[6px] w-[6px] bg-danger-500 rounded-full inline-block ring-4 ring-opacity-30 ring-danger-500"></span>
              <span>Stopped</span>
            </span>
          ) : (
            <span className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="h-[6px] w-[6px] bg-success-500 rounded-full inline-block ring-4 ring-opacity-30 ring-success-500"></span>
              <span>In Progress</span>
            </span>
          )}
        </span>
      </span>
    ),
  },
  {
    Header: "Current Price",
    accessor: "chart",
    Cell: (row) => (
      <span>
        <WatchListStepline priceHistory={row.value} />
        {/* <Chart options={options} series={series} type="area" height={48} /> */}
      </span>
    ),
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: (row) => (
      <div className="flex space-x-3 rtl:space-x-reverse">
        <Tooltip content="View Product" placement="top" arrow animation="shift-away">
          <button className="action-btn" type="button">
            <Icon icon="heroicons:eye" />
          </button>
        </Tooltip>
        <Tooltip content="Edit Tracking Options" placement="top" arrow animation="shift-away">
          <button className="action-btn" type="button">
            <Icon icon="heroicons:pencil-square" />
          </button>
        </Tooltip>
        <Tooltip
          content="Remove From List"
          placement="top"
          arrow
          animation="shift-away"
          theme="danger"
        >
          <button className="action-btn" type="button">
            <Icon icon="heroicons:trash" />
          </button>
        </Tooltip>
      </div>
    ),
  },
];

const WatchList = ({ products }) => {
  const { user, isLoaded } = useUser();
  const [userId, setUserId] = useState("");
  const columns = useMemo(() => COLUMNS, []);

  const data = useMemo(() => {
    const product = products.map((product) => {
      // Check if any of the tracking options are true
      const anyTrackingOptionTrue = product.users.some(
        (userObj) =>
          userObj.onSale ||
          userObj.inStock ||
          userObj.priceDrop ||
          userObj.desiredPrice
      );

      return {
        title: product.title,
        status: anyTrackingOptionTrue ? "progress" : "complete",
        trackers: product.users.find((userObj) => userObj.userId === userId),
        chart: product.priceHistory,
        action: "actions",
      };
    });
    return product;
  }, [products]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const userId = user.id;

    setUserId(userId);
  }, [isLoaded, user, userId]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 6,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state

  return (
    <div>
      <div className="md:flex justify-between items-center mb-6.l">
        <div>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
      </div>
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden ">
            <table
              className=" divide-y divide-slate-100 table-fixed dark:divide-slate-700 pb-10"
              {...getTableProps}
            >
              <thead className="bg-slate-100 dark:bg-slate-700">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        scope="col"
                        className="table-th "
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                {...getTableBodyProps}
              >
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="table-td py-2"
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchList;