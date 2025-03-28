# Source code generated by Amphi for Dagster
# Date: 2025-03-28 16:47:20
# Additional dependencies: dagster, psycopg2-binary
import dagster
from dagster import op, job, Out, In, Nothing
import pandas as pd
import re
import sqlalchemy
import psycopg2
# No environment variable components found.
import os

# Connection constants for Postgres
POSTGRES_HOST = "psqldb"
POSTGRES_PORT = "5432"
POSTGRES_DATABASE_NAME = "ecdwh"
POSTGRES_USERNAME = "bruno"
POSTGRES_PASSWORD = "bruno"
POSTGRES_SCHEMA = "public"


@op
def csvFileInputOp():
    """ csvFileInput """
    # Reading data from username.csv
    result = pd.read_csv("username.csv", sep=";").convert_dtypes()
    return result

@op
def filterColumnOp(input_data: pd.DataFrame):
    """ filterColumn """
    
    # Filter and order columns
    result = input_data[["Username", "First name", "Last name"]]
    
    return result

@op
def sortOp(input_data: pd.DataFrame):
    """ sort """
    
    # Sort rows 
    result = input_data.sort_values(by=["First name"], ascending=[True])
    
    return result

@op
def splitColumnOp(input_data: pd.DataFrame):
    """ splitColumn """
    
    # Create a new DataFrame from the split operation
    result_split = input_data["Username"].str.split(",", expand=True)
    result_split.columns  = [f"Username_{i}" for i in range(result_split.shape[1])]
    result = pd.concat([input_data, result_split], axis=1)
    
    # Remove the original column used for split
    result.drop(columns=["Username"], inplace=True)
    
    return result

@op
def extractOp(input_data: pd.DataFrame):
    """ extract """
    
    # Extract data using regex
    result_extracted = input_data['Last name'].str.extract(r"(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)")
    result_extracted.columns = ["result_1"]
    result = input_data.join(result_extracted, rsuffix="_extracted")
    
    return result

@op
def formulaRowOp(input_data: pd.DataFrame):
    """ formulaRow """
    result = input_data.copy()
    result['extract1_1'] = result.apply((lambda row: 0 if not row['Username_0'] else 1), axis=1)
    
    return result

@op
def joinOp(input_data1: pd.DataFrame, input_data2: pd.DataFrame):
    """ join """
    # Join input_data1 and input_data2
    result = pd.merge(input_data1, input_data2, left_on=["Last name", "First name"], right_on=["Last name", "First name"], how="left")
    
    return result

@op
def concatOp(input_data1: pd.DataFrame):
    """ concat """
    
    # Concatenate dataframes
    result = pd.concat([input_data1], ignore_index=True, sort=False, axis=0)
    
    return result

@op
def deduplicateDataOp(input_data: pd.DataFrame):
    """ deduplicateData """
    
      # Deduplicate rows
    result = input_data.drop_duplicates(subset=["Last name", "First name", "Username_0_x", "extract1_1_x", "extract1_1_y", "Username_0_y"], keep="first")
    
    return result

@op
def pivotOp(input_data: pd.DataFrame):
    """ pivot """
    
    result = input_data.pivot(
        index="extract1_1_x",
        columns="Last name",
        values="First name"
    ).reset_index()
    
    result = result.fillna(0)
    
    return result

@op
def typeConverterOp(input_data: pd.DataFrame):
    """ typeConverter """
    
    
    # Initialize the output DataFrame
    result = input_data.copy()
    # Convert Booker from string to object
    result["Booker"] = input_data["Booker"].astype("object", errors='raise')
    
    return result

@op
def cleanDataCLeansingOp(input_data: pd.DataFrame):
    """ cleanDataCLeansing """
    result = input_data.copy()
    result[['Booker', 'extract1_1_x', 'Grey']] = result[['Booker', 'extract1_1_x', 'Grey']].fillna('')
    result[['Booker', 'extract1_1_x', 'Grey']] = result[['Booker', 'extract1_1_x', 'Grey']].astype(str)
    result[['Booker', 'extract1_1_x', 'Grey']] = result[['Booker', 'extract1_1_x', 'Grey']].replace({'\\t':'','^\\s+|\\s+$':''}, regex=True)
    for col in ['Booker', 'extract1_1_x', 'Grey']:
        result[col] = result[col].str.lower()
    return result

@op
def generate_id_columnOp(input_data: pd.DataFrame):
    """ generate_id_column """
    
    # Generate ID column
    result = input_data.copy()
    result['ID'] = pd.Series(range(1, 1 + len(input_data)), dtype='int64')
    result = result.reindex(columns=['ID'] + input_data.columns.tolist())
    
    return result

@op
def aggregateOp(input_data: pd.DataFrame):
    """ aggregate """
    
    result = input_data.groupby(["Grey","extract1_1_x","Booker","Jenkins","Johnson","Smith","ID"]).agg(extract1_1_x_first=('extract1_1_x', 'first')).reset_index()
    
    return result

@op
def transposeOp(input_data: pd.DataFrame):
    """ transpose """
    # Transpose Dataset Component
    # Preserving key columns: "Smith", "Johnson", "ID", "extract1_1_x_first"
    
    # Melting the DataFrame to unpivot selected columns
    melted = input_data.melt(
        id_vars=["Smith", "Johnson", "ID", "extract1_1_x_first"],
        value_vars=["extract1_1_x", "Booker", "Jenkins", "Johnson", "Smith", "Grey"],
        var_name='Variable',
        value_name='Value'
    )
    
    # Assign the melted DataFrame to the output
    result = melted
    return result

@op
def filterOp(input_data: pd.DataFrame):
    """ filter """
    
    # Filter rows based on condition
    result = input_data[input_data['extract1_1_x_first'] == '1']
    
    return result

@op
def postgresOutputOp(input_data: pd.DataFrame):
    """ postgresOutput """
    
    
    # Connect to the Postgres database
    input_dataEngine = sqlalchemy.create_engine(
      f"postgresql://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DATABASE_NAME}"
    )
    
    
    # Rename columns based on the mapping
    input_data = input_data.rename(columns={"extract1_1_x_first": "field_name"})
    
    # Only keep relevant columns
    input_data = input_data[["field_name"]]
    
    # Write DataFrame to Postgres
    try:
        input_data.to_sql(
            name="simple_csv",
            con=input_dataEngine,
            if_exists="append",
            index=False
        )
    finally:
        input_dataEngine.dispose()
    
    return


@job
def dagster_pipeline():
    csvFileInputResult = csvFileInputOp()
    filterColumnResult = filterColumnOp(csvFileInputResult)
    sortResult = sortOp(filterColumnResult)
    splitColumnResult = splitColumnOp(sortResult)
    extractResult = extractOp(splitColumnResult)
    formulaRowResult = formulaRowOp(extractResult)
    joinResult = joinOp(formulaRowResult, formulaRowResult)
    concatResult = concatOp(joinResult)
    deduplicateDataResult = deduplicateDataOp(concatResult)
    pivotResult = pivotOp(deduplicateDataResult)
    typeConverterResult = typeConverterOp(pivotResult)
    cleanDataCLeansingResult = cleanDataCLeansingOp(typeConverterResult)
    generate_id_columnResult = generate_id_columnOp(cleanDataCLeansingResult)
    aggregateResult = aggregateOp(generate_id_columnResult)
    transposeResult = transposeOp(aggregateResult)
    filterResult = filterOp(transposeResult)
    postgresOutputResult = postgresOutputOp(filterResult)
