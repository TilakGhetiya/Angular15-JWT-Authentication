import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthService
{
    private currentUserSubject: BehaviorSubject<User | null>;
    currentUser: Observable<User | null>;

    constructor(private http: HttpClient)
    {
        let currentUser: any = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(currentUser));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue (): User | null
    {
        return this.currentUserSubject.value;
    }

    login (username: string, password: string)
    {
        return this.http.post<any>(`/users/authenticate`, {username, password}).pipe(map(user =>
        {
            if (user && user.token)
            {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        }))
    }

    logout ()
    {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
