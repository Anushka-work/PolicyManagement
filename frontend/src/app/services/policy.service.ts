import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Policy } from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = 'http://localhost:8080/policy';

  constructor(private http: HttpClient) { }

  getAllPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/`);
  }

  getPoliciesByUser(userId: number): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/user/${userId}`);
  }

  getPolicyById(id: number): Observable<Policy> {
    return this.getAllPolicies().pipe(
      map((policies) => {
        const policy = policies.find((item) => item.id === id);
        if (!policy) {
          throw new Error('Policy not found');
        }
        return policy;
      })
    );
  }

  createPolicy(policy: Policy, userId: number): Observable<Policy> {
    return this.http.post<Policy>(`${this.apiUrl}/issue/${userId}`, policy);
  }

  updatePolicy(id: number, policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(`${this.apiUrl}/${id}`, policy);
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
