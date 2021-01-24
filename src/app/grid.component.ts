import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { HerdItem, IHerdItem } from './models';
import { FormControl, FormGroup } from "@angular/forms";

const HEAD_COLUMNS = [
  { column: 'remove', title: '', type: 'control' },
  { column: 'index', title: '№', type: 'index' },
  { column: 'eventId', title: 'Event ID', type: 'hidden' },
  { column: 'cowId', title: 'Id' },
  { column: 'ageInDays', title: 'Age in Days' },
  { column: 'alertType', title: 'Alert Type' },
  { column: 'animalId', title: 'Animal ID' },
  { column: 'birthDateCalculated', title: 'Birth Date Calculated', type: 'boolean' },
  { column: 'breedingNumber', title: 'Breeding Number' },
  { column: 'calvingEase', title: 'Calving Ease' },
  { column: 'cowEntryStatus', title: 'Cow Entry Status' },
  { column: 'currentGroupId', title: 'Current Group Id' },
  { column: 'currentGroupName', title: 'Current Group Name' },
  { column: 'daysInLactation', title: 'Days In Lactation' },
  { column: 'daysInPregnancy', title: 'Days In Pregnancy' },
  { column: 'deletable', title: 'Deletable', type: 'boolean' },
  { column: 'destinationGroup', title: 'Destination Group' },
  { column: 'destinationGroupName', title: 'Destination Group Name' },
  { column: 'duration', title: 'Duration' },
  { column: 'endDate', title: 'End Date' },
  { column: 'endDateTime', title: 'End Date Time' },
  { column: 'healthIndex', title: 'Health Index' },
  { column: 'heatIndexPeak', title: 'Head Index Peak' },
  { column: 'interval', title: 'Interval' },
  { column: 'isOutOfBreedingWindow', title: 'Is Out Of Breeding Window', type: 'boolean' },
  { column: 'lactationNumber', title: 'Lactation Number' },
  { column: 'minValueDateTime', title: 'Minimum Date Time' },
  { column: 'newborns', title: 'Newborns' },
  { column: 'newGroupId', title: 'New Group Id' },
  { column: 'newGroupName', title: 'New Group Name' },
  { column: 'oldLactationNumber', title: 'Old Lactation Number' },
  { column: 'originalStartDateTime', title: 'Original Start Date Time' },
  { column: 'reportingDateTime', title: 'Reporting Date Time' },
  { column: 'sire', title: 'Sire', type: 'boolean' },
  { column: 'startDateTime', title: 'Start Date Time' },
  { column: 'type', title: 'Type' },
];

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit{
  formGroup = new FormGroup({});
  headColumns = HEAD_COLUMNS;
  formInited = false;

  subscription: Subscription;

  newItems$ = new BehaviorSubject<IHerdItem[]>([]);
  existItems$ = new BehaviorSubject<IHerdItem[]>([]);
  removedItems: IHerdItem[] = [];

  tableData$ = combineLatest([this.existItems$, this.newItems$]).pipe(map((items) => {
    return [...items[0], ...items[1]];
  }));

  updateValues: { [key: string]: { [P in keyof IHerdItem]?: IHerdItem[P] } } = {};
  trackByColumn = (_index: number, cow: IHerdItem) => cow.eventId;

  get flatColumns() { return this.headColumns.filter(column => column.type !== 'hidden').map(column => column.column); }

  constructor(private http: HttpClient, private changeDetector: ChangeDetectorRef) {}

  valueChanges = this.formGroup.valueChanges.pipe(map(vl => {
    return this.formInited;
  }));

  private setValue(item: IHerdItem, column: string, value: any) {
    if (!this.updateValues[item.eventId]) this.updateValues[item.eventId] = { };
    this.updateValues[item.eventId][column] = value;
    item[column] = value;
    this.formGroup.controls[`${column}-${item.eventId}`].setValue(value);
  }

  changeBoolenValueFor(event: Event, item: IHerdItem, column: { column: string }) {
    const value = (event.target as any).checked;
    this.setValue(item, column.column, value);
  }

  changeValueFor(event: Event, item: IHerdItem, column: { column: string }) {
    const value = (event.target as any).value;
    this.setValue(item, column.column, value);
  }

  addNewRow() {
    const vl = this.newItems$.value;
    const newItem = new HerdItem();
    vl.push(newItem);
    this.newItems$.next([...vl]);
    this.addControlsFor(newItem);
    this.changeDetector.markForCheck();
  }

  private addControlsFor(newItem: IHerdItem) {
    this.flatColumns.forEach(column => {
      this.formGroup.addControl(`${column}-${newItem.eventId}`, new FormControl(newItem[column]));
    });

  }

  private removeControlsFor(eventId) {
    this.flatColumns.forEach(column => {
      this.formGroup.removeControl(`${column}-${eventId}`);
    });
  }

  async loadData() {
    this.http.get<IHerdItem[]>('/getHerdList').subscribe(data => {
      this.existItems$.next(data);
      data.forEach(herdItem => {
        this.headColumns.forEach(column => {
          this.formGroup.addControl(`${column.column}-${herdItem.eventId}`, new FormControl(
            column.type === 'boolean' ? herdItem[column.column] === true:
            herdItem[column.column])
          );
        });
      });
      this.formInited = true;
    }).unsubscribe();
  }

  handleError(_error) {
    // TODO: implements error handling
  }

  removeItems() {
    return this.http.delete('/deleteHerdItems', {
      params: { items: this.removedItems.map(i => i.eventId.toString()) }
    });
  }

  addNewItems() {
    return this.http.post('/addHerdItems', this.newItems$.value);
  }

  updateExistItems() {
    return this.http.patch('/updateHerdList', this.updateValues);
  }

  reloadTable() {
    const controls = Object.keys(this.formGroup.controls);
    controls.forEach(control => this.formGroup.removeControl(control));
    this.loadData();
  }

  applyChanges() {
    combineLatest([
      this.removeItems(),
      this.addNewItems(),
      this.updateExistItems(),
    ]).subscribe(() => {
      this.removedItems = [];
      this.reloadTable();
    });
  }

  removeItem(cow: HerdItem) {
    const isexists = this.existItems$.value.includes(cow);
    if (isexists) {
      const vl = [...this.existItems$.value];
      vl.splice(this.existItems$.value.indexOf(cow), 1);
      this.existItems$.next(vl);
      this.removedItems.push(cow);
    } else {
      const isnew = this.newItems$.value.includes(cow);
      if (isnew) {
        const vl = [...this.newItems$.value];
        vl.splice(this.newItems$.value.indexOf(cow), 1);
        this.newItems$.next(vl);
      }
    }
    this.removeControlsFor(cow.eventId);
    this.changeDetector.markForCheck();
  }

  ngOnInit() {
    this.loadData();
  }

}
