import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Claim } from '../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiUrl = 'http://localhost:8080/claims';

  constructor(private http: HttpClient) { }

  getAllClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/`);
  }

  getClaimsByUser(userId: number): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}/user/${userId}`);
  }

  getClaimById(id: number): Observable<Claim> {
    return this.getAllClaims().pipe(
      map((claims) => {
        const claim = claims.find((item) => item.id === id);
        if (!claim) {
          throw new Error('Claim not found');
        }
        return claim;
      })
    );
  }

  createClaim(claim: Claim, userId: number): Observable<Claim> {
    return this.http.post<Claim>(`${this.apiUrl}/apply/${userId}`, claim);
  }

  updateClaim(id: number, claim: Claim): Observable<Claim> {
    return this.http.put<Claim>(`${this.apiUrl}/update/${id}`, claim);
  }

  deleteClaim(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
