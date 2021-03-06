import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Guid } from "guid-typescript";
import {createTableService,} from "azure-storage";
import parseMultipartFormData from "@anzp/azure-function-multipart";

interface key {
    PartitionKey: string;
    RowKey: string;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const tableService = createTableService();
    const thisKey : key = {PartitionKey: "Test",RowKey: Guid.create().toString()};
    const { fields } = await parseMultipartFormData(req);
    const params = fields.reduce((obj, item) => Object.assign(obj, { [item.fieldname]: item.value }), {});
    const entity = {...thisKey,...params};
    const tableName = "Request";
    tableService.insertEntity(tableName,entity,{ echoContent: true }, function (error, result, response) {
        if (!error) {
            context.res.status(200).json(response);
        } else {
             context.res.status(500).json({ error: error });
        }
    });
    
};

export default httpTrigger;