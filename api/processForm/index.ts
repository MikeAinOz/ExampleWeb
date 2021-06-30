import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Guid } from "guid-typescript";
import {createTableService,} from "azure-storage";
interface key {
    PartitionKey: string;
    RowKey: string;
}

const httpTrigger: AzureFunction = function (context: Context, req: HttpRequest): Promise<Void> {
    context.log('HTTP trigger function processed a request.');
    const tableService = createTableService();
    const thisKey : key = {PartitionKey: "Test",RowKey: Guid.create().toString()};
    const tableName = "Request";
    tableService.insertEntity(tableName,{...thisKey,...req.query},{ echoContent: true }, function (error, result, response) {
        if (!error) {
            context.res.status(200).json(response);
        } else {
             context.res.status(500).json({ error: error });
        }
    });

};

export default httpTrigger;