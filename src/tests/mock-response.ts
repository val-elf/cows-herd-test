import HerdInfo from './data.json';

import { IHerdItem } from "src/app/models";
import { BehaviorSubject } from "rxjs";
import { HttpParams } from "@angular/common/http";

let workHerdList$ = new BehaviorSubject<IHerdItem[]>(HerdInfo.result as IHerdItem[]);
const genEventId = () => {
    const max = Math.max(...workHerdList$.value.map(i => i.eventId));
    return max + 1;
}

export const getHerdList = () => {
    return workHerdList$.value;
}

export const updateHerdList = (updates: { [key: number]: IHerdItem }) => {
    console.warn("[UpdateHerdList]", updates);

    const eventIds = Object.keys(updates).map(i => parseInt(i, 10));
    const herd = workHerdList$.value;
    eventIds.forEach(eventId => {
        const update = updates[eventId];
        const cow = herd.find(cow => cow.eventId === eventId);
        if (cow) Object.assign(cow, update);
    });
    workHerdList$.next([...herd]);
}

export const addHerdItems = (items: IHerdItem[]) => {
    console.warn("[AddHerdItems]:", items);

    const herd = workHerdList$.value;
    let eventBase = genEventId();
    herd.push(...items.map(i => ({...i, eventId: ++eventBase })));
    workHerdList$.next([...herd]);
}

export const deleteHerdItems = (_body: unknown, params: HttpParams) => {
    const items = params.getAll("items");
    console.warn("[DeleteHerdItems]", items);

    const herd = workHerdList$.value;
    items.forEach(eventId => {
        const index = herd.findIndex(cow => cow.eventId === parseInt(eventId, 10));
        if (index > -1) herd.splice(index, 1);
    });
    workHerdList$.next([...herd]);
}