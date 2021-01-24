export enum EHerdItemTypes {
  birth = 'birth',
  breeding = 'breeding',
  calving = 'calving',
  changeGroup = 'changeGroup',
  distress = 'distress',
  dryOff = 'dryOff',
  herdEntry = 'herdEntry',
  systemHealth = 'systemHealth',
  systemHeat = 'systemHeat',
}

export enum EAlertTypes {
  distress = 'distress',
  postCalving = 'postCalving',
  moderatePreCalving = 'moderatePreCalving',
  preCalving = 'preCalving',
}

export enum ECowEntryStatuses {
  heifer = 'Heifer',
}

export interface IHerdItem {
  ageInDays: number;
  alertType?: EAlertTypes;
  animalId: string;
  birthDateCalculated?: boolean;
  breedingNumber?: number;
  calvingEase?: number | null; // ??? what the measurement units of this?
  cowEntryStatus?: ECowEntryStatuses;
  cowId: number;
  currentGroupId?: number;
  currentGroupName?: string;
  daysInLactation: number;
  daysInPregnancy?: number;
  deletable: boolean;
  destinationGroup?: number;
  destinationGroupName?: string | null;
  duration?: number;
  endDate?: number | null;
  endDateTime?: number | null;
  eventId: number;
  healthIndex?: number;
  heatIndexPeak?: string;
  interval?: number;
  isOutOfBreedingWindow?: boolean;
  lactationNumber: number;
  minValueDateTime?: number;
  newborns?: number | null;
  newGroupId?: number;
  newGroupName?: string;
  oldLactationNumber?: number;
  originalStartDateTime?: number;
  reportingDateTime: number;
  sire?: boolean | null; // ??? that cow is a male?
  startDateTime: number;
  type: EHerdItemTypes;
}

export class HerdItem implements IHerdItem {
  ageInDays: number = 0;
  alertType?: EAlertTypes;
  animalId: string = '';
  birthDateCalculated?: boolean;
  breedingNumber?: number;
  calvingEase?: number;
  cowEntryStatus?: ECowEntryStatuses;
  cowId: number = 0;
  currentGroupId?: number;
  currentGroupName?: string;
  daysInLactation: number = 0;
  daysInPregnancy?: number;
  deletable: boolean = false;
  destinationGroup?: number;
  destinationGroupName?: string;
  duration?: number;
  endDate?: number;
  endDateTime?: number;
  eventId: number = 0;
  healthIndex?: number;
  heatIndexPeak?: string;
  interval?: number;
  isOutOfBreedingWindow?: boolean;
  lactationNumber: number = 0;
  minValueDateTime?: number;
  newborns?: number;
  newGroupId?: number;
  newGroupName?: string;
  oldLactationNumber?: number;
  originalStartDateTime?: number;
  reportingDateTime: number = new Date().getTime();
  sire?: boolean;
  startDateTime: number = new Date().getTime();
  type: EHerdItemTypes  = EHerdItemTypes.herdEntry;
}
