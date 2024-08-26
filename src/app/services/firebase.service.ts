import { Injectable } from "@angular/core";
import { IBaseItemFromFirebase, ISearchDocumentWithField } from "@interfaces";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  initializeAuth
} from 'firebase/auth';
import {
  addDoc,
  collection,
  count,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where
} from 'firebase/firestore';
import { forkJoin, from, Observable, Subscriber } from "rxjs";
import { environment } from "~environments/environment";
import { getTime } from 'date-fns';
import { DEFAULT_SORT_FIELD, PAGINATION_FIELD, UNFILTER_FIELD } from "@enums";

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  firebaseApp?: FirebaseApp;
  auth?: Auth;
  store?: Firestore;

  constructor() {}

  init() {
    try {
      const config = environment.firebaseConfig;
      if (!config) {
        throw new Error('firebase config is invalid');
      }
      this.firebaseApp = initializeApp(config);

      //Init auth
      if (document !== undefined) {
        this.auth = initializeAuth(this.firebaseApp, {
          persistence: browserLocalPersistence,
          popupRedirectResolver: browserPopupRedirectResolver
        });
      } else {
        this.auth = getAuth(this.firebaseApp);
      }

      //Init store
      this.store = getFirestore(this.firebaseApp);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  initAuth() {
    try {
      if (!this.firebaseApp) {
        throw new Error('firebase app is invalid');
      }
      if (document !== undefined) {
        this.auth = initializeAuth(this.firebaseApp, {
          persistence: browserLocalPersistence,
          popupRedirectResolver: browserPopupRedirectResolver
        });
      } else {
        this.auth = getAuth(this.firebaseApp);
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  initFireStore() {
    try {
      if (!this.firebaseApp) {
        throw new Error('firebase app is invalid');
      }
      this.store = getFirestore(this.firebaseApp);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  getCollection<T extends IBaseItemFromFirebase>(collectionName: string, isSoft: boolean = true): Observable<Array<T>> {
    return new Observable<Array<T>>((subs: Subscriber<Array<T>>) => {
      try {
        if (!this.store) {
          this.initFireStore();
        }

        const _ref = collection(this.store as any, collectionName);
        const _query = isSoft ? query(_ref, where('deletedAt', '==', null)) : query(_ref);
        const _userSnap = from(getDocs(_query));

        _userSnap.subscribe({
          next: resp => {
            const _data: Array<T> = [];

            if (!resp.empty) {
              resp.forEach((doc) => {
                const _docdata: T = {
                  ...doc.data() as T,
                  id: doc.id
                };
                _data.push(_docdata);
              });
            }

            subs.next(_data);
            subs.complete();
          },
          error: error => {
            subs.error(error);
            subs.complete();
          },
        });
      } catch (error) {
        subs.error(error);
        subs.complete();
      }
    });
  }

  addNewDocument<T extends IBaseItemFromFirebase>(collectionName: string, data: T): Observable<boolean> {
    return new Observable<boolean>((subs: Subscriber<boolean>) => {
      try {
        if (!this.store) {
          this.initFireStore();
        }

          const createdTime = new Date();
          const newData = {
          ...data,
          createdAt: getTime(createdTime),
          updatedAt: getTime(createdTime),
          deletedAt: null,
        }
        const _ref = collection(this.store as any, collectionName);
        from(addDoc(_ref, newData)).subscribe({
          next: resp => {
            subs.next(true);
            subs.complete();
          },
          error: error => {
            console.error(error);
            subs.next(false);
            subs.complete();
          }
        });
      } catch (error) {
        console.error(error);
        subs.next(false);
        subs.complete();
      }
    });
  }

  updateDocument<T extends IBaseItemFromFirebase>(collectionName: string, firebaseID: string, data: T): Observable<boolean> {
    return new Observable<boolean>((subs: Subscriber<boolean>) => {
      try {
        if (!this.store) {
          this.initFireStore();
        }

        const updatedData = {
          ...data,
          updatedAt: getTime(new Date()),
        }
        const _ref = doc(this.store as any, collectionName, firebaseID);
        from(updateDoc(_ref, updatedData)).subscribe({
          next: resp => {
            subs.next(true);
            subs.complete();
          },
          error: error => {
            console.error(error);
            subs.next(false);
            subs.complete();
          }
        });
      } catch (error) {
        console.error(error);
        subs.next(false);
        subs.complete();
      }
    });
  }

  // searchDocument<T extends IBaseItemFromFirebase>(collectionName: string, payload: Record<string, any>): Observable<Array<T>> {
  //   return Object.keys(payload).length ? this.searchDocumentWithField<T>(collectionName, payload) : this.getCollection<T>(collectionName);
  // }

  countCollection(collectionName: string): Observable<number> {
    return new Observable<number>((subs: Subscriber<number>) => {
      try {
        if (!this.store) {
          this.initFireStore();
        }

        const _ref = collection(this.store as any, collectionName);
        const _userSnap = from(getDocs(_ref));
        _userSnap.subscribe({
          next: resp => {
            subs.next(resp.size);
            subs.complete();
          },
          error: error => {
            console.error(error);
            subs.next(0);
            subs.complete();
          }
        })
      } catch (error) {
        console.error(error);
        subs.next(0);
        subs.complete();
      }
    });
  }

  searchDocumentWithField<T extends IBaseItemFromFirebase>(collectionName: string, payload: Record<string, any>): Observable<ISearchDocumentWithField<T>> {
    return new Observable<ISearchDocumentWithField<T>>((subs: Subscriber<ISearchDocumentWithField<T>>) => {
      try {
        if (!this.store) {
          this.initFireStore();
        }

        // const _startAt = payload['pageNumber'] * payload['pageSize'];
        // const _limit = payload['pageSize'];
        const _ref = collection(this.store as any, collectionName);
        const _query = query(
          _ref,
          where('deletedAt', '==', null),
          orderBy(payload['sort'], payload['direction']),
          // startAt(_startAt),
          // limit(_limit),
        );
        const _userSnap = from(getDocs(_query));
        const request: Array<Observable<any>> = [_userSnap, this.countCollection(collectionName)];


        forkJoin(request).subscribe({
          next: resp => {
            const dataResp = resp[0];
            const countResp = resp[1];
            let _data: Array<T> = [];
            if (dataResp) {
              if (!dataResp.empty) {
                dataResp.forEach((doc: any) => {
                  const _docdata: T = {
                    ...doc.data() as T,
                    id: doc.id
                  };
                  _data.push(_docdata);
                });
              }

              const searchField = this.getSearchField(payload);
              _data = _data.filter((elm: any) => {
                let returnValue: boolean = true;
                for (const field in searchField) {
                  const elmValue = elm[field].toString().toLowerCase();
                  const compareValue = searchField[field].toString().toLowerCase();

                  returnValue = returnValue && (elmValue.includes(compareValue) || compareValue.includes(elmValue));
                }

                return returnValue;
              });
            }

            subs.next({
              data: _data,
              totalElements: countResp,
            });
            subs.complete();
          },
          error: error => {
            console.error(error);
            subs.next({
              data: [],
              totalElements: 0,
            });
            subs.complete();
          },
        });
      } catch (error) {
        console.error(error);
        subs.next({
          data: [],
          totalElements: 0,
        });
        subs.complete();
      }
    });
  }

  searchDocumentWithID<T extends IBaseItemFromFirebase>(collectionName: string, firebaseID: string): Observable<T | null> {
    return new Observable<T | null>((subs: Subscriber<T | null>) => {
      try {
        if (!this.store) {
          this.initFireStore();
        }

        const _docref = doc(this.store as any, collectionName, firebaseID);
        const _userSnap = from(getDoc(_docref));

        _userSnap.subscribe({
          next: resp => {
            let _data: T | null = null;

            if (resp.exists()) {
              const _docdata: any = resp.data();
              _data = _docdata;
            }

            subs.next(_data);
            subs.complete();
          },
          error: error => {
            console.error(error);
            subs.next(null);
            subs.complete();
          },
        });
      } catch (error) {
        console.error(error);
        subs.next(null);
        subs.complete();
      }
    });
  }

  deleteDocument<T extends IBaseItemFromFirebase>(collectionName: string, datas: Array<T>): Observable<boolean[]> {
    return new Observable<boolean[]>((subs: Subscriber<boolean[]>) => {
      const deletedTime = new Date();
      const _requests: Array<Observable<boolean>> = [];
      datas.forEach(elm => {
        const _id = elm['id'];
        const _deletedData = {
          ...elm,
          deletedAt: getTime(deletedTime),
          updatedAt: getTime(deletedTime),
        };
        _requests.push(this.updateDocument(collectionName, _id, _deletedData));
      })
      forkJoin(_requests).subscribe({
        next: resp => {
          subs.next(resp);
          subs.complete();
        },
        error: error => {
          console.error(error);
          subs.next([]);
          subs.complete();
        },
      });
    });
  }

  private getSearchField(payload: Record<string, any>): Record<string, any> {
    const searchField: Record<string, any> = {};
    for (const field in payload) {
      if (!UNFILTER_FIELD.includes(field)) {
        searchField[field] = payload[field];
      }
    }
    return searchField;
  }
}
