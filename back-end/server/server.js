
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';
import AWS from 'aws-sdk';
import helmet from "helmet";
import OktaJwtVerifier from '@okta/jwt-verifier';
import * as excel from 'excel4node';
import * as CryptoJS from 'crypto-js';

import { Encryptor } from 'strong-cryptor'
import { Decryptor } from 'strong-cryptor'


const clientId = process.env.REACT_APP_OKTA_CLIENT_ID;
const oktaOrgUrl = process.env.REACT_APP_OKTA_ORG_URL;
console.log("oktaOrgUrl: " + oktaOrgUrl);
const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: clientId ,
  issuer: `${oktaOrgUrl}/oauth2/default`,
});

const accessKeyId=process.env.REACT_APP_ACCESS_KEY_ID;
const secretAccessKey=process.env.REACT_APP_SECRET_ACCESS_KEY;
const bucketName=process.env.REACT_APP_BUCKET_NAME;

const client = new Client({
    host: process.env.REACT_APP_POSTGRES_HOST,
    user: process.env.REACT_APP_POSTGRES_USERNAME,
    port: process.env.REACT_APP_POSTGRES_PORT,
    password: process.env.REACT_APP_POSTGRES_PASSWORD,  
    database: process.env.REACT_APP_POSTGRES_DATABASE,
  });

  try {
    client.connect();
    console.log("Connected to database.");
  } catch (error){
    console.log("Error connecting to the database:");
    console.log(error);
  }

const app = express();
app.disable('x-powered-by')
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(async (req, res, next) => {
  console.log(req.query);
  console.log(req.headers.authorization)
  if (req.query.encryption_text){
    next();
  } else {
    try {
      if (!req.headers.authorization) throw new Error('Authorization header is required (1)');

      let accessToken = "";

      try {
        accessToken = req.headers.authorization.trim().split(' ')[1];
      } catch (error) {
        next("Authorization header is required (2)")
      }
      
      await oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default');
      next();
    } catch (error) {
      next(error.message);
    }
  }
});


const key = process.env.REACT_APP_PASSWORD;

app.get('/encrypt', function routeHandler(req, res) {
  const data = req.query.encryption_text;
  const encryptor = new Encryptor({ key })
  const encryptedData = encryptor.encrypt(data)
  res.send(encryptedData);
});

app.get('/decrypt', function routeHandler(req, res) {
  let encryptedData = req.query.encryption_text.toString().replace(/ /g, "+");
  const decryptor = new Decryptor({ key })
  res.send(decryptor.decrypt(encryptedData));
});

function decrypt(encryption_text){
  let encryptedData = encryption_text.toString().replace(/ /g, "+");
  const decryptor = new Decryptor({ key })
  return(decryptor.decrypt(encryptedData));
}

app.get('/get_file/:file_name', function routeHandler(req, res) {
      let fileName = req.params.file_name;
      AWS.config.update(
        {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        }
      );
      var s3 = new AWS.S3();
      s3.getObject(
        { Bucket: bucketName, Key: fileName },
        function (error, data) {
          if (error != null) {
            res.send("Failed to retrieve an object: " + error);
          } else {
            res.send(data.Body);
            // res.send("Loaded " + data.ContentLength + " bytes");
          }
        }
      );
});

async function getDatapoints(statementId){
  let query = `SELECT 
                  id, statement_id, pricing_type, 
                  merchant_name, merchant_address, merchant_number, 
                  statement_period_start, statement_period_end, 
                  third_party_transactions, visa_credit_amount,
                  visa_credit_discrate, visa_credit_nrtransactions, 
                  visa_credit_transactionfee, visa_credit_discrateproposed, 
                  visa_credit_transactionfeeproposed, visa_debit_amount, 
                  visa_debit_discrate, visa_debit_nrtransactions, 
                  visa_debit_transactionfee, visa_debit_discrateproposed, 
                  visa_debit_transactionfeeproposed, visa_auth_nrtransactions, 
                  visa_auth_transactionfee, visa_auth_transactionfeeproposed, 
                  mastercard_credit_amount, mastercard_credit_discrate, 
                  mastercard_credit_nrtransactions, mastercard_credit_transactionfee, 
                  mastercard_credit_discrateproposed, mastercard_credit_transactionfeeproposed, 
                  mastercard_debit_amount, mastercard_debit_discrate, 
                  mastercard_debit_nrtransactions, mastercard_debit_transactionfee, 
                  mastercard_debit_discrateproposed, mastercard_debit_transactionfeeproposed,
                  mastercard_auth_nrtransactions, mastercard_auth_transactionfee, 
                  mastercard_auth_transactionfeeproposed, discover_credit_amount, 
                  discover_credit_discrate, discover_credit_nrtransactions, 
                  discover_credit_transactionfee, discover_credit_discrateproposed, 
                  discover_credit_transactionfeeproposed, discover_debit_amount, 
                  discover_debit_discrate, discover_debit_nrtransactions, 
                  discover_debit_transactionfee, ebt_discrate, 
                  discover_debit_discrateproposed, discover_debit_transactionfeeproposed, 
                  discover_auth_nrtransactions, discover_auth_transactionfee, 
                  discover_auth_transactionfeeproposed, american_express_amount, 
                  american_express_discrate, american_express_nrtransactions, 
                  american_express_transactionfee, american_express_discrateproposed, 
                  american_express_transactionfeeproposed, american_express_auth_nrtransactions, 
                  american_express_auth_transactionfee, american_express_auth_transactionfeeproposed, 
                  pin_debit_amount, pin_debit_discrate, pin_debit_nrtransactions, 
                  pin_debit_transactionfee, pin_debit_discrateproposed, 
                  pin_debit_transactionfeeproposed, ebt_amount, ebt_nrtransactions,
                  ebt_transactionfee, ebt_transactionfeeproposed, fleet_cards__other_amount, 
                  fleet_cards__other_discrate, fleet_cards__other_nrtransactions, 
                  fleet_cards__other_transactionfee, fleet_cards__other_discrateproposed, 
                  fleet_cards__other_transactionfeeproposed, interchange_and_downgrades, 
                  dues_and_assessments, pin_debit_interchange, avs_nrtransactions,
                  avs_transactionfee, pci_compliance, nonpci_compliance, batch_nrtransactions, 
                  batch_transactionfee, monthly, chargeback, surcharging, total_volume, 
                  total_fees, industry, representative_first_name, representative_last_name, 
                  representative_phone, representative_email, card_brands__other, processing_fees, 
                  passthrough_fees, other_fees, calculated_other_fees, total_calculated_fees,
                  monthly_fees, one_year_fees, three_year_fees, effective_rate, avoidable_fees, 
                  potential_savings, statement_period, total_nrtransactions, average_ticket,
                  processing_fees_proposed, interchange_and_downgrades_proposed, 
                  interchange_optimization_proposed, pin_debit_interchange_proposed, 
                  avs_transactionfee_proposed, pci_compliance_proposed, nonpci_compliance_proposed, 
                  batch_transactionfee_proposed, monthly_proposed, chargeback_proposed, 
                  other_fees_proposed, total_fees_proposed, effective_rate_proposed, 
                  monthly_savings, three_year_savings, passthrough_fees_proposed, percent_processing_fees, 
                  percent_processing_fees_proposed, percent_passthrough_fees, 
                  percent_passthrough_fees_proposed, calculated_other_fees_proposed, percent_other_fees, 
                  percent_other_fees_proposed, calculated_total_volume, card_brands__other_proposed, 
                  dues_and_assessments_proposed, surcharging_proposed, tiers_proposed, 
                  other_processing_fees, margin_proposed_company, company_residual_proposed, 
                  agent_residual_proposed, potential_margin_company, potential_margin_agent, 
                  processor_cost_proposed, margin_proposed_agent, passthrough_fees_to_substract, 
                  total_interchange_padding, total_card_brands_dues_and_assessments_padding
            FROM systemx.fn__proposal_datapoints_set pds
            where 1=1
            and pds.statement_id  = '` + statementId + `'`;

            const result = await client.query(query);
            let row = result.rows[0];
	    let originalMerchantName = "";
	    try {
		if(row.merchant_name !== undefined){
			originalMerchantName = row.merchant_name;
            		let merchantName = await decrypt(originalMerchantName);
            		row.merchant_name = merchantName;
		}
	    } catch(error) {
		console.log("Error getting merchant name: " + originalMerchantName);
		console.log(error);
 	    }//try

	    let originalMerchantAddress = "";
	    try {
		if(row.merchant_address !== undefined){
			originalMerchantAddress = row.merchant_address;
            		let merchantAddress = await decrypt(originalMerchantAddress);
            		row.merchant_address = merchantAddress;
		}
	    } catch(error) {
		console.log("Error getting merchant address: " + originalMerchantAddress);
		console.log(error);
 	    }//try

	    let originalMerchantNumber = "";
	    try {
		if(row.merchant_number !== undefined){
			originalMerchantNumber = row.merchant_number;
            		let merchantNumber = await decrypt(originalMerchantNumber);
            		row.merchant_number = merchantNumber;
		}
	    } catch(error) {
		console.log("Error getting merchant number: " + originalMerchantNumber);
		console.log(error);
 	    }//try

            return row;
}

async function getInterchange(datapointSetId){
  let query = `SELECT 
                  id, 
                  term, 
                  "_normalized", 
                  "_network", 
                  amount, 
                  count_tx, 
                  rate, 
                  per_tx, 
                  fee, 
                  standardrate, 
                  standard_per_tx, 
                  standard_fee, 
                  padding
              FROM 
                  systemx.fn__proposal_datapoints_set_interchange
              WHERE 1=1  
              and fn__proposal_datapoints_set_id = '` + datapointSetId + `'`;

            const result = await client.query(query);
            return result.rows;
}

async function getCardBrandsDuesAndAssessments(datapointSetId){
  let query = `SELECT 
                  id, 
                  term, 
                  "_normalized", 
                  "_network", 
                  amount, 
                  count_tx, 
                  rate, 
                  per_tx, 
                  fee, 
                  standardrate, 
                  standard_per_tx, 
                  standard_fee, 
                  padding
              FROM 
                  systemx.fn__proposal_datapoints_set_card_brands_dues_and_assessments
              WHERE 1=1  
              and fn__proposal_datapoints_set_id = '` + datapointSetId + `'`;

            const result = await client.query(query);
            return result.rows;
}

async function getCustomServiceProposed(datapointSetId){
  let query = `SELECT 
                  id, "_name", 
                  id_service, fee
              FROM 
                  systemx.fn__proposal_datapoints_set_custom_service_proposed
              WHERE 1=1  
              and fn__proposal_datapoints_set_id = '` + datapointSetId + `'`;

            const result = await client.query(query);
            return result.rows;
}


async function getProcessorSpecificFees(datapointSetId){
  let query = `SELECT 
                    id, 
                    term, 
                    category, 
                    "_network", 
                    amount, 
                    count_tx, 
                    rate, 
                    per_tx, 
                    fee, 
                    standardrate, 
                    standard_per_tx, 
                    standard_fee, 
                    padding
              FROM 
                    systemx.fn__proposal_datapoints_set_processor_specific_fees
              WHERE 1=1  
              and fn__proposal_datapoints_set_id = '` + datapointSetId + `'`;

            const result = await client.query(query);
            return result.rows;
}

async function getUnknownFees(datapointSetId){
  let query = `SELECT 
                  id, 
                  term, 
                  "_normalized", 
                  "_network", 
                  amount, 
                  count_tx, 
                  rate, 
                  per_tx, 
                  fee
              FROM 
                  systemx.fn__proposal_datapoints_set_unknown_fees  
              WHERE 1=1  
              and fn__proposal_datapoints_set_id = '` + datapointSetId + `'`;

            const result = await client.query(query);
            return result.rows;
}

async function getInterchangeOptimizations(statementId){
  let query = `SELECT 
                  s_statement_id,
                  o_id,
                  o_total_savings,
                  oi_id,
                  oi_term,
                  oi_normalized,
                  oi_network,
                  oi_amount,
                  oi_rate,
                  oi_count_tx,
                  oi_per_tx,
                  oi_fee,
                  oi_padding,
                  oi_padding_percentage,
                  oi_standard_cost,
                  oi_standard_rate,
                  oi_standard_per_tx,
                  oi_optimized_cost_index,
                  oi_savings,
                  oi_optimized_cost,
                  oia_id,
                  oia_optimized_category,
                  oia_optimized_rate,
                  oia_optimized_per_tx,
                  oia_optimized_cost,
                  oia_savings
              FROM 
                  systemx.interchange_optimizations  
              WHERE 1=1  
              and s_statement_id = '` + statementId + `'`;

            const result = await client.query(query);
            return result.rows;
}




app.get('/get_excel_file/:file_name', async function routeHandler(req, res) {
  let fileName = "data_points_for_statement_" + req.params.file_name + ".xlsx";
  let statementId = req.params.file_name.slice(0, -5);


  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Data Points');
  
  //,
 // numberFormat: '$#,##0.00; ($#,##0.00); -'
  const styleHeader = workbook.createStyle({
    font: {
      color: '#000000',
      bold: true,
      size: 12
    }
  });

  const styleDetail = workbook.createStyle({
    font: {
      color: '#000000',
      size: 12
    }
  });

  let datapointsJson = await getDatapoints(statementId);


  worksheet.addImage({
    path: './server/verisave.png',
    type: 'picture',
    position: {
      type: 'absoluteAnchor',
      x: '0in',
      y: '0in',
    },
  });

  const styleMerchantName= workbook.createStyle({
    font: {
      color: '#000099',
      bold: true,
      size: 36
    }
  });

  const styleSectionHeading= workbook.createStyle({
    font: {
      color: '#FF9900',
      bold: true,
      size: 24
    }
  });

  const styleSectionSubHeading= workbook.createStyle({
    font: {
      color: '#CC6600',
      bold: true,
      size: 12
    }
  });

const bgStyle = workbook.createStyle({
  fill: {
    type: 'pattern',
    patternType: 'solid',
    bgColor: '#FFFFFF',
    fgColor: '#FFFFFF',
  }
});
  worksheet.cell(1, 1, 3, 6).style(bgStyle);

  try {
	if (datapointsJson["merchant_name"] !== undefined) {
  		let merchantName = datapointsJson["merchant_name"];
  		if ((merchantName === undefined) || (merchantName === "")){
			merchantName = "";
  		}//if
  		worksheet.cell(2,2).string(merchantName).style(styleMerchantName);
	}
  } catch (error) {
	console.log("Error attempting to fetch merchant name: " + merchantName);
	console.log(error);
  }//try

  let i = 4
  let colOffset = 0;
  let maxWidthHeader = 0;
  let maxWidthData = 0
  let datapointSetId = datapointsJson['id'];
  for (var key in datapointsJson) {
    if (datapointsJson.hasOwnProperty(key)) {
        worksheet.cell(i, 1 + colOffset,).string(key).style(styleHeader);
        maxWidthHeader = (key.length > maxWidthHeader? key.length : maxWidthHeader); 
        if(typeof datapointsJson[key] === "string"){
          maxWidthData = (datapointsJson[key].length > maxWidthData? datapointsJson[key].length : maxWidthData) ; 
          worksheet.cell(i, 2 + colOffset).string(datapointsJson[key]).style(styleDetail);
        } else {
          populateValue(worksheet, i,2 + colOffset, datapointsJson[key], styleDetail);
        }
        i++; 
    }//if

    if(i % 55 == 0){
      worksheet.column(1 + colOffset).setWidth(maxWidthHeader + 2 );
      worksheet.column(2 + colOffset).setWidth(maxWidthData + 2 );
      maxWidthHeader = 0;
      maxWidthData = 0
      colOffset += 2;
      i = 4;
    }
  }//for

  let thisRow = 57; 
  //--------------
  // Custom Service Proposed
  //--------------
  worksheet.cell(thisRow,1).string("CUSTOM SERVICE PROPOSED").style(styleSectionHeading);
  let customServiceProposed = await getCustomServiceProposed(datapointSetId);
  thisRow++;
  thisRow++;
  for(i = 0; i < customServiceProposed.length; i++){
    let customServiceProposedId = customServiceProposed[i].id;
    worksheet.cell(thisRow,1).string("id").style(styleHeader);
    populateValue(worksheet, thisRow,2, customServiceProposedId, styleDetail);
    thisRow++;
    let customServiceProposedName = customServiceProposed[i]._name;
    worksheet.cell(thisRow,1).string("name").style(styleHeader);
    populateValue(worksheet, thisRow,2, customServiceProposedName, styleDetail);
    thisRow++;
    let customServiceProposedIdService = customServiceProposed[i].id_service;
    worksheet.cell(thisRow,1).string("id_service").style(styleHeader);
    populateValue(worksheet, thisRow,2, customServiceProposedIdService, styleDetail);
    thisRow++;
    let customServiceProposedFee = customServiceProposed[i].fee;
    worksheet.cell(thisRow,1).string("fee").style(styleHeader);
    populateValue(worksheet, thisRow,2, customServiceProposedFee, styleDetail);
    thisRow++;
    thisRow++;
  }//for


  if (customServiceProposed.length == 0){
    worksheet.cell(59,1).string("No records found.").style(styleHeader);
    thisRow++;
    thisRow++;
  } 
  thisRow++;

  //--------------
  // Interchange
  //--------------
  worksheet.cell(thisRow ,1).string("INTERCHANGE").style(styleSectionHeading);
  let interchange = await getInterchange(datapointSetId);
  thisRow++;
  thisRow++;
  for(i = 0; i < interchange.length; i++){
    let interchangeTerm = interchange[i].term;
    worksheet.cell(thisRow,1).string("term").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeTerm, styleDetail);
    thisRow++;
    let interchangeNormalized = interchange[i]._normalized;
    worksheet.cell(thisRow,1).string("normalized").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeNormalized, styleDetail);
    thisRow++;
    let interchangeNetwork = interchange[i]._network;
    worksheet.cell(thisRow,1).string("network").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeNetwork, styleDetail);
    thisRow++;
    let interchangeAmount = interchange[i].amount;
    worksheet.cell(thisRow,1).string("amount").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeAmount, styleDetail);
    thisRow++;
    let interchangeCountTx = interchange[i].count_tx
    worksheet.cell(thisRow,1).string("countTx").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeCountTx, styleDetail);
    thisRow++;
    let interchangeRate = interchange[i].rate;
    worksheet.cell(thisRow,1).string("rate").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeRate, styleDetail);
    thisRow++;
    let interchangePerTx = interchange[i].per_tx;
    worksheet.cell(thisRow,1).string("perTx").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangePerTx, styleDetail);
    thisRow++;
    let interchangeFee = interchange[i].fee;
    worksheet.cell(thisRow,1).string("fee").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeFee, styleDetail);
    thisRow++;
    let interchangeStandardRate = interchange[i].standardrate;
    worksheet.cell(thisRow,1).string("standard_rate").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeStandardRate, styleDetail);
    thisRow++;
    let interchangeStandardPerTx = interchange[i].standard_per_tx;
    worksheet.cell(thisRow,1).string("standard_per_tx").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeStandardPerTx, styleDetail);
    thisRow++;
    let interchangeStandardFee = interchange[i].standard_fee;
    worksheet.cell(thisRow,1).string("standard_fee").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangeStandardFee, styleDetail);
    thisRow++;
    let interchangePadding = interchange[i].padding;
    worksheet.cell(thisRow,1).string("padding").style(styleHeader);
    populateValue(worksheet, thisRow,2, interchangePadding, styleDetail);
    thisRow++;
    thisRow++;
  }//for

  if (interchange.length == 0){
    worksheet.cell(thisRow,1).string("No records found.").style(styleHeader);
    thisRow++;
    thisRow++;
  }

  thisRow++;

  //--------------
  // Processor Specific Fees
  //--------------
  worksheet.cell(thisRow ,1).string("PROCESSOR SPECIFIC FEES").style(styleSectionHeading);
  let processorSpecificFees = await getProcessorSpecificFees(datapointSetId);
  thisRow++;
  thisRow++;
  
  for(i = 0; i < processorSpecificFees.length; i++){
    let processorSpecificFeesTerm = processorSpecificFees[i].term;
    worksheet.cell(thisRow,1).string("term").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesTerm, styleDetail);
    thisRow++;
    let processorSpecificFeesCategory = processorSpecificFees[i]._normalized;
    worksheet.cell(thisRow,1).string("category").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesCategory, styleDetail);
    thisRow++;
    let processorSpecificFeesNetwork = processorSpecificFees[i]._network;
    worksheet.cell(thisRow,1).string("network").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesNetwork, styleDetail);
    thisRow++;
    let processorSpecificFeesAmount = processorSpecificFees[i].amount;
    worksheet.cell(thisRow,1).string("amount").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesAmount, styleDetail);
    thisRow++;
    let processorSpecificFeesCountTx = processorSpecificFees[i].count_tx;
    worksheet.cell(thisRow,1).string("countTx").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesCountTx, styleDetail);
    thisRow++;
    let processorSpecificFeesRate = processorSpecificFees[i].rate;
    worksheet.cell(thisRow,1).string("rate").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesRate, styleDetail);
    thisRow++;
    let processorSpecificFeesPerTx = processorSpecificFees[i].per_tx;
    worksheet.cell(thisRow,1).string("perTx").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesPerTx, styleDetail);
    thisRow++;
    let processorSpecificFeesFee = processorSpecificFees[i].fee;
    worksheet.cell(thisRow,1).string("fee").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesFee, styleDetail);
    thisRow++;
    let processorSpecificFeesStandardRate = processorSpecificFees[i].standardrate;
    worksheet.cell(thisRow,1).string("standard_rate").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesStandardRate, styleDetail);
    thisRow++;
    let processorSpecificFeesStandardPerTx = processorSpecificFees[i].standard_per_tx;
    worksheet.cell(thisRow,1).string("standard_per_tx").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesStandardPerTx, styleDetail);
    thisRow++;
    let processorSpecificFeesStandardFee = processorSpecificFees[i].standard_fee;
    worksheet.cell(thisRow,1).string("standard_fee").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesStandardFee, styleDetail);
    thisRow++;
    let processorSpecificFeesPadding = processorSpecificFees[i].padding;
    worksheet.cell(thisRow,1).string("padding").style(styleHeader);
    populateValue(worksheet, thisRow,2, processorSpecificFeesPadding, styleDetail);
    thisRow++;
    thisRow++;
  }//for

  if (processorSpecificFees.length == 0){
    worksheet.cell(thisRow,1).string("No records found.").style(styleHeader);
    thisRow++;
    thisRow++;
  }

  thisRow++;
  
  //--------------
  // UNKNOWN FEES
  //--------------
  worksheet.cell(thisRow ,1).string("UNKNOWN FEES").style(styleSectionHeading);
  let unknownFees = await getUnknownFees(datapointSetId);
  thisRow++;
  thisRow++;
  
  for(i = 0; i < unknownFees.length; i++){
    let unknownFeesTerm = unknownFees[i].term;
    worksheet.cell(thisRow,1).string("term").style(styleHeader);
    populateValue(worksheet, thisRow,2, unknownFeesTerm, styleDetail);
    thisRow++;
    let unknownFeesCategory = unknownFees[i]._normalized;
    worksheet.cell(thisRow,1).string("category").style(styleHeader);
    populateValue(worksheet, thisRow,2, unknownFeesCategory, styleDetail);
    thisRow++;
    let unknownFeesNetwork = unknownFees[i]._network;
    worksheet.cell(thisRow,1).string("network").style(styleHeader);
    populateValue(worksheet, thisRow,2, unknownFeesNetwork, styleDetail);
    thisRow++;
    let unknownFeesAmount = unknownFees[i].amount;
    worksheet.cell(thisRow,1).string("amount").style(styleHeader);
    populateValue(worksheet, thisRow,2, unknownFeesAmount, styleDetail);
    thisRow++;
    let unknownFeesCountTx = unknownFees[i].count_tx;
    worksheet.cell(thisRow,1).string("countTx").style(styleHeader);
    populateValue(worksheet, thisRow,2, unknownFeesCountTx, styleDetail);
    thisRow++;
    let unknownFeesRate = unknownFees[i].rate;
    worksheet.cell(thisRow,1).string("rate").style(styleHeader);
    populateValue(worksheet, thisRow,2, unknownFeesRate, styleDetail);
    thisRow++;
    let unknownFeesPerTx = unknownFees[i].per_tx;
    worksheet.cell(thisRow,1).string("perTx").style(styleHeader);
    populateValue(worksheet, thisRow,2, unknownFeesPerTx, styleDetail);
    thisRow++;
    let unknownFeesFee = unknownFees[i].fee;
    worksheet.cell(thisRow,1).string("fee").style(styleHeader);
    populateValue(worksheet, thisRow,2, unknownFeesFee, styleDetail);
    thisRow++;
    thisRow++;
  }//for

  if (unknownFees.length == 0){
    worksheet.cell(thisRow,1).string("No records found.").style(styleHeader);
    thisRow++;
    thisRow++;
  }

  thisRow++;
  //--------------
  // INTERCHANGE OPTIMIZATIONS
  //--------------
  worksheet.cell(thisRow ,1).string("INTERCHANGE OPTIMIZATIONS").style(styleSectionHeading);
  let interchangeOptimizations = await getInterchangeOptimizations(statementId);
  thisRow++;
  thisRow++;
  
  let lastId = 0;
  for(i = 0; i < interchangeOptimizations.length; i++){
    
    let interchangeOptimizationsId = interchangeOptimizations[i].o_id;
    if (interchangeOptimizationsId !== lastId ) {
      worksheet.cell(thisRow,1).string("id").style(styleHeader);
      populateValue(worksheet, thisRow,2, interchangeOptimizationsId, styleDetail);
      thisRow++;
      let interchangeOptimizationsTotalSavings = interchangeOptimizations[i].o_total_savings;
      worksheet.cell(thisRow,1).string("total_savings").style(styleHeader);
      populateValue(worksheet, thisRow,2, interchangeOptimizationsTotalSavings, styleDetail);
      thisRow++;

          //--------------
          // ITEMS
          //--------------
          thisRow++;
          
          let lastItemId = 0;
          for(let j = 0; j < interchangeOptimizations.length; j++){
            let o_id = interchangeOptimizations[j].o_id;
            if (o_id === interchangeOptimizationsId){
              let item_id = interchangeOptimizations[j].oi_id;
              if(item_id !== lastItemId){
                worksheet.cell(thisRow, 2).string("ITEM").style(styleSectionSubHeading);
                thisRow++;
                worksheet.cell(thisRow,2).string("item_id").style(styleHeader);
                populateValue(worksheet, thisRow,3, item_id, styleDetail);
                thisRow++;
                let val = interchangeOptimizations[j].oi_term;
                worksheet.cell(thisRow,2).string("item_term").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_normalized;
                worksheet.cell(thisRow,2).string("item_normalized").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_network;
                worksheet.cell(thisRow,2).string("item_network").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_amount;
                worksheet.cell(thisRow,2).string("item_amount").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_rate;
                worksheet.cell(thisRow,2).string("item_rate").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_count_tx;
                worksheet.cell(thisRow,2).string("item_count_tx").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_per_tx;
                worksheet.cell(thisRow,2).string("item_per_tx").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_fee;
                worksheet.cell(thisRow,2).string("item_fee").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_padding;
                worksheet.cell(thisRow,2).string("item_padding").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_padding_percentage;
                worksheet.cell(thisRow,2).string("item_padding_percentage").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_standard_cost;
                worksheet.cell(thisRow,2).string("item_standard_cost").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_standard_rate;
                worksheet.cell(thisRow,2).string("item_standard_rate").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_standard_per_tx;
                worksheet.cell(thisRow,2).string("item_standard_per_tx").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_optimized_cost_index;
                worksheet.cell(thisRow,2).string("item_optimized_cost_index").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_savings;
                worksheet.cell(thisRow,2).string("item_savings").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;
                val = interchangeOptimizations[j].oi_optimized_cost;
                worksheet.cell(thisRow,2).string("item_optimized_cost").style(styleHeader);
                populateValue(worksheet, thisRow,3, val, styleDetail);
                thisRow++;

                    //--------------
                    // AVAILABILITY
                    //--------------
                    thisRow++;
                    
                    for(let k = 0; k < interchangeOptimizations.length; k++){
                      let oi_id = interchangeOptimizations[k].oi_id;
                      if (oi_id === item_id){
                        worksheet.cell(thisRow, 3).string("AVAILABILITY").style(styleSectionSubHeading);
                        thisRow++;
                        let item_availability_id = interchangeOptimizations[k].oia_id;
                        worksheet.cell(thisRow,3).string("item_avaiability_id").style(styleHeader);
                        populateValue(worksheet, thisRow,4, item_availability_id, styleDetail);
                        thisRow++;
                        val = interchangeOptimizations[j].oia_optimized_category;
                        worksheet.cell(thisRow,3).string("optimized_category").style(styleHeader);
                        populateValue(worksheet, thisRow,5, val, styleDetail);
                        thisRow++;
                        val = interchangeOptimizations[j].oia_optimized_rate;
                        worksheet.cell(thisRow,3).string("optimized_rate").style(styleHeader);
                        populateValue(worksheet, thisRow,4, val, styleDetail);
                        thisRow++;
                        val = interchangeOptimizations[j].oia_optimized_per_tx;
                        worksheet.cell(thisRow,3).string("optimized_per_tx").style(styleHeader);
                        populateValue(worksheet, thisRow,4, val, styleDetail);
                        thisRow++;
                        val = interchangeOptimizations[j].oia_optimized_cost;
                        worksheet.cell(thisRow,3).string("optimized_cost").style(styleHeader);
                        populateValue(worksheet, thisRow,4, val, styleDetail);
                        thisRow++;
                        val = interchangeOptimizations[j].oia_optimized_savings;
                        worksheet.cell(thisRow,3).string("optimized_savings").style(styleHeader);
                        populateValue(worksheet, thisRow,4, val, styleDetail);
                        thisRow++;
                        thisRow++;
                      }//if
                    }//for

                lastItemId = item_id;
                thisRow++;
                thisRow++;
              }
            }//if
          }//for

      lastId = interchangeOptimizationsId;
      thisRow++;
      thisRow++;
    }
  }//for

  if (interchangeOptimizations.length == 0){
    worksheet.cell(thisRow,1).string("No records found.").style(styleHeader);
    thisRow++;
    thisRow++;
  }

  thisRow++;

  workbook.write(fileName, res);
  // res.end();
});

function populateValue(worksheet, row, column, value, style){
  try {
    switch(typeof value) {
      case "number":
        worksheet.cell(row, column).number(value).style(style);            
        break;
      case "string":
        worksheet.cell(row, column).string(value).style(style);
        break;
      case "boolean":
        worksheet.cell(row, column).bool(value).style(style);
        break;
      case "undefined":
        worksheet.cell(row, column).string("").style(style);
        break;
    }
  }catch(error) {
    console.log("An error occured at row " + row + ", column " + column + " on value " + value);
  }
}

app.get('/statements', async function routeHandler(req, res) {

    let query = `SELECT statement_id, merchant_name, 
    merchant_number, 
    TO_char(scan_date, 'MM/DD/YYYY HH12:MI:SS am') scan_date,
    period_start_date,
    period_end_date,
    scanned_statement_pdf_url, 
    fee_navigator_proposal_excel_url
    FROM systemx."statement"`;
    client.query(query,async  (err, results) => {
        if (err) {
            console.error(err);
            return;
        }

        for (let row of results.rows){
	    let merchantName = "";
            try{
              merchantName =  row["merchant_name"];
              row["merchant_name"] = await decrypt(merchantName);
            } catch(error){
		console.log("Error getting and decrypting merchant name: " + merchantName);
              	console.log(error)
            }

            let merchantNumber = "";
	    try {
              merchantNumber = row["merchant_number"];
              row["merchant_number"] = await decrypt(merchantNumber);
            } catch(error){
		console.log("Error getting and decrypting merchant number: " + merchantNumber);
              	console.log(error)
            }

        }
        res.send(results.rows); 
    });
});

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.use(helmet());
app.use(cors({
    origin: '*'
}));

app.listen(5000, () => {
    console.log('Started on localhost:5000');
});
