import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { GetStaticProps, NextPage } from "next/types";
import { getCustomers } from "../api/customers";
import { useRouter } from "next/router";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Order ID",
    width: 100,
  },
  {
    field: "customerId",
    headerName: "Customer ID",
    width: 100,
  },
  {
    field: "customer",
    headerName: "Customer",
    width: 200,
    editable: true,
  },
  {
    field: "description",
    headerName: "Description",
    type: "string",
    width: 220,
    editable: true,
  },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    sortable: true,
    width: 160,
  },
];

export const getStaticProps: GetStaticProps = async () => {
  const data = await getCustomers();

  let orders: any = [];

  data.forEach((customer) => {
    if (customer.orders) {
      customer.orders.forEach((order) => {
        orders.push({
          ...order,
          customer: customer.name,
          customerId: customer._id,
          id: order._id,
          price: order.price.$numberDecimal,
        });
      });
    }
  });

  return {
    props: {
      orders: orders,
    },
    revalidate: 60,
  };
};

const Orders: NextPage = (props: any) => {
  const { customerId } = useRouter().query;
  console.log(customerId);
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        filterModel={{
          items: [
            {
              columnField: "customerId",
              operatorValue: "equals",
              value: customerId,
            },
          ],
        }}
        rows={props.orders}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  columnField: "customerId",
                  operatorValue: "equals",
                  value: customerId,
                },
              ],
            },
          },
        }}
      />
    </Box>
  );
};

export default Orders;
