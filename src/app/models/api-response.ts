export interface ApiResponse<T> {
succeeded: any;
   
statusCode:number;
message:string
data: T;

}