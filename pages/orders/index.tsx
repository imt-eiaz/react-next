import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { GetStaticProps, NextPage } from "next/types";
import { getCustomers } from "../api/customers";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "customer",
    headerName: "Customer",
    width: 150,
    editable: true,
  },
  {
    field: "description",
    headerName: "Description",
    type: "string",
    width: 110,
    editable: true,
  },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export const getStaticProps: GetStaticProps = async () => {
  const data = await getCustomers();

  // let orders: any = [];

  // data.forEach((customer) => {
  //   if (customer.orders) {
  //     customer.orders.forEach((order) => {
  //       console.log(order);
  //     });
  //   }
  // });

  return {
    props: {
      orders: data
        .map((customer) => {
          return (
            customer.orders?.push({
              ...order,
              customer: customer.name,
              id: order._id,
            }) || null
          );
        })
        .flat(1)
        .filter((order) => {
          return order != null;
        }),
    },
    revalidate: 60,
  };
};

const Orders: NextPage = (props: any) => {
  console.log(props);
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={props.orders}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Box>
  );
};

export default Orders;
