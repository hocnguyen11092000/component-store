import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiConfiguration {
  rootUrl: string = '/api';
}

/**
 * Parameters for `.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
