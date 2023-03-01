import { delay } from "@core/utils/thread/timing";
import {
  ExampleChildListResponse,
  ExampleChildSaveRequest,
  ExampleChildSaveResponse,
  ExampleListRequest,
  ExampleListResponse,
  ExampleRepositoryInterface,
  ExampleSaveRequest,
  ExampleSaveResponse,
  ExampleStatResponse,
} from "./ExampleRepositoryInterface";
import { resDs } from "./resDs";

export class ExampleRepositoryMock extends ExampleRepositoryInterface {
  async list(params: ExampleListRequest): Promise<ExampleListResponse> {
    console.log("ListRequest", params);
    await delay(300);
    return {
      ds: resDs,
      page: {
        pgCount: 49,
        total: 9737,
        pageNumber: params.pageNumber ?? 0,
        pageSize: params.pageSize ?? 0,
      },
    };
  }
  async save(params: ExampleSaveRequest): Promise<ExampleSaveResponse> {
    console.log("CounselingSaveRequest", params);
    await delay(300);
    return {
      rs: {
        updatedAt: "2022-09-27T18:19:29",
        updatedBy: "ulbo_1@n****.com",
        updatedByNm: "***",
        id: 49293,
        cntrCd: "HOUSEWEL",
        cntrNm: "***거복지센터",
        cnsltUserCd: "ulbo_1@n****.com",
        area: "수성구",
        cnsltUserNm: "***",
        cnsltDt: "2022-09-26",
        cnsltHow: "방문",
        cnsltPath: "동사무소/구청",
        cnsltPathDtl: "동사무소/구청",
        name: "*성달",
        birthDt: "2010-02-23",
        sex: "남",
        phone1: "010-****-8470",
        zipNum: "42238",
        addr: "** 수성구 파동로8길 13-4",
        fmCnt: 3,
        fmTyp: "조손가구",
        fldA: "수급",
        fldADtl1: "생계급여, 의료급여, 주거급여, 교육급여",
        fldT: "-조손가구(3인), 김성달 아동의 조모(이명자) 주양육자, 기초생활수급(생계, 의료, 주거급여)\r\n-보증부월세 11년거주 (보증금 200만원, 월25만원)\r\n-손자녀 2명(초5, 남/ 초6, 남) 조모가 양육중\r\n-아동의 조모와 아동이 한 집에 거주를 하지만 따로 방을 얻어 거주하고 있었음.\r\n-현 거주지는 처음에 조모와 아동들이 거주를 하였다가 6~7개월전 같은 집 다른방을 얻어 따로 방을 사용하고 있었음.\r\n-현 거주지는 주민등록상 아동의 아버지 이름으로 계약하여 주거급여로 월세를 부담하고 있었으며, 별체는 아동의 조모가 얻어 주거급여로 월세를 부담하며 무보증으로 월15만원을 주고 생활하고 있다고 함.\r\n-따로 생활하는 이유를 물으니 아동들의 공부로 인하여 그렇다고 하지만, 월세를 추가로 부담하고 있음.\r\n-아동들이 거주하는 별체는 기존에 거주하던 할머니가 돌아가시면서 집을 본인이 싸게 받아 거주하고 있으며 아동들의 공부 및 취침방으로 사용하고 있었음.\r\n-두집 모두 방2, 거실겸 주방, 화장실로 구성되어 있었고\r\n-아동의 조모가 거주하는 공간은 방, 거실겸주방 등 벽지 훼손 및 곰팡이로 인하여 습한 냄새가 나기도 하고  주거환경이 매우 불량해보였음. 아동들이 거주하는 공간은 기존에 거주하던 할머니가 깨끗하게 사용하여 양호하였음.\r\n-기름보일러 사용으로 동주민센터에서 연료비를 지원받기도 한다고 함.\r\n-약 1개월전 굿네이버스를 통해 아동들의 책상, TV를 지원받아 사용중이라고 함.\r\n-아동들이 사용하는 공간에는 TV 선반, 옷장은 기존에 돌아가신 할머님이 사용하시던 것을 그대로 사용중이며 할머니가 거주하는 공간은 작은방에는 아동들의 옷장 등을 비치하여 사용중이었음.\r\n-아동들의 父는 가끔 집에 방문하여, 일용직으로 일을 하고 있으며\r\n-아동들의 母는 아동들이 어렸을때 바람을 피워 집을 나간상태라고 함.\r\n-아동들의 공간 및 이명자님의 공간 두군데 지원이 어려우면 아동들이 있는 공간을 지원해달라고 함.\r\n-원래 동주민센터에서의 요청과 예산으로는 싱크대 뒤 곰팡이로 인해 도배를 요청한 상황이라 모두 지원이 어려움을 안내드림.\r\n-임대인은 2층에 거주하고 있다고 하며, 지원결정에 대한 연락은 이번주 또는 다음주에 연락을 드리겠다고 안내드림.\r\n-추후 임대인도 만나야하는 상황이 될 수 있음을 안내드림.\r\n*주거물품지원(투척용소화기+마스크7매)",
        hopePoint: "직접지원, 내부자원",
        hopePoint1: "집수리",
        hopePoint3: "주거복지 상담/사례관리",
      },
    };
  }
  async detail(params) {
    console.log("CounselingDetailRequest", params);
    await delay(300);
    return {
      rs: {
        updatedAt: "2022-09-27T18:19:29",
        updatedBy: "ulbo_1@n****.com",
        updatedByNm: "***",
        id: 49293,
        cntrCd: "HOUSEWEL",
        cntrNm: "***거복지센터",
        cnsltUserCd: "ulbo_1@n****.com",
        area: "수성구",
        cnsltUserNm: "***",
        cnsltDt: "2022-09-26",
        cnsltHow: "방문",
        cnsltPath: "동사무소/구청",
        cnsltPathDtl: "동사무소/구청",
        name: "*성달",
        birthDt: "2010-02-23",
        sex: "남",
        phone1: "010-****-8470",
        zipNum: "42238",
        addr: "** 수성구 파동로8길 13-4",
        fmCnt: 3,
        fmTyp: "조손가구",
        fldA: "수급",
        fldADtl1: "생계급여, 의료급여, 주거급여, 교육급여",
        fldT: "-조손가구(3인), 김성달 아동의 조모(이명자) 주양육자, 기초생활수급(생계, 의료, 주거급여)\r\n-보증부월세 11년거주 (보증금 200만원, 월25만원)\r\n-손자녀 2명(초5, 남/ 초6, 남) 조모가 양육중\r\n-아동의 조모와 아동이 한 집에 거주를 하지만 따로 방을 얻어 거주하고 있었음.\r\n-현 거주지는 처음에 조모와 아동들이 거주를 하였다가 6~7개월전 같은 집 다른방을 얻어 따로 방을 사용하고 있었음.\r\n-현 거주지는 주민등록상 아동의 아버지 이름으로 계약하여 주거급여로 월세를 부담하고 있었으며, 별체는 아동의 조모가 얻어 주거급여로 월세를 부담하며 무보증으로 월15만원을 주고 생활하고 있다고 함.\r\n-따로 생활하는 이유를 물으니 아동들의 공부로 인하여 그렇다고 하지만, 월세를 추가로 부담하고 있음.\r\n-아동들이 거주하는 별체는 기존에 거주하던 할머니가 돌아가시면서 집을 본인이 싸게 받아 거주하고 있으며 아동들의 공부 및 취침방으로 사용하고 있었음.\r\n-두집 모두 방2, 거실겸 주방, 화장실로 구성되어 있었고\r\n-아동의 조모가 거주하는 공간은 방, 거실겸주방 등 벽지 훼손 및 곰팡이로 인하여 습한 냄새가 나기도 하고  주거환경이 매우 불량해보였음. 아동들이 거주하는 공간은 기존에 거주하던 할머니가 깨끗하게 사용하여 양호하였음.\r\n-기름보일러 사용으로 동주민센터에서 연료비를 지원받기도 한다고 함.\r\n-약 1개월전 굿네이버스를 통해 아동들의 책상, TV를 지원받아 사용중이라고 함.\r\n-아동들이 사용하는 공간에는 TV 선반, 옷장은 기존에 돌아가신 할머님이 사용하시던 것을 그대로 사용중이며 할머니가 거주하는 공간은 작은방에는 아동들의 옷장 등을 비치하여 사용중이었음.\r\n-아동들의 父는 가끔 집에 방문하여, 일용직으로 일을 하고 있으며\r\n-아동들의 母는 아동들이 어렸을때 바람을 피워 집을 나간상태라고 함.\r\n-아동들의 공간 및 이명자님의 공간 두군데 지원이 어려우면 아동들이 있는 공간을 지원해달라고 함.\r\n-원래 동주민센터에서의 요청과 예산으로는 싱크대 뒤 곰팡이로 인해 도배를 요청한 상황이라 모두 지원이 어려움을 안내드림.\r\n-임대인은 2층에 거주하고 있다고 하며, 지원결정에 대한 연락은 이번주 또는 다음주에 연락을 드리겠다고 안내드림.\r\n-추후 임대인도 만나야하는 상황이 될 수 있음을 안내드림.\r\n*주거물품지원(투척용소화기+마스크7매)",
        hopePoint: "직접지원, 내부자원",
        hopePoint1: "집수리",
        hopePoint3: "주거복지 상담/사례관리",
      },
    };
  }

  async childList(params): Promise<ExampleChildListResponse> {
    console.log("SubListRequest", params);
    await delay(300);
    return {
      ds: [
        {
          pid: params.pid,
          code: "CODE1",
          name: "*TEM 1",
          type: "NORMAL",
          useYn: "Y",
        },
        {
          pid: params.pid,
          code: "CODE2",
          name: "*TEM 2",
          type: "NORMAL",
          useYn: "Y",
        },
      ],
    };
  }

  async childListSave(params: ExampleChildSaveRequest): Promise<ExampleChildSaveResponse> {
    console.log("childListSave", params);
    await delay(300);
    return {};
  }

  async stat(params: any): Promise<ExampleStatResponse> {
    await delay(300);

    function getRandomValue() {
      return Math.round(Math.random() * 1000);
    }

    return {
      ds: [
        {
          busi: "DX",
          stor: "분당사업장",
          storCnt: 11,
          "01-28": getRandomValue(),
          "01-27": getRandomValue(),
          "01-26": getRandomValue(),
          "01-25": getRandomValue(),
          "01-24": getRandomValue(),
          "01-23": getRandomValue(),
          "01-22": getRandomValue(),
        },
        {
          busi: "DX",
          stor: "분당1사업장",
          storCnt: 11,
          "01-28": getRandomValue(),
          "01-27": getRandomValue(),
          "01-26": getRandomValue(),
          "01-25": getRandomValue(),
          "01-24": getRandomValue(),
          "01-23": getRandomValue(),
          "01-22": getRandomValue(),
        },
        {
          busi: "DX",
          stor: "분당2사업장",
          storCnt: getRandomValue(),
          "01-28": getRandomValue(),
          "01-27": getRandomValue(),
          "01-26": getRandomValue(),
          "01-25": getRandomValue(),
          "01-24": getRandomValue(),
          "01-23": getRandomValue(),
          "01-22": getRandomValue(),
        },
        {
          busi: "DX",
          stor: "수원사업장",
          storCnt: 14,
          "01-28": getRandomValue(),
          "01-27": getRandomValue(),
          "01-26": getRandomValue(),
          "01-25": getRandomValue(),
          "01-24": getRandomValue(),
          "01-23": getRandomValue(),
          "01-22": getRandomValue(),
        },
        {
          busi: "DX",
          stor: "수원사업장",
          storCnt: 14,
          "01-28": getRandomValue(),
          "01-27": getRandomValue(),
          "01-26": getRandomValue(),
          "01-25": getRandomValue(),
          "01-24": getRandomValue(),
          "01-23": getRandomValue(),
          "01-22": getRandomValue(),
        },
        {
          busi: "DX",
          stor: "구미사업장",
          storCnt: 10,
          "01-28": getRandomValue(),
          "01-27": getRandomValue(),
          "01-26": getRandomValue(),
          "01-25": getRandomValue(),
          "01-24": getRandomValue(),
          "01-23": getRandomValue(),
          "01-22": getRandomValue(),
        },
        {
          busi: "DS",
          stor: "광주사업장",
          storCnt: 6,
          "01-28": getRandomValue(),
          "01-27": getRandomValue(),
          "01-26": getRandomValue(),
          "01-25": getRandomValue(),
          "01-24": getRandomValue(),
          "01-23": getRandomValue(),
          "01-22": getRandomValue(),
        },
        {
          busi: "DS",
          stor: "광주사업장",
          storCnt: 8,
          "01-28": getRandomValue(),
          "01-27": getRandomValue(),
          "01-26": getRandomValue(),
          "01-25": getRandomValue(),
          "01-24": getRandomValue(),
          "01-23": getRandomValue(),
          "01-22": getRandomValue(),
        },
      ],
    };
  }
}
