import { AXFDGSortParam } from "@axframe/datagrid";
import { ApiPageResponse } from "../../../@types";

export interface ExampleSubItem {
  status?: string;
  pid?: string;
  id?: string;
  code?: string;
  name?: string;
  type?: string;
  useYn?: string;
}
export interface ExampleItem {
  id?: number;
  cntrCd?: string;
  cntrNm?: string;
  cnsltUserCd?: string;
  area?: string;
  cnsltUserNm?: string;
  cnsltDt?: string;
  cnsltHow?: string;
  cnsltPath?: string;
  cnsltPathDtl?: string;
  name?: string;
  birthDt?: string;
  sex?: string;
  phone1?: string;
  phone2?: string;
  zipNum?: string;
  addr?: string;
  addrDtls?: string;
  inhseDt?: string;
  inhseTimeStt?: string;
  inhseTimeEnd?: string;
  hndcapYn?: string;
  hndcapTyp?: string;
  hndcapGrade?: string;
  fmCnt?: number;
  fmTyp?: string;
  fmTypEtc?: string;
  homeTyp?: string;
  homeTyp2?: string;
  homeTypEtc?: string;
  homeOwnerTyp?: string;
  homeFloor?: string;
  guaranteeAmt?: number;
  monthlyAmt?: number;
  fldA?: string;
  fldADtl1?: string;
  fldT?: string;
  hopePoint?: string;
  hopePoint1?: string;
  hopePoint1Etc?: string;
  hopePoint3?: string;
  updatedAt?: string;
  updatedBy?: string;
  updatedByNm?: string;
  subList?: ExampleSubItem[];
}

export interface ExampleListRequest {
  sttDt?: string;
  endDt?: string;
  filterType?: string;
  filter?: string;
  sorts?: AXFDGSortParam[];
  pageSize?: number;
  pageNumber?: number;
}

export interface ExampleListResponse {
  ds: ExampleItem[];
  rs: ApiPageResponse;
}

export interface ExampleSaveRequest extends ExampleItem {}

export interface ExampleSaveResponse {
  ds?: any[];
  rs: ExampleItem;
}

export interface ExampleDetailRequest {
  id: string;
}

export interface ExampleDetailResponse {
  ds?: any[];
  rs: ExampleItem;
}

export interface ExampleChildListRequest {
  pid?: number;
}

export interface ExampleChildListResponse {
  ds: ExampleSubItem[];
}

export abstract class ExampleRepositoryInterface {
  abstract list(params: ExampleListRequest): Promise<ExampleListResponse>;
  abstract save(params: ExampleSaveRequest): Promise<ExampleSaveResponse>;
  abstract detail(params: ExampleDetailRequest): Promise<ExampleDetailResponse>;
  abstract childList(params: ExampleChildListRequest): Promise<ExampleChildListResponse>;
}
