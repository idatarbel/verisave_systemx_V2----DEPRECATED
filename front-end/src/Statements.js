
import React, { Component } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { withOktaAuth } from '@okta/okta-react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import FileDownloadRenderer from './Components/FileDownloadRenderer';
import DatapointsDownloadRenderer from './Components/DatapointsDownloadRenderer';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import './ag-grid.css';
// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ServerSideRowModelModule,RangeSelectionModule,
  MenuModule,
  ClipboardModule]);

export default withOktaAuth(class Statements extends Component {
  constructor(props) {
    super(props);

   
    const cellClassRules = {
      "cell-pass": params => params.value + "" !== "",
      "cell-fail": params => params.value + "" === "" 
    };

    function isMerchantNameSuspect(val){
      if (val.includes("recommend") ){ return true;}
      if (val.includes("_____") ){ return true;}
      if (val.includes(" STMT ") ){ return true;}
      if ((val.length > 0) && (val.length < 2 )){ return true;}
      let isnum = /^\d+$/.test(val);
      if (isnum){ return true;}
    }

    this.state = {
      columnDefs: [
        {
          headerName: "Id",
          sortable: true,
          width: 5,
          valueGetter: "parseInt(node.id) + 1",
          filter: "agNumberColumnFilter",
          cellClass: 'standard-cell',
          comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB,
        },
        {
          headerName: "Statement Id",
          sortable: true,
          width: 100,
          field: "statement_id", 
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Merchant",
          cellClassRules: cellClassRules,
          sortable: true,
          field: "merchant_name",
          filter: "agTextColumnFilter",
          width: 150,
          cellStyle: params => {
            if (isMerchantNameSuspect(params.data.merchant_name)) {
                return  {
                  fontWeight: "bold",
                  backgroundColor: "#FFFF99"
                };
            }
          }
        },
        {
          headerName: "Number",
          cellClassRules: cellClassRules,
          sortable: true,
          field: "merchant_number",
          filter: "agTextColumnFilter",
          width: 150
        },
        {
          headerName: "Scan Date",
          sortable: true,
          field: "scan_date",
          filter: "agDateColumnFilter",
          width: 200
        },
        {
          headerName: "Period Start",
          cellClassRules: cellClassRules,
          sortable: true,
          field: "period_start_date",
          filter: "agDateColumnFilter",
          width: 90,
          cellStyle: params => {
            if (!params.data.period_end_date) {
                return  {
                  fontWeight: "bold",
                  backgroundColor: "#FFCCCC"
                };
            }
          }
        },
        {
          headerName: "Period End",
          sortable: true,
          field: "period_end_date",
          filter: "agDateColumnFilter",
          width: 110,
          cellStyle: params => {
            if (!params.data.period_end_date) {
                return  {
                  fontWeight: "bold",
                  backgroundColor: "#FFCCCC"
                };
            }
          }
        },
       
        {
          headerName: "Statement",
          field: "scanned_statement_pdf_url",
          width: 80, 
          cellRenderer: FileDownloadRenderer
        },
        {
          headerName: "Proposal",
          field: "fee_navigator_proposal_excel_url",
          width: 80, 
          cellRenderer: FileDownloadRenderer
        },
        {
          headerName: "Data Points",
          field: "statement_id",
          width: 80, 
          cellRenderer: DatapointsDownloadRenderer
        }
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        resizable: true,
        sortable: true,
      },
      rowModelType: 'serverSide',
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const updateData = (data) => {
      // setup the fake server with entire dataset
      var fakeServer = createFakeServer(data);
      // create datasource with a reference to the fake server
      var datasource = createServerSideDatasource(fakeServer);
      // register the datasource with the grid
      params.api.setServerSideDatasource(datasource);
    };


    let url = process.env.REACT_APP_API_BASE_URL + "/statements";
    let method = "GET";
    let token = this.props.authState.accessToken.accessToken;
    sessionStorage.setItem("token", token);
    async function doFetch() {
      fetch(url, {
                    method: method,
                    headers: {
                      'content-type': 'application/json',
                      accept: 'application/json',
                      authorization: `Bearer ${token}`,
                    },
                  })
      .then(res => res.json())
      .then(data => {
        updateData(data);
      });
    }
    doFetch();
   
  };

  render() {
    return (
              <>
                <Header 
                  userName={ this.props.authState.idToken.claims.name} 
                  isAuthenticated={this.props.authState?.isAuthenticated}
                  oktaAuth={this.props.oktaAuth}
                />
                  <div>
                    <div className="text-center">
                      <h1 className="display-6">Statements</h1>
                      <div>
                        <div id="myGrid"
                          style={{
                            height: "500px",
                            width: "100%"
                          }}
                          className="ag-theme-alpine"
                        >
                            <AgGridReact
                              columnDefs={this.state.columnDefs}
                              defaultColDef={this.state.defaultColDef}
                              rowModelType={this.state.rowModelType}
                              animateRows={true}
                              onGridReady={this.onGridReady}
                              enableRangeSelection={true}
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    
                    <div style={{width: "200px", paddingTop: "20px"}}>
                      <div style={{fontWeight: "bold", textAlign: "center"}}>Legend</div>
                      <div className="cell-fail">Bad Data</div>
                      <div className="cell-possible-fail">Possibly Bad Data</div>
                    </div>
                  </div>
                <Footer/>
              </>
    );
  }
});


function createServerSideDatasource(server) {
  return {
    getRows: (params) => {
      console.log(
        '[Datasource] - rows requested by grid: startRow = ' +
          params.request.startRow +
          ', endRow = ' +
          params.request.endRow
      );
      var response = server.getData();

      params.success({ rowData: response.rows });
    },
  };
}
function createFakeServer(allData) {
  return {
    getData: () => {
      return {
        success: true,
        rows: allData,
      };
    },
  };
}