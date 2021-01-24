import { HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { addHerdItems, deleteHerdItems, getHerdList, updateHerdList } from "src/tests/mock-response";

const createResponeFromData = (data: any): HttpResponse<any> => {
    return new HttpResponse({ body: data });
}

type ApiResult =
    ((body: void | any, params: any) => Observable<HttpEvent<any>>)
    |string
;

export const API_MAP: { [key: string]: ApiResult } = {
    '/getHerdList': () => of(createResponeFromData(getHerdList())),
    '/updateHerdList': (body) => of(createResponeFromData(updateHerdList(body))),
    '/addHerdItems': (body) => of(createResponeFromData(addHerdItems(body))),
    '/deleteHerdItems': (body, params) => of(createResponeFromData(deleteHerdItems(body, params))),
}